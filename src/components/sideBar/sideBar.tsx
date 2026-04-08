import style from "./SideBar.module.css"
import Link from "next/link";

export default function SideBar() {
    return (
        <div className={style.mainDiv}>
            <p>GABAY AYUDA</p>
            <Link href={"./../app/dashboard/page.tsx"}>DASHBOARD</Link>
            <button>RECORDS</button>
        </div>

    )
}