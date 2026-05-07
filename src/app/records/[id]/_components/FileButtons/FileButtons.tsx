"use client";
import { useEffect, useState } from "react";
import style from "./FileButtons.module.css";
import { getSecuredFileURL } from "@/app/actions"

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
    const [previewTitle, setPreviewTitle] = useState<string>("");
    const [isImagePreview, setIsImagePreview] = useState<boolean>(false);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
    const [cachedPreviewUrls, setCachedPreviewUrls] = useState<Record<string, string>>({});

    const isImageFile = (filePath: string) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(filePath);

    useEffect(() => {
        const documents = [
            { path: enrollPath, title: "Enrollment Document" },
            { path: gradePath, title: "Grades Document" },
            { path: idPath, title: "Valid ID" }
        ].filter((item) => item.path);

        let cancelled = false;
        let idleHandle: number | null = null;
        let timeoutHandle: ReturnType<typeof globalThis.setTimeout> | null = null;

        const preloadDocuments = async () => {
            await Promise.allSettled(
                documents.map(async ({ path }) => {
                    const securedURL = await getSecuredFileURL(path);

                    if (cancelled) return;

                    if (isImageFile(path)) {
                        const image = new Image();
                        image.src = securedURL;
                    }

                    setCachedPreviewUrls((current) => ({
                        ...current,
                        [path]: securedURL
                    }));
                })
            );
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            idleHandle = window.requestIdleCallback(() => {
                void preloadDocuments();
            });
        } else {
            timeoutHandle = globalThis.setTimeout(() => {
                void preloadDocuments();
            }, 250);
        }

        return () => {
            cancelled = true;

            if (idleHandle !== null && typeof window !== "undefined" && "cancelIdleCallback" in window) {
                window.cancelIdleCallback(idleHandle);
            }

            if (timeoutHandle !== null) {
                globalThis.clearTimeout(timeoutHandle);
            }
        };
    }, [enrollPath, gradePath, idPath]);

    const handleOpenFile = async (filePath: string, title: string) => {
        setIsLoading(true);

        try {
            const securedURL = cachedPreviewUrls[filePath] ?? await getSecuredFileURL(filePath);
            setPreviewURL(securedURL);
            setPreviewTitle(title);
            setIsImagePreview(isImageFile(filePath));
            setImageSize(null);
            setIsOpen(true);
        } catch (error) {
            alert("Failed to open file. It may be deleted")
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPreviewURL(null);
        setPreviewTitle("");
        setIsImagePreview(false);
        setImageSize(null);
        setIsOpen(false);
    }

    const viewerShellStyle = imageSize
        ? {
            width: `min(96vw, ${Math.max(imageSize.width + 2, 320)}px)`,
            height: `min(92vh, ${Math.max(imageSize.height + 112, 320)}px)`
        }
        : undefined;


    return (
        <div className={style.mainDiv}>
            <button onClick={() => handleOpenFile(enrollPath, "Enrollment Document")}>Enrollment</button>
            <button onClick={() => handleOpenFile(gradePath, "Grades Document")}>Grades</button>
            <button onClick={() => handleOpenFile(idPath, "Valid ID")}>Valid ID</button>

            {isOpen && previewURL && (
                <div className={style.overlay}>
                    <div className={style.viewerShell} style={viewerShellStyle}>
                        <div className={style.viewerHeader}>
                            <div className={style.headerLeft}>
                                <button
                                    onClick={handleClose}
                                    className={style.backButton}
                                    aria-label="Back"
                                >
                                    <svg className={style.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className={style.titleGroup}>
                                    <p className={style.viewerLabel}>Document preview</p>
                                    <h3 className={style.documentTitle}>{previewTitle || "Untitled document"}</h3>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className={style.closeButton}
                                aria-label="Close"
                            >
                                <svg className={style.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className={style.viewerBody}>
                            {isImagePreview ? (
                                <img
                                    src={previewURL}
                                    className={style.imagePreview}
                                    alt={previewTitle || "Document Preview"}
                                    onLoad={(event) => {
                                        const target = event.currentTarget;
                                        setImageSize({
                                            width: target.naturalWidth,
                                            height: target.naturalHeight
                                        });
                                    }}
                                />
                            ) : (
                                <iframe
                                    src={previewURL}
                                    className={style.viewerFrame}
                                    title={previewTitle || "Document Preview"}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}