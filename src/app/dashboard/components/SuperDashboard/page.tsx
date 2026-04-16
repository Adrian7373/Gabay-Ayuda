import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";

export default async function SuperDashboard() {

    const supabase = await createClient();

    const { data: profiles, error: profileFetchError } = await supabase
        .from("profiles")
        .select("name, role");

    if (!profiles || profileFetchError) {
        throw new Error("Error fetching profiles");
    }

    const { data: sessions, error: sessionFetchError } = await supabase
        .from("batches")
        .select("created_at, name, max_approved, verification_code, deadline, is_active");

    if (!sessions || sessionFetchError) {
        throw new Error("Error fetching sessions");
    }

    return (
        <div className={style.mainDiv}>
            Super Dashboard
        </div>
    )
}