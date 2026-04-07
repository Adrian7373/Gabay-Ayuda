import style from "./PendingApplicationsCard.module.css";

interface PendingApplicationsProp {
    pendingCount: number
}

export default function PendingApplicationsCard({ pendingCount }: PendingApplicationsProp) {
    return (
        <div className={style.mainDiv}>
            <p>PENDING APPLICATIONS</p>
            <p>{pendingCount}</p>
        </div>
    )
}