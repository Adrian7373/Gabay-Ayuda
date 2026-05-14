import style from "./SessionCard.module.css";
import { createClient } from "@/utils/supabase/server";
import ShowCodeButton from "./_components/ShowCodeButton/ShowCodeButton";
import DeleteButton from "./_components/DeleteSessionButton/DeleteSessionButton";
import ChangeStatusButton from "./_components/ChangeBatchStatusButton/ChangeStatusButton";
import AssignAdminButton from "./_components/AssignAdminButton/AssignAdminButton";
import EditBatchButton from "./_components/EditBatchButton/EditBatchButton";
import ProgressBar from "./_components/ProgressBar/ProgressBar";

interface SessionCardProps {
    session: {
        id: string;
        name: string;
        max_approved: number;
        verification_code: string;
        deadline: string;
        is_active: boolean;
    }
}


export default async function SessionCard({ session }: SessionCardProps) {

    const supabase = await createClient();

    const { data: admins, error: adminError } = await supabase
        .from("batch_admins")
        .select(`
        admin_id,
        profiles (
            name
        )
    `)
        .eq("batch_id", session.id);

    const { count, error } = await supabase
        .from("applications")
        .select('*', { count: 'exact', head: true })
        .eq("batch_id", session.id)
        .eq("status", "APPROVED");

    const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "ADMIN")

    return (
        <div className={style.mainDiv}>
            <p>{session.name}</p>
            <ChangeStatusButton
                sessionStatus={session.is_active}
                sessionId={session.id}
            />
            <ProgressBar
                current={count}
                max={session.max_approved}
            />
            <ShowCodeButton
                code={session.verification_code}
            />

            {admins && admins.length > 0
                ? <p className={style.assignedAdmins}> {admins.map(admin => (admin.profiles as any)?.name).join(", ")}</p>
                : <AssignAdminButton
                    sessionId={session.id}
                    profiles={allProfiles}
                />}

            <p>Application closes at {new Date(session.deadline).toLocaleDateString()}</p>
            <EditBatchButton
                sessionId={session.id}
                sessionName={session.name}
                maxApproved={session.max_approved}
                verificationCode={session.verification_code}
                deadline={session.deadline}
                admins={admins?.map(a => ({
                    adminId: a.admin_id,
                    profiles: Array.isArray(a.profiles) ? a.profiles : [a.profiles]
                })) || null}
                allProfiles={allProfiles}
            />
            <DeleteButton
                sessionId={session.id}
                sessionName={session.name}
            />
        </div>
    )
}