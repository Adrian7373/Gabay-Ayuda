import style from "./page.module.css";
import { createClient } from "@supabase/supabase-js";

interface DetailPageProps {
    id: string
}

export async function RecordDetailsPage({ id }: DetailPageProps) {

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: profile, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !profile) {
        return <div>Failed to fetch application data.</div>
    }

    return (
        <div className={style.mainDiv}>

        </div>
    )
}