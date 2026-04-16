"use client";

import style from "./SideBar.module.css"
import Link from "next/link";
import { signoutUser } from "@/app/actions";

export function SideBar() {

    const handleSignOut = () => {
        const hasConfirmed = window.confirm(`Are you sure you want to logout?`);

        if (!hasConfirmed) {
            return;
        }

        signoutUser();
    }


    return (
        <div className={style.mainDiv}>
            <p className={style.title}>GABAY AYUDA</p>
            <div className={style.utils}>
                <Link className={style.dashboardButton} href="/dashboard">DASHBOARD</Link>
                <Link className={style.recordsButton} href="/records">RECORDS</Link>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>

    )
}

export default SideBar;