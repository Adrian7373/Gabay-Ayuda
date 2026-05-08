"use client";
import style from "./ActionButtons.module.css";
import { updateRecordStatus } from "@/app/actions";
import { SquarePen } from "lucide-react";

export default function ActionButtons({ id, status }: { id: string, status: string }) {
    return (
        <>
            <p><SquarePen height="3vh" width="1.5vw" />Actions</p>
            <div className={style.buttonsDiv}>
                {status === "PENDING" ? (
                    <>
                        <button className={style.approveButton} onClick={() => updateRecordStatus(id, "APPROVED")}>APPROVE</button>
                        <button className={style.rejectButton} onClick={() => updateRecordStatus(id, "REJECTED")}>REJECT</button>
                    </>
                ) : status === "APPROVED" ? (
                    <>
                        <button className={style.resetButton} onClick={() => updateRecordStatus(id, "PENDING")}>RESET</button>
                        <button className={style.rejectButton} onClick={() => updateRecordStatus(id, "REJECTED")}>REJECT</button>
                    </>
                ) : status === "REJECTED" ? (
                    <>
                        <button className={style.resetButton} onClick={() => updateRecordStatus(id, "PENDING")}>RESET</button>
                        <button className={style.approveButton} onClick={() => updateRecordStatus(id, "APPROVED")}>APPROVE</button>
                    </>
                ) : null}
            </div>
        </>

    )
}