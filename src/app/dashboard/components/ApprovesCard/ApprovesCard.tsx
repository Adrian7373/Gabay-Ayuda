import style from "./ApprovesCard.module.css";


export default function ApprovesCard({ approvesCount }: { approvesCount: number }) {
    return (
        <div className={style.mainDiv}>
            <p>APPROVED</p>
            <p>{approvesCount}</p>
        </div>
    )
}