"use client";
import style from "./ConfigureBatchModal.module.css";
import { useState } from "react";
import BatchForm from "../../../../configure/_components/batchForm";

interface Profile {
    id: string,
    name: string
}

interface ConfigureBatchModalProps {
    profiles: Profile[] | null
}

export default function ConfigureBatchModal({ profiles }: ConfigureBatchModalProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Batch</button>

            {isOpen && (
                <div
                    className={style.modalOverlay}
                    onClick={() => {
                        setIsOpen(false);
                    }}
                >
                    <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={style.header}>
                            <p>CREATE A NEW BATCH/SESSION</p>
                            <button
                                className={style.closeButton}
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={style.formDiv}>
                            <BatchForm
                                initialData={null}
                                profiles={profiles}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
