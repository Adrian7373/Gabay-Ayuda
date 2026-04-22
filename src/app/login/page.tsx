import style from "./page.module.css";
import LoginForm from "./_components/LoginForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    return (
        <LoginForm />
    )
}