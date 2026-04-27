import { createClient } from "@/utils/supabase/server";
import style from "./page.module.css";
import SideBar from "@/components/SideBar/SideBar";
import PendingApplicationsCard from "./components/PendingApplicationsCard/PendingApplicationsCard";
import ApprovesCard from "./components/ApprovesCard/ApprovesCard";
import RejectsCard from "./components/RejectsCard/RejectsCard";
import RecentApplications from "./components/RecentApplications/RecentApplications";
import { redirect } from "next/navigation";
import SuperDashboard from "./components/SuperDashboard/page";
import { cookies } from "next/headers";

interface BatchOption {
    id: string;
    name: string;
}

interface Application {
    id: string;
    student_level: string;
    name: string;
    status: string;
    created_at: string;
    contact: string;
    address: string;
};

export default async function Dashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
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

    const cookieStore = await cookies();
    const savedCookieId = cookieStore.get("active_batch_id")?.value;

    let assignedBatches: BatchOption[] = [];
    let activeBatchId = savedCookieId;
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

    let pending = 0, approved = 0, rejected = 0, recentApps: Application[] = [];
    let fetchError = null;

    if (activeBatchId && profile.role !== "SUPER_ADMIN") {
        const [
            pendingRes,
            approvedRes,
            rejectedRes,
            recentRes
        ] = await Promise.all([
            supabase.from('applications').select('*', { count: 'exact', head: true })
                .eq('status', 'PENDING')
                .eq('batch_id', activeBatchId), // Filtered!

            supabase.from('applications').select('*', { count: 'exact', head: true })
                .eq('status', 'APPROVED')
                .eq('batch_id', activeBatchId), // Filtered!

            supabase.from('applications').select('*', { count: 'exact', head: true })
                .eq('status', 'REJECTED')
                .eq('batch_id', activeBatchId), // Filtered!

            supabase.from('applications')
                .select('id, student_level, name, status, created_at, contact, address')
                .eq('batch_id', activeBatchId)  // Filtered!
                .order('created_at', { ascending: false })
                .limit(6)
        ]);

        pending = pendingRes.count || 0;
        approved = approvedRes.count || 0;
        rejected = rejectedRes.count || 0;
        recentApps = recentRes.data || [];
        fetchError = pendingRes.error || approvedRes.error || rejectedRes.error || recentRes.error;
    }

    if (fetchError) {
        console.log(fetchError);
        return <div>Failed to fetch data from database.</div>;
    }

    return (
        <div className={style.mainDiv}>
            <SideBar
                assignedBatches={assignedBatches}
                currentBatchId={activeBatchId}
                isFallback={isFallback}
                isAdmin={false}
            />
            {profile.role === "SUPER_ADMIN" ? (
                <SuperDashboard
                    userName={profile.name}
                />
            ) : (
                <div className={style.detailsDiv}>
                    <h1>Profile:{profile.name}</h1>
                    <PendingApplicationsCard
                        pendingCount={pending}
                    />
                    <ApprovesCard
                        approvesCount={approved}
                    />
                    <RejectsCard
                        rejectsCount={rejected}
                    />
                    <RecentApplications
                        recentApps={recentApps}
                    />
                </div>
            )}

        </div>
    )
}