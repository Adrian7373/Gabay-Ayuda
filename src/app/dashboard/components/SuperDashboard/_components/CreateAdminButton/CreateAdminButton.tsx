"use client";
import style from "./CreateAdminButton.module.css";
import { useState } from "react";

export default function CreateAdminButton() {

    const [isOpen, setIsOpen] = useState(false);
    const [newAdminName, setNewAdminName] = useState("");
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Admin</button>

            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <label>Name:
                            <input type="text" onChange={(e) => setNewAdminName(e.target.value)} />
                        </label>
                        <label>Email:
                            <input type="text" onChange={(e) => setNewAdminEmail(e.target.value)} />
                        </label>
                        <label>Password:
                            <input type="password" onChange={(e) => setNewAdminPassword(e.target.value)} />
                        </label>
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