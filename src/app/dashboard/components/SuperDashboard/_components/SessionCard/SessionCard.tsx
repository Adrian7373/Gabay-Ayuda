import style from "./SessionCard.module.css";
import { createClient } from "@/utils/supabase/server";
import ShowCodeButton from "./_components/ShowCodeButton/ShowCodeButton";
import Link from "next/link";

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

    const { data: adminId } = await supabase
        .from("batch_admins")
        .select("admin_id")
        .eq("batch_id", session.id)
        .maybeSingle();


    const { data: admin } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", adminId?.admin_id)
        .maybeSingle();

    const { count, error } = await supabase
        .from("applications")
        .select('*', { count: 'exact', head: true })
        .eq("batch_id", session.id)
        .eq("status", "APPROVED");

    return (
        <div className={style.mainDiv}>
            <p>{session.name}</p>
            <p>{session.is_active ? "ACTIVE" : "INACTIVE"}</p>
            <p>{session.max_approved ? `${count}/${session.max_approved}` : `Approved: ${count}`}</p>
            <ShowCodeButton
                code={session.verification_code}
            />
            <p>{admin ? admin.name : "No assigned admin yet."}</p>
            <p>Application closes at {new Date(session.deadline).toLocaleDateString()}</p>
            <Link href={`/dashboard/configure?id=${session.id}&adminId=${adminId?.admin_id}&admin_name=${admin?.name}`}>EDIT</Link>
        </div>
    )
}