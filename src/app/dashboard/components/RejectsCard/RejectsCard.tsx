import style from "./RejectsCard.module.css";


export default function RejectsCard({ rejectsCount }: { rejectsCount: number }) {
    return (
        <>
            <p>REJECTED</p>
            <p>{rejectsCount}</p>
        </>
    )
}