import style from "./page.module.css";
import LoginForm from "./_components/LoginForm";
import { createClient } from "@/utils/supabase/server";

export default function LoginPage() {



    return (
        <LoginForm />
    )
}