import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login")
    }

    return (
        <div className="admin-wrapper">
            {children}
        </div>
    );
}