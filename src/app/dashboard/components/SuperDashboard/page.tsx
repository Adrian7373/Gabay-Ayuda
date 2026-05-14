import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import SessionCardList from "./_components/sessionCardList/SessionCardList";
import CreateAdminButton from "./_components/CreateAdminButton/CreateAdminButton";
import ConfigureBatchModal from "./_components/ConfigureBatchModal/ConfigureBatchModal";
import { User } from "lucide-react";

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
            <div className={style.mainHeader}>
                <div>
                    <p>DASHBOARD</p>
                    <ConfigureBatchModal profiles={admins} />
                    <CreateAdminButton />
                </div>
                <p><User height="1rem" width="1rem" />{userName}</p>
            </div>
            <div className={style.sessionListDiv}>
                <SessionCardList
                    sessions={sessions}
                />
            </div>
        </div>
    )
}