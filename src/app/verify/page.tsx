"use client";
import style from "./page.module.css";
import { verifyCode } from "@/app/actions";
import { useState } from "react";

export default function VerifyPage() {

    const [code, setCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleVerify = async () => {
        if (!code) return;

        const response = await verifyCode(code);

        if (!response.success) setMessage(response.message);

    }

    return (
        <div className={style.mainDiv}>
            <p>Enter Verification Code</p>
            <input type="text" onChange={(e) => setCode(e.target.value)} />
            <p>{message}</p>
            <button className={style.verifyButton} onClick={handleVerify}>Verify</button>
        </div>
    )
}