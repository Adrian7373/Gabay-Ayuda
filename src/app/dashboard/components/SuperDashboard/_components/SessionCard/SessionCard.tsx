import style from "./SessionCard.module.css";
import { createClient } from "@/utils/supabase/server";
import ShowCodeButton from "./_components/ShowCodeButton/ShowCodeButton";
import Link from "next/link";
import DeleteButton from "./_components/DeleteSessionButton/DeleteSessionButton";
import ChangeStatusButton from "./_components/ChangeBatchStatusButton/ChangeStatusButton";
import AssignAdminButton from "./_components/AssignAdminButton/AssignAdminButton";
import ProgressBar from "./_components/ProgressBar/ProgressBar";
import { SquarePen } from "lucide-react";

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
            <Link className={style.editButton} href={`/dashboard/configure?id=${session.id}&admins=${admins}`}><SquarePen height="1rem" width="1rem" />EDIT</Link>
            <DeleteButton
                sessionId={session.id}
                sessionName={session.name}
            />
        </div>
    )
}