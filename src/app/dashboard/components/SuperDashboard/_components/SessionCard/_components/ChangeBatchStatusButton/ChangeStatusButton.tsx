"use client";
import { useState } from "react";
import style from "./ChangeStatusButton.module.css";
import { changeBatchStatus } from "@/app/actions";

export default function ChangeStatusButton({ sessionStatus, sessionId }: { sessionStatus: boolean, sessionId: string }) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => changeBatchStatus(sessionStatus, sessionId)}>{sessionStatus ? "DEACTIVATE" : "ACTIVATE"}</button>
            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                    </div>
                </div>
            )}

        </div>

    )
}