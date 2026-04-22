import style from "./SessionCard.module.css";
import { createClient } from "@/utils/supabase/server";
import ShowCodeButton from "./_components/ShowCodeButton/ShowCodeButton";
import Link from "next/link";
import DeleteButton from "./_components/DeleteSessionButton/DeleteSessionButton";
import { changeBatchStatus } from "@/app/actions";

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

    return (
        <div className={style.mainDiv}>
            <p>{session.name}</p>

            <p>{session.max_approved ? `${count}/${session.max_approved}` : `Approved: ${count}`}</p>
            <ShowCodeButton
                code={session.verification_code}
            />
            <p>
                {admins && admins.length > 0
                    ? admins.map(admin => (admin.profiles as any)?.name).join(", ")
                    : "No assigned admin yet."}
            </p>
            <p>Application closes at {new Date(session.deadline).toLocaleDateString()}</p>
            <Link href={`/dashboard/configure?id=${session.id}&admins=${admins}`}>EDIT</Link>
            <DeleteButton
                sessionId={session.id}
                sessionName={session.name}
            />
        </div>
    )
}