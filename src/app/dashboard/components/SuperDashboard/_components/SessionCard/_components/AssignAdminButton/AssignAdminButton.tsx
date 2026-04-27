"use client";
import { useState } from "react";
import style from "./AssignAdminButton.module.css";

interface Profile {
    id: string,
    name: string
}

interface AssignAdminButtonProps {
    profiles: Profile[] | null
    sessionId: string
}

export default function AssignAdminButton({ profiles, sessionId }: AssignAdminButtonProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Assign Admin</button>
            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <form action="">
                            <input type="hidden" value={sessionId} name="sessionId" />
                            {profiles?.map((profile) => (
                                <label>
                                    <input name="adminId" value={profile.id} key={profile.id} type="checkbox" />
                                    {profile.name}
                                </label>
                            ))}
                            <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                            <button type="submit">Assign</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}