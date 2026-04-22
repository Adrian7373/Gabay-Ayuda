"use client";
import style from "./ChangeStatusButton.module.css";
import { changeBatchStatus } from "@/app/actions";

export default function ChangeStatusButton({ sessionStatus, sessionId }: { sessionStatus: boolean, sessionId: string }) {
    return (
        <button onClick={() => changeBatchStatus(sessionStatus, sessionId)}>{sessionStatus ? "DEACTIVATE" : "ACTIVATE"}</button>
    )
}