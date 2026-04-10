import SideBar from "@/components/SideBar/SideBar";
import RecordsTable from "./_components/RecordsTable";
import { createClient } from "@/utils/supabase/server";
import style from "./page.module.css";
import { redirect } from "next/navigation";

export default async function Records() {

    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login")
    }

    const { data, error } = await supabase
        .from("applications")
        .select("id, name, student_level, status, created_at, contact");

    if (error || data == null) {
        return <div>Failed to fetch data from database.</div>
    }

    return (
        <div className={style.mainDiv}>
            <SideBar />
            <p>RECORDS</p>
            <RecordsTable
                applications={data}
            />
        </div>
    )
}