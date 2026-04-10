"use client";
import { useState } from "react";
import style from "./FileButtons.module.css";
import { getSecuredFileURL } from "@/app/actions"
import Link from "next/link";

interface FileButtonProps {
    name: string,
    status: string,
    enrollPath: string,
    gradePath: string,
    idPath: string
}


export default function FileButtons({ name, status, enrollPath, gradePath, idPath }: FileButtonProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    const handleOpenFile = async (filePath: string) => {
        setIsLoading(true);

        try {
            const securedURL = await getSecuredFileURL(filePath);
            setPreviewURL(securedURL);
            setIsOpen(true);
        } catch (error) {
            alert("Failed to open file. It may be deleted")
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPreviewURL(null);
        setIsOpen(false);
    }


    return (
        <div className={style.mainDiv}>
            <Link href="/records">Back</Link>
            <p>{name}</p>
            <p>{status}</p>
            <button onClick={() => handleOpenFile(enrollPath)}>Enrollment</button>
            <button onClick={() => handleOpenFile(gradePath)}>Grades</button>
            <button onClick={() => handleOpenFile(idPath)}>Valid ID</button>

            {isOpen && previewURL && (

                // 1. The dark, semi-transparent background that covers the whole screen
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

          // 2. The white box that holds the document
                    <div className="relative w-full max-w-5xl h-[90vh] bg-gray-100 rounded-lg shadow-2xl flex flex-col overflow-hidden">

                        {/* 3. The Top Bar (Title & Close Button) */}
                        <div className="flex justify-between items-center bg-white px-6 py-4 border-b">
                            <h3 className="font-semibold text-gray-800">Document Preview</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                            >
                                {/* An SVG 'X' Icon */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 4. The actual Document Viewer */}
                        <div className="flex-1 w-full h-full bg-gray-200">
                            <iframe
                                src={previewURL}
                                className="w-full h-full border-0"
                                title="Document Preview"
                            />
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}