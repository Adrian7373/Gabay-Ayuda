"use client";
import style from "./CreateAdminButton.module.css";
import { useActionState, useState } from "react";
import SubmitButton from "./_components/SubmitButton";
import { createNewAdmin } from "@/app/actions";
import { Eye, EyeOff } from "lucide-react";

const initialState = {
    success: false,
    message: "",
    errors: null,
};

export default function CreateAdminButton() {

    const [state, formAction, isPending] = useActionState(createNewAdmin, initialState)
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Admin</button>

            {isOpen && (
                <div
                    className={style.modalOverlay}
                    onClick={() => {
                        if (!isPending) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                        <p>Create new Admin</p>
                        <form action={formAction}>
                            <label>Name
                                <input name="name" type="text" disabled={isPending} />
                            </label>
                            <label>Email
                                <input name="email" type="text" disabled={isPending} />
                            </label>
                            <label>Password
                                <div>
                                    <input name="password" type={showPassword ? "text" : "password"} disabled={isPending} />
                                    <button className={style.showPasswordButton} type="button" onClick={() => setShowPassword(!showPassword)} disabled={isPending}>{!showPassword ? <Eye height="1rem" width="1rem" /> : <EyeOff height="1rem" width="1rem" />}</button>
                                </div>
                            </label>

                            <div className={style.modalActions}>
                                <button type="button" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</button>
                                <SubmitButton
                                    isPending={isPending}
                                />
                                <p>
                                    {isPending ? "Creating account, please wait..." : (state.errors
                                        ? `${state.message}, ${state.errors}`
                                        : `${state.message}`)}
                                </p>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}