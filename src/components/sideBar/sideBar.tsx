"use client";

import style from "./SideBar.module.css"
import Link from "next/link";

export function SideBar() {
    return (
        <div className={style.mainDiv}>
            <p>GABAY AYUDA</p>
            <Link href="/dashboard">DASHBOARD</Link>
            <Link href="/records">RECORDS</Link>
        </div>

    )
}

export default SideBar;