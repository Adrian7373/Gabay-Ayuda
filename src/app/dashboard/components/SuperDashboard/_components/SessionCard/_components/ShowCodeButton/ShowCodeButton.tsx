"use client";
import { useState } from "react";
import style from "./ShowCodeButton.module.css";

interface ShowCodeButtonProps {
    code: string
}

export default function ShowCodeButton({ code }: ShowCodeButtonProps) {

    const [isShowing, setIsShowing] = useState<boolean>(false);

    return (
        <button className={style.showButton} onMouseDown={() => setIsShowing(true)} onMouseUp={() => setIsShowing(false)} onMouseLeave={() => setIsShowing(false)}>{isShowing ? `${code}` : "Show Code"}</button>
    )
}