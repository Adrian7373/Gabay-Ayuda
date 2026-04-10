"use client";
import style from "./page.module.css";
import { authenticateUser } from "../actions";

export default function LoginForm() {

    return (
        <div className={style.formDiv}>
            <p>LOG IN</p>
            <form action={authenticateUser}>
                <label>Username:
                    <input name="email" type="text" />
                </label>
                <label>Password:
                    <input name="password" type="text" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}