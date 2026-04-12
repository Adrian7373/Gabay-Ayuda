"use client";
import style from "./page.module.css";
import { authenticateUser } from "../actions";
import { useTransition } from "react";

export default function LoginForm() {

    const [isAuthing, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            await authenticateUser(formData);
        });
    };

    return (
        <div className={style.formDiv}>

            <div hidden={isAuthing}>
                <p>LOG IN</p>
                <form action={handleSubmit}>
                    <label>Username:
                        <input name="email" type="text" />
                    </label>
                    <label>Password:
                        <input name="password" type="text" />
                    </label>
                    <button type="submit" >Login</button>
                </form>
            </div>

            {isAuthing && (
                <>
                    <span className={style.loader}></span>
                    <p>Authenticating User</p>
                </>
            )}



        </div>
    )
}