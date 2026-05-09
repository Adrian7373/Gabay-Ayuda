"use client";
import style from "./LoginForm.module.css";
import { authenticateUser } from "@/app/actions";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {

    const router = useRouter();
    const [isAuthing, startTransition] = useTransition();
    const [message, setMessage] = useState<string>();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const { success, message } = await authenticateUser(formData);
            setMessage(message);
            if (success) {
                router.push("/dashboard");
            }
        });
    };

    return (
        <div className={style.mainDiv}>
            {isAuthing ? (
                <div className={style.loadingDiv}>
                    <span className={style.loader}></span>
                    <p>Authenticating User</p>
                </div>
            ) : (
                <div className={style.formDiv}>
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
            )}
        </div>
    )
}