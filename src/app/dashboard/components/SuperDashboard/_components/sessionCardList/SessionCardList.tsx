import style from "./SessionCardList.module.css";
import SessionCard from "../SessionCard/SessionCard";


interface Session {
    id: string;
    name: string;
    max_approved: number;
    verification_code: string;
    deadline: string;
    is_active: boolean;
}

interface SessionCardListProps {
    sessions: Session[]
}

export default function SessionCardList({ sessions }: SessionCardListProps) {



    return (
        <div className={style.mainDiv}>
            {sessions.map((session) => (
                <span key={session.id}>
                    <SessionCard
                        session={session}
                    />
                </span>
            ))}
        </div>
    )
}