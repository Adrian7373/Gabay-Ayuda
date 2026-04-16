import { createClient } from "@/utils/supabase/server";
import style from "./page.module.css";
import SideBar from "@/components/SideBar/SideBar";
import PendingApplicationsCard from "./components/PendingApplicationsCard/PendingApplicationsCard";
import ApprovesCard from "./components/ApprovesCard/ApprovesCard";
import RejectsCard from "./components/RejectsCard/RejectsCard";
import RecentApplications from "./components/RecentApplications/RecentApplications";
import { redirect } from "next/navigation";
import SuperDashboard from "./components/SuperDashboard/page";

export default async function Dashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("id", user.id)
        .single()


    const [{ count: pending },
        { count: approved },
        { count: rejected },
        { data: recentApps, error }] = await Promise.all([

            supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'PENDING'),

            supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'APPROVED'),

            supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'REJECTED'),

            supabase
                .from('applications')
                .select('id, student_level, name, status, created_at, contact, address')
                .order('created_at', { ascending: false })
                .limit(6)

        ]);

    if (pending == null || approved == null || rejected == null || recentApps == null) {
        console.log(error);
        return <div>Failed to fetch data from database.</div>
    }

    return (
        <div className={style.mainDiv}>
            <SideBar />
            {profile?.role === "SUPER_ADMIN" ? (
                <SuperDashboard />
            ) : (
                <div className={style.detailsDiv}>
                    <h1>Profile:{profile?.name}</h1>
                    <PendingApplicationsCard
                        pendingCount={pending}
                    />
                    <ApprovesCard
                        approvesCount={approved}
                    />
                    <RejectsCard
                        rejectsCount={rejected}
                    />
                    <RecentApplications
                        recentApps={recentApps}
                    />
                </div>
            )}

        </div>
    )
}