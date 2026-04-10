"use client";
import style from "./ActionButtons.module.css";
import { updateRecordStatus } from "@/app/actions"

export default function ActionButtons({ id }: { id: string }) {
    return (
        <div><button onClick={() => updateRecordStatus(id, "APPROVED")}>Approve</button>
            <button onClick={() => updateRecordStatus(id, "REJECTED")}>Reject</button></div>

    )
}