import style from "./PendingApplicationsCard.module.css";


export default function PendingApplicationsCard({ pendingCount }: { pendingCount: number }) {
    return (
        <>
            <p>PENDING APPLICATIONS</p>
            <p>{pendingCount}</p>
        </>
    )
}