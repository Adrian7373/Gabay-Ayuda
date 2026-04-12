import style from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={style.mainDiv}>
      <p className={style.header}>Gabay Ayuda: Empowering the Future of Our Youth</p>
      <Link href="/apply">Apply for Assistance</Link>
      <Link href="/track">Track my Application</Link>
    </div>
  )
}