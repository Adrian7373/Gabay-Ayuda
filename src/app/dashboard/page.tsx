import { createClient } from "@/utils/supabase/server";
import style from "./page.module.css";
import SideBar from "@/components/SideBar/SideBar";
import PendingApplicationsCard from "./components/PendingApplicationsCard/PendingApplicationsCard";
import ApprovesCard from "./components/ApprovesCard/ApprovesCard";
import RejectsCard from "./components/RejectsCard/RejectsCard";
import RecentApplications from "./components/RecentApplications/RecentApplications";

export default async function Dashboard() {
    const supabase = await createClient();

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
    )
}