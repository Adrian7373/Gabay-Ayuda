"use client";
import { useState } from "react";
import style from "./page.module.css";
import { getTrackingDetails } from "@/app/actions";
import { redirect } from "next/navigation";

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

    const handleHome = () => {
        redirect("/");
    }

    return (
        <div className={style.mainDiv}>
            <div className={style.trackDiv}>
                <button type="button" onClick={handleHome} className={style.homeButton1}>&#9664; Home</button>
                <button type="button" onClick={handleHome} className={style.mobileHomeButton1}>&#9664;</button>
                <label className={style.inputLabel}>Enter tracking ID:
                    <input className={style.trackInput} type="text" onChange={(e) => {
                        setId(e.target.value)
                        e.target.value.length > 8 ? setIsValid(true) : setIsValid(false);
                    }} />
                </label>
                <button className={style.trackButton} onClick={handleTracking} disabled={!isvalid}>Track Application</button>

                <div className={style.trackInfo}>
                    <p>{result ? result?.message || "Status:" : ""}</p>
                    <p>{result?.application?.status}</p><br />
                    <p>{result ? result?.message || "Date submitted:" : ""}</p>
                    <p>{result ? new Date(result.application?.created_at).toLocaleDateString() : ""}</p>
                </div>
            </div>
        </div>
    )
}
