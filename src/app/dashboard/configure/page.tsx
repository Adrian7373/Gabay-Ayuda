import { redirect } from "next/navigation";
import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";

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
            <div className={style.formDiv}>
                <form action="">
                    <label>Name:
                        <input type="text" />
                    </label>
                    <label>Max Beneficiaries:
                        <input type="text" />
                    </label>
                    <label>Set Verification Code:
                        <input type="text" />
                    </label>
                    <label>Deadline:
                        <input type="date" />
                    </label>
                    <label>Assign Admin:
                        <select name="" id="">
                            {!profiles ? (
                                <option value="" disabled >No admin available</option>
                            ) : (
                                profiles.map((profile) => (
                                    <option key={profile.id} value={profile.id}>{profile.name}</option>
                                ))
                            )}
                        </select>
                    </label>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    )
}