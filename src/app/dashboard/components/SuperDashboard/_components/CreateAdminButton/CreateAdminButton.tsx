"use client";
import style from "./CreateAdminButton.module.css";
import { useState } from "react";

export default function CreateAdminButton() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Admin</button>

            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>

                        <div className={style.modalActions}>
                            <button onClick={() => setIsOpen(false)}>Cancel</button>
                            <button >Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}