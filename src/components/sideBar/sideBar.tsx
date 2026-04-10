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
            <p>GABAY AYUDA</p>
            <Link href="/dashboard">DASHBOARD</Link>
            <Link href="/records">RECORDS</Link>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>

    )
}

export default SideBar;