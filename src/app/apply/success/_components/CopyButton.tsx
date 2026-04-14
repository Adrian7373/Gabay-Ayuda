"use client"; // This tells Next.js this component can use browser features
import { useState } from "react";
import style from "./CopyButton.module.css";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button className={style.copyButton} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}