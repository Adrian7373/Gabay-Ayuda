import style from "./page.module.css";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import CopyButton from "./_components/CopyButton";

interface SuccessProps {
    searchParams: Promise<{ id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessProps) {

    const { id } = await searchParams;

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("applications")
        .select("status");

    if (error) {
        throw new Error("Failed to get application count", error);
    }

    const appsCount = data.length;
    const approvesCount = data.filter((record) => record.status === "APPROVED").length;

    return (
        <div className={style.mainDiv}>
            <p>Thank You! Your application has been submitted successfully!</p>
            <div>
                Total applicants:{appsCount}
            </div>
            <div>
                Total approved applicants:{approvesCount}
            </div>
            <div className={style.copyTrackID}>
                <p>Your application tracking ID:{id}</p><CopyButton text={id || ""} />
            </div>
            <p>Please save your tracking ID.</p>
            <Link className={style.trackButton} href="/track">Track your application</Link>
        </div>
    )
}