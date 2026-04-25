"use client";
import style from "./CreateAdminButton.module.css";
import { useState } from "react";
import SubmitButton from "./_components/SubmitButton";
import { createNewAdmin } from "@/app/actions";

export default function CreateAdminButton() {

    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Admin</button>

            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <form action="">
                            <label>Name:
                                <input type="text" />
                            </label><br />
                            <label>Email:
                                <input type="text" />
                            </label><br />
                            <label>Password:
                                <input type={showPassword ? "text" : "password"} />
                            </label>
                            <button onClick={() => setShowPassword(!showPassword)}>Show password</button>
                            <div className={style.modalActions}>
                                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                                <SubmitButton />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}