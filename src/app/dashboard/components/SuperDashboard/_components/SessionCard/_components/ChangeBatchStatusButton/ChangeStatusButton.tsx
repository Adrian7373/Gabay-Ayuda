"use client";
import { useState } from "react";
import style from "./ChangeStatusButton.module.css";
import { changeBatchStatus } from "@/app/actions";

export default function ChangeStatusButton({ sessionStatus, sessionId }: { sessionStatus: boolean, sessionId: string }) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>{sessionStatus ? "DEACTIVATE" : "ACTIVATE"}</button>
            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <p>{sessionStatus ? "Deactivate" : "Activate"}this session?</p>
                        <button onClick={() => setIsOpen(false)}>Cancel</button>
                        <button onClick={() => changeBatchStatus(sessionStatus, sessionId)}>Confirm</button>
                    </div>
                </div>
            )}

        </div>

    )
}