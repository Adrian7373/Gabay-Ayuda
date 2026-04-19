import { redirect } from "next/navigation";
import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import BatchForm from "./_components/batchForm";

export default async function Configure() {

    const supabase = await createClient();
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
                profiles={profiles || null}
            />
        </div>
    )
}