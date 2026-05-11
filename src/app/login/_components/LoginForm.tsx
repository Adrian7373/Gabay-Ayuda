"use client";
import style from "./LoginForm.module.css";
import { authenticateUser } from "@/app/actions";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {

    const router = useRouter();
    const [isAuthing, startTransition] = useTransition();
    const [message, setMessage] = useState<string>();
    const [isShowing, setIsShowing] = useState(false);

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
                        <label className={style.passwordLabel}>Password:
                            <div>
                                <input name="password" type={isShowing ? "text" : "password"} />
                                <button type="button" className={style.showPasswordButton}>{isShowing ? <EyeOff width="1rem" height="1rem" /> : <Eye width="1rem" height="1rem" />}</button>
                            </div>
                        </label>
                        <p>{message}</p>
                        <button className={style.loginButton} type="submit" >Login</button>
                    </form>
                </div>
            )}
        </div>
    )
}