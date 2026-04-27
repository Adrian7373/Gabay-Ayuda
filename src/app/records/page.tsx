import SideBar from "@/components/SideBar/SideBar";
import RecordsTable from "./_components/RecordsTable";
import { createClient } from "@/utils/supabase/server";
import style from "./page.module.css";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface BatchOption {
    id: string;
    name: string;
}

export default async function Records() {

    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login")
    }

    const cookieStore = await cookies();
    const savedCookieId = cookieStore.get("active_batch_id")?.value;

    let activeBatchId = savedCookieId;

    const { data, error } = await supabase
        .from("applications")
        .select("id, name, student_level, status, created_at, contact")
        .eq("batch_id", activeBatchId);

    if (error || data == null) {
        return <div>Failed to fetch data from database.</div>
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        console.log(profileError);
        return <div>Failed to fetch user profile.</div>;
    }

    let assignedBatches: BatchOption[] = [];
    let isFallback = false;

    if (profile.role === "ADMIN") {
        const { data: adminBatches, error: adminBatchesError } = await supabase
            .from("batch_admins")
            .select("batch_id, batches(name, created_at)")
            .eq("admin_id", user.id);

        if (adminBatchesError) {
            console.log(adminBatchesError);
            return <div>Failed to fetch assigned batches.</div>;
        }

        assignedBatches = adminBatches?.map((ab) => {
            const batchData = ab.batches as any;
            return {
                id: ab.batch_id,
                name: batchData?.name ?? "Unnamed batch",
                createdAt: batchData?.created_at
            };
        }).filter((batch) => Boolean(batch.id)) || [];

        const hasCookieMatch = assignedBatches.some((batch) => batch.id === activeBatchId);

        // Auto-select if cookie is missing or stale.
        if ((!activeBatchId || !hasCookieMatch) && assignedBatches.length > 0) {
            activeBatchId = assignedBatches[0].id;
            isFallback = true;
        }
    }

    return (
        <div className={style.mainDiv}>
            <SideBar
                assignedBatches={assignedBatches}
                currentBatchId={activeBatchId}
                isFallback={isFallback}
            />
            <p>RECORDS</p>
            <RecordsTable
                applications={data}
            />
        </div>
    )
}