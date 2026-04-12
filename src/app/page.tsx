import style from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={style.mainDiv}>
      <p className={style.header}>Gabay Ayuda: Empowering the Future of Our Youth</p>
      <button className={style.applyButton}>Apply for Assistance</button>
      <Link href="/track">Track my Application</Link>
      <Link href="/login">Login (for admins only)</Link>
    </div>
  )
}