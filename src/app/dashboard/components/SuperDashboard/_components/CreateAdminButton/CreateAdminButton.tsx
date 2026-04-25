"use client";
import { useFormStatus } from "react-dom";
import style from "./CreateAdminButton.module.css";
import { useState } from "react";

export default function CreateAdminButton() {

    const [isOpen, setIsOpen] = useState(false);
    const [newAdminName, setNewAdminName] = useState("");
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Admin</button>

            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <label>Name:
                            <input type="text" onChange={(e) => setNewAdminName(e.target.value)} />
                        </label><br />
                        <label>Email:
                            <input type="text" onChange={(e) => setNewAdminEmail(e.target.value)} />
                        </label><br />
                        <label>Password:
                            <input type={showPassword ? "text" : "password"} onChange={(e) => setNewAdminPassword(e.target.value)} />
                        </label>
                        <button onClick={() => setShowPassword(!showPassword)}>Show password</button>
                        <div className={style.modalActions}>
                            <button onClick={() => setIsOpen(false)}>Cancel</button>
                            <button onClick={handleSubmit}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}