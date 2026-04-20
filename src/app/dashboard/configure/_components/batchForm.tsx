"use client";
import { useState } from "react";
import style from "./batchForm.module.css";
import { createBatch } from "@/app/actions";

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

    const isEditing = !!initialData;
    const assignedAdminIds = new Set(
        initialData?.admins?.map((admin) => admin.adminId) || []
    );

    const availableProfiles = profiles?.filter(
        (profile) => !assignedAdminIds.has(profile.id)
    ) || [];

    console.log(initialData);

    return (
        <div className={style.mainDiv}>
            {isEditing && (
                <div>
                    <p>Assigned admins:</p>
                    {Array.isArray(initialData?.admins) && initialData.admins.length > 0 ? (
                        initialData.admins.map((admin) => (
                            <>
                                <p key={admin.adminId}>{admin.profiles[0]?.name}</p>
                                <button onClick={unassignAdmin(admin.adminId)}>Unassign</button>
                            </>
                        ))
                    ) : (
                        <p>No admins assigned yet.</p>
                    )}
                </div>
            )}
            <div className={style.formDiv}>
                <form action={createBatch}>
                    {isEditing && (
                        <input type="hidden" name="batchId" value={initialData.batchId} />
                    )}
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
                    {isAddingAdmin ? (
                        <>
                            <label>Assign Admin:
                                <select name="assignedAdmin">
                                    {availableProfiles.length === 0 ? (
                                        <option value="" disabled>No available admins (All assigned)</option>
                                    ) : (
                                        availableProfiles.map((profile) => (
                                            <option key={profile.id} value={profile.id}>
                                                {profile.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </label>
                            <button onClick={() => setIsAddingAdmin(false)}>Cancel</button>
                        </>
                    ) : (
                        <button className={style.newAdminButton} onClick={() => setIsAddingAdmin(true)}>Add a new admin</button>
                    )}

                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    )
}