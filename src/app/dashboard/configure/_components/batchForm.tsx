"use client";
import { useState } from "react";
import style from "./batchForm.module.css";
import { createBatch, } from "@/app/actions";


interface Profile {
    id: string,
    name: string
}

interface AssignedProfile {
    name: string
}

interface admin {
    adminId: string,
    profiles: AssignedProfile[]
}

interface BatchFormProps {
    profiles: Profile[] | null
    initialData?: {
        batchId?: string,
        name?: string,
        max_approved?: number,
        verification_code?: string,
        deadline?: string,
        is_active?: boolean
        admins: admin[]
    } | null
}

export default function BatchForm({ profiles, initialData }: BatchFormProps) {

    const [isAddingAdmin, setIsAddingAdmin] = useState(false);
    const [unassignedAdmins, setUnassignedAdmins] = useState<string[]>([]);
    console.log(unassignedAdmins);
    const handleUnassign = (adminId: string) => {
        setUnassignedAdmins([...unassignedAdmins, adminId]);
    }

    const handleReassign = (adminId: string) => {
        setUnassignedAdmins(prevItems => prevItems.filter(item => item !== adminId));
    }

    const isEditing = !!initialData;
    const assignedAdminIds = new Set(
        initialData?.admins?.map((admin) => admin.adminId) || []
    );

    const availableProfiles = profiles?.filter(
        (profile) => !assignedAdminIds.has(profile.id)
    ) || [];

    console.log(initialData);

    return (
        <div className={style.root}>
            {isEditing && (
                <div className={style.assignedAdminsSection}>
                    <p>Assigned admins:</p>
                    {Array.isArray(initialData?.admins) && initialData.admins.length > 0 ? (
                        initialData.admins.map((admin) => (
                            <div key={admin.adminId} className={style.assignedAdminRow}>
                                <p>{admin.profiles[0]?.name}</p>
                                {unassignedAdmins.includes(admin.adminId) ? (
                                    <button type="button" onClick={() => handleReassign(admin.adminId)}>Reassign</button>
                                ) : (
                                    <button type="button" onClick={() => handleUnassign(admin.adminId)}>Unassign</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No admins assigned yet.</p>
                    )}
                </div>
            )}
            <form className={style.assignForm} action={async (formData) => {
                await createBatch(unassignedAdmins, formData);
            }}>
                <div className={style.formContent}>
                    <div className={style.formDetailsColumn}>
                        {isEditing && (
                            <input type="hidden" name="batchId" value={initialData.batchId} />
                        )}
                        <div className={style.formDetails}>
                            <label>Name:
                                <input name="name" type="text" required defaultValue={initialData?.name} />
                            </label>
                            <label>Max Beneficiaries:
                                <input name="max_ben" type="text" defaultValue={initialData?.max_approved} />
                            </label>
                            <label>Set Verification Code:
                                <input name="code" type="text" required defaultValue={initialData?.verification_code} />
                            </label>
                            <label>Deadline:
                                <input name="deadline" type="date" defaultValue={initialData?.deadline} />
                            </label>
                        </div>
                    </div>
                    {isAddingAdmin ? (
                        <div className={style.assignDiv}>
                            <label>Assign Admins:
                                <div>
                                    {availableProfiles.length === 0 ? (
                                        <p>No available admins (All assigned)</p>
                                    ) : (
                                        availableProfiles.map((profile) => (
                                            <label key={profile.id} className={style.checkboxItem}>
                                                <input
                                                    type="checkbox"
                                                    name="assignedAdmins"
                                                    value={profile.id}
                                                />
                                                {profile.name}
                                            </label>
                                        ))
                                    )}
                                </div>
                            </label>
                            <button type="button" onClick={() => setIsAddingAdmin(false)}>Cancel</button>
                        </div>
                    ) : (
                                <div className={style.assignDiv}>
                                    <p className={style.assignHint}>
                                        Assign admins to this batch now, or add them later after creating it.
                                    </p>
                                    <button type="button" className={style.newAdminButton} onClick={() => setIsAddingAdmin(true)}>
                                        Add a new admin
                                    </button>
                                </div>
                    )}
                </div>
                <div className={style.submitRow}>
                    <button type="submit">{initialData ? "Update" : "Create"}</button>
                </div>
            </form>
        </div>
    )
}