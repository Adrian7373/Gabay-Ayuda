import style from "./ApprovesCard.module.css";


export default function ApprovesCard({ approvesCount }: { approvesCount: number }) {
    return (
        <>
            <p>APPROVED</p>
            <p>{approvesCount}</p>
        </>
    )
}