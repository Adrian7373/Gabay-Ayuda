"use client";
import { useEffect, useState } from "react";
import style from "./page.module.css";
import { getApplicationCount } from "@/app/actions";
import { redirect } from "next/navigation";

//Will refractor later to be a server component

export default function SuccessPage() {

    const [appsCount, setAppsCount] = useState<number>(0);
    const [approvesCount, setApprovesCount] = useState<number>(0);

    useEffect(() => {
        const getCount = async () => {
            const { fullCount, approvedCount } = await getApplicationCount();
            setAppsCount(fullCount);
            setApprovesCount(approvedCount);
        }
        getCount();
    }, []);

    return (
        <div className={style.mainDiv}>
            <p>Thank You! Your application has been submitted successfully!</p>
            <div>
                Total applicants:{appsCount}
            </div>
            <div>
                Total approved applicants:{approvesCount}
            </div>
            <button onClick={() => redirect("/track")}>Track your application</button>
        </div>
    )
}