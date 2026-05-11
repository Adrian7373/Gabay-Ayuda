"use client";
import { useEffect } from "react";
import style from "./SideBar.module.css"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setActiveBatch, signoutUser } from "@/app/actions";
import { LogOut, LayoutDashboard, Archive } from "lucide-react";

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
    const pathname = usePathname();

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
        <>
            <img className={style.logo} src="/EduGrant.png" alt="EduGrandLogo" />
            {assignedBatches.length > 0 && (
                <div className={style.batchDiv}>
                    <p>Active Branches:</p>
                    <select className={style.branchSelect} value={currentBatchId} name="currentBatch" onChange={(e) => handleBatchChange(e.target.value)}>
                        <option value="" disabled>Select a batch</option>
                        {assignedBatches.map((batch) => (
                            <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className={style.utils}>
                <Link className={`${style.dashboardButton} ${pathname === "/dashboard" ? style.active : style.inactive}`} href="/dashboard"><LayoutDashboard height="1.5em" width="1.5em" />DASHBOARD</Link>
                {isAdmin && (
                    <Link className={`${style.recordsButton} ${pathname === "/records" ? style.active : style.inactive}`} href="/records"><Archive height="1.5em" width="1.5em" />RECORDS</Link>
                )}
                <button className={style.signoutButton} onClick={handleSignOut}><LogOut
                    height="1em"
                    width="1em"
                />Sign Out</button>
            </div>
        </>

    )
}

export default SideBar;