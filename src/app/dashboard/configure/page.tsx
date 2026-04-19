import { redirect } from "next/navigation";
import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import BatchForm from "./_components/batchForm";

interface ConfigurePageProps {
    searchParams: Promise<{
        id?: string,
        adminId?: string,
        adminName?: string
    }>
}

export default async function Configure({ searchParams }: ConfigurePageProps) {

    const supabase = await createClient();

    //unwrapping data
    const resolvedParams = await searchParams;

    //ROLE VALIDATION//
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role,name")
        .eq("id", user.id)
        .eq("role", "SUPER_ADMIN")
        .maybeSingle();

    if (!profile) {
        redirect("/dashboard");
    }
    //ROLE VALIDATION//

    const editId = resolvedParams.id;
    let initialData = null;

    if (editId) {
        const { data: batchData } = await supabase
            .from("batches")
            .select("name, max_approved, verification_code, deadline, is_active")
            .eq("id", editId)
            .single()

        initialData = { ...batchData, adminName: resolvedParams.adminName, adminId: resolvedParams.adminId, batchId: resolvedParams.id };
    }

    const { data: profiles } = await supabase
        .from("profiles")
        .select("name,id")
        .eq("role", "ADMIN");

    return (
        <div className={style.mainDiv}>
            <div className={style.header}>
                <p>CREATE A NEW BATCH/SESSION</p>
                <p>{profile.name}</p>
            </div>
            <BatchForm
                initialData={initialData || null}
                profiles={profiles || null}
            />
        </div>
    )
}