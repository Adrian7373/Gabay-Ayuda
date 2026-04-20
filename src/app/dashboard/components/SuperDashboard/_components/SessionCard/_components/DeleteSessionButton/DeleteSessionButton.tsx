"use client";
import { useState } from "react";
import style from "./DeleteSessionButton.module.css";
import { deleteSession } from "@/app/actions";

interface DeleteSessionProps {
    sessionId: string,
    sessionName: string
}

export default function DeleteButton({ sessionId, sessionName }: DeleteSessionProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Delete Session</button>

            {
                isOpen && (
                    <div className={style.modalOverlay}>
                        <div className={style.modalContent}>
                            <p>Are you sure?</p>
                            <p>This action cannot be undone. This will permanently delete {sessionName} session</p>
                            <p>Please type "<b>{sessionName}</b>" to confirm</p>
                            <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                            <div className={style.modalActions}>
                                <button onClick={() => setIsOpen(false)}>Cancel</button>
                                <button onClick={() => deleteSession(sessionId)} disabled={confirmText !== sessionName}>Delete</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}