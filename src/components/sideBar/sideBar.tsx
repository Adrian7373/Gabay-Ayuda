"use client";
import { useEffect } from "react";
import style from "./SideBar.module.css"
import Link from "next/link";
import { setActiveBatch, signoutUser } from "@/app/actions";

interface BatchOption {
    id: string;
    name: string;
}

interface SideBarProps {
    assignedBatches?: BatchOption[];
    currentBatchId?: string;
    isFallback?: boolean;
    isAdmin: boolean;
}

export function SideBar({ assignedBatches = [], currentBatchId = "", isFallback = false, isAdmin }: SideBarProps) {

    useEffect(() => {
        if (isFallback && currentBatchId) {
            setActiveBatch(currentBatchId);
        }
    }, [isFallback, currentBatchId]);

    const handleSignOut = () => {
        const hasConfirmed = window.confirm(`Are you sure you want to logout?`);

        if (!hasConfirmed) {
            return;
        }

        signoutUser();
    }

    const handleBatchChange = async (newBatchId: string) => {
        await setActiveBatch(newBatchId)
    }

    return (
        <div className={style.mainDiv}>
            <p className={style.title}>GABAY AYUDA</p>
            {assignedBatches.length > 0 && (
                <div className={style.batchDiv}>
                    <p>Active Branches:</p>
                    <select value={currentBatchId} name="currentBatch" onChange={(e) => handleBatchChange(e.target.value)}>
                        <option value="" disabled>Select a batch</option>
                        {assignedBatches.map((batch) => (
                            <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className={style.utils}>
                <Link className={style.dashboardButton} href="/dashboard">DASHBOARD</Link>
                {isAdmin && (
                    <Link className={style.recordsButton} href="/records">RECORDS</Link>
                )}
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>

    )
}

export default SideBar;