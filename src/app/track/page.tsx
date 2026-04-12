"use client";
import { useState } from "react";
import style from "./page.module.css";
import { getTrackingDetails } from "@/app/actions";
import Link from "next/link";

interface Result {
    application?: {
        status: string,
        created_at: string
    }
    message?: string
}

export default function TrackPage() {

    const [id, setId] = useState<string>("");
    const [isvalid, setIsValid] = useState<boolean>(false);
    const [result, setResult] = useState<Result | null>(null);

    const handleTracking = async () => {
        const details = await getTrackingDetails(id);
        setResult(details);
    }

    return (
        <div className={style.mainDiv}>
            <label>Enter tracking ID:
                <input type="text" onChange={(e) => {
                    setId(e.target.value)
                    e.target.value.length > 8 ? setIsValid(true) : setIsValid(false);
                }} />
            </label>
            <button onClick={handleTracking} disabled={!isvalid}>Track Application</button>

            <p>{result?.message || "Status:"}</p>
            <p>{result?.application?.status}</p><br />
            <p>{result?.message || "Application submitted on:"}</p>
            <p>{result?.application?.created_at}</p>
            <Link href={"/"}>Go back</Link>
        </div>
    )
}
