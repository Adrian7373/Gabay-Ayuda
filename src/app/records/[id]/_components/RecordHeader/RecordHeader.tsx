"use client"
import style from "./RecordHeader.module.css";
import { useRouter } from "next/navigation";

interface RecordHeaderProps {
    name: string,
    status: string
}

export default function RecordHeader({ name, status }: RecordHeaderProps) {

    const router = useRouter();

    return (
        <>
            <button onClick={() => router.back()}>Back</button>
            <p>{name}</p>
            <p>{status}</p>
        </>
    )
}