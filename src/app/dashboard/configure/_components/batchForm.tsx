"use client";
import style from "./batchForm.module.css";
import { createBatch } from "@/app/actions";

interface Profile {
    id: string,
    name: string
}

interface BatchFormProps {
    profiles: Profile[] | null
}

export default function BatchForm({ profiles }: BatchFormProps) {
    return (
        <div className={style.mainDiv}>
            <div className={style.formDiv}>
                <form action={createBatch}>
                    <label>Name:
                        <input name="name" type="text" required />
                    </label>
                    <label>Max Beneficiaries:
                        <input name="max_ben" type="text" />
                    </label>
                    <label>Set Verification Code:
                        <input name="code" type="text" required />
                    </label>
                    <label>Deadline:
                        <input name="deadline" type="date" />
                    </label>
                    <label>Assign Admin:
                        <select name="assignedAdmin">
                            {!profiles ? (
                                <option value="" disabled >No admin available</option>
                            ) : (
                                profiles.map((profile) => (
                                    <option key={profile.id} value={profile.id}>{profile.name}</option>
                                ))
                            )}
                        </select>
                    </label>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    )
}