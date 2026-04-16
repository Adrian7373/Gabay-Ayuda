"use client";
import style from "./page.module.css";
import { authenticateUser } from "../actions";
import { useTransition, useState } from "react";

export default function LoginForm() {

    const [isAuthing, startTransition] = useTransition();
    const [message, setMessage] = useState<string>();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const { message } = await authenticateUser(formData);
            setMessage(message);
        });
    };

    return (
        <div className={style.mainDiv}>

            <div className={style.formDiv} hidden={isAuthing}>
                <p>Log In</p>
                <form action={handleSubmit}>
                    <label>Username:
                        <input name="email" type="text" />
                    </label>
                    <label>Password:
                        <input name="password" type="text" />
                    </label>
                    <p>{message}</p>
                    <button className={style.loginButton} type="submit" >Login</button>
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