"use client";
import { useState } from "react";
import style from "./FileButtons.module.css";

interface FileButtonProps {
    name: string,
    status: string,
    enrollPath: string,
    gradePath: string,
    idPath: string
}

const handleOpenFile = (filePath) => {
    const secu
}

export default function FileButtons({ name, status, enrollPath, gradePath, idPath }: FileButtonProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [previewURL, setPreviewURL] = useState<string | null>(null);


    return (
        <div className={style.mainDiv}>
            <button>Back</button>
            <p>{status}</p>
            <button onClick={() => handleFileButton(enrollPath)}>Enrollment</button>
            <button onClick={() => handleFileButton(gradePath)}>Grades</button>
            <button onClick={() => handleFileButton(idPath)}>Valid ID</button>
        </div>
    )
}