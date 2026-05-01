import style from "./TotalApplicationsCard.module.css";

export default function TotalApplicationsCard({ totalCount }: { totalCount: number }) {
    return (
        <>
            <p>TOTAL APPLICATIONS</p>
            <p>{totalCount}</p>
        </>
    )
}