import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import SessionCardList from "./_components/sessionCardList/SessionCardList";
import Link from "next/link";
import CreateAdminButton from "./_components/CreateAdminButton/CreateAdminButton";

interface SuperDashboardProps {
    userName: string
}

export default async function SuperDashboard({ userName }: SuperDashboardProps) {

    const supabase = await createClient();

    const { data: sessions, error: sessionFetchError } = await supabase
        .from("batches")
        .select("id, name, max_approved, verification_code, deadline, is_active");

    if (!sessions || sessionFetchError) {
        throw new Error("Error fetching sessions");
    }

    const { data: admins } = await supabase
        .from("profiles")
        .select("id, name");

    return (
        <div className={style.mainDiv}>
            <div className={style.header}>
                <div>
                    <p>DASHBOARD</p>
                    <Link className={style.newBatchButton} href="/dashboard/configure">Create new Batch</Link>
                    <CreateAdminButton />
                </div>
                <p>{userName}</p>
            </div>
            <div className={style.sessionListDiv}>
                <SessionCardList
                    sessions={sessions}
                />
            </div>
        </div>
    )
}