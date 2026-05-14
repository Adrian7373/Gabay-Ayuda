"use client";
import style from "./EditBatchButton.module.css";
import { useState } from "react";
import BatchForm from "@/app/dashboard/configure/_components/batchForm";
import { SquarePen } from "lucide-react";

interface Profile {
    id: string,
    name: string
}

interface AssignedAdmin {
    adminId: string,
    profiles: Array<{ name: string }>
}

interface EditBatchButtonProps {
    sessionId: string;
    sessionName: string;
    maxApproved: number;
    verificationCode: string;
    deadline: string;
    admins: AssignedAdmin[] | null;
    allProfiles: Profile[] | null;
}

export default function EditBatchButton({
    sessionId,
    sessionName,
    maxApproved,
    verificationCode,
    deadline,
    admins,
    allProfiles
}: EditBatchButtonProps) {

    const [isOpen, setIsOpen] = useState(false);

    const initialData = {
        batchId: sessionId,
        name: sessionName,
        max_approved: maxApproved,
        verification_code: verificationCode,
        deadline: deadline,
        admins: admins || []
    };

    return (
        <div className={style.mainDiv}>
            <button className={style.editButton} onClick={() => setIsOpen(true)}>
                <SquarePen height="1rem" width="1rem" />
                EDIT
            </button>

            {isOpen && (
                <div
                    className={style.modalOverlay}
                    onClick={() => {
                        setIsOpen(false);
                    }}
                >
                    <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={style.header}>
                            <p>EDIT BATCH/SESSION</p>
                            <button
                                className={style.closeButton}
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={style.formWrapper}>
                            <BatchForm
                                initialData={initialData}
                                profiles={allProfiles}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
