import style from "./AssignAdminButton.module.css";

interface Profile {
    id: string,
    name: string
}

interface AssignAdminButtonProps {
    profiles: Profile[] | null
}

export default function AssignAdminButton({ profiles }: AssignAdminButtonProps) {
    return (
        <button>Assign Admin</button>
    )
}