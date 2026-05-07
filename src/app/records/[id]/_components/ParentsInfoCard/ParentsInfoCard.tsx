"use client"
import { MouseEvent, useState, useRef, useEffect } from "react";
import style from "./ParentsInfoCard.module.css";

interface ParentsInfo {
    father_name: string,
    father_age: string,
    father_address: string,
    father_contact: string,
    father_occupation: string,
    father_educ_attainment: string,
    mother_name: string,
    mother_age: string,
    mother_address: string,
    mother_contact: string,
    mother_occupation: string,
    mother_educ_attainment: string
}

interface ParentsInfoCardProps {
    parentsInfo: ParentsInfo
}

type OpenInfo = "father" | "mother" | null;

type PanelPosition = {
    top: number;
    left: number;
};

const initialPosition: PanelPosition = {
    top: 0,
    left: 0,
};

const hasMoreInfo = (age: string, address: string, contact: string, occupation: string, educ: string): boolean => {
    return !!(age || address || contact || occupation || educ);
};

export default function ParentsInfoCard({ parentsInfo }: ParentsInfoCardProps) {
    const [openInfo, setOpenInfo] = useState<OpenInfo>(null);
    const [panelPosition, setPanelPosition] = useState<PanelPosition>(initialPosition);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleToggle = (section: Exclude<OpenInfo, null>) => (event: MouseEvent<HTMLButtonElement>) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        const nextSection = openInfo === section ? null : section;

        if (nextSection) {
            setPanelPosition({
                top: buttonRect.bottom + 8,
                left: buttonRect.left,
            });
        }

        setOpenInfo(nextSection);
    };

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                const target = event.target as HTMLElement;
                if (!target.closest("button")) {
                    setOpenInfo(null);
                }
            }
        };

        if (openInfo) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [openInfo]);

    return (
        <>
            <p>Parents Info</p>
            <div className={style.detailsDiv}>
                <div className={style.infoBlock}>
                    <div>
                        <p>FATHER NAME</p>
                        <p>{parentsInfo.father_name || "N/A"}</p>
                    </div>
                    <button type="button" onClick={handleToggle("father")} disabled={!hasMoreInfo(parentsInfo.father_age, parentsInfo.father_address, parentsInfo.father_contact, parentsInfo.father_occupation, parentsInfo.father_educ_attainment)}>More info</button>
                    {openInfo === "father" && (
                        <div ref={panelRef} className={style.moreInfo} style={{ top: `${panelPosition.top}px`, left: `${panelPosition.left}px` }}>
                            <div>
                                <p>AGE</p>
                                <p>{parentsInfo.father_age}</p>
                            </div>
                            <div>
                                <p>ADDRESS</p>
                                <p>{parentsInfo.father_address}</p>
                            </div>
                            <div>
                                <p>CONTACT</p>
                                <p>{parentsInfo.father_contact}</p>
                            </div>
                            <div>
                                <p>OCCUPATION</p>
                                <p>{parentsInfo.father_occupation}</p>
                            </div>
                            <div>
                                <p>EDUCATIONAL ATTAINMENT</p>
                                <p>{parentsInfo.father_educ_attainment}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className={style.infoBlock}>
                    <div>
                        <p>MOTHER NAME</p>
                        <p>{parentsInfo.mother_name}</p>
                    </div>
                    <button type="button" onClick={handleToggle("mother")}>More info</button>
                    {openInfo === "mother" && (
                        <div ref={panelRef} className={style.moreInfo} style={{ top: `${panelPosition.top}px`, left: `${panelPosition.left}px` }}>
                            <div>
                                <p>AGE</p>
                                <p>{parentsInfo.mother_age}</p>
                            </div>
                            <div>
                                <p>ADDRESS</p>
                                <p>{parentsInfo.mother_address}</p>
                            </div>
                            <div>
                                <p>CONTACT</p>
                                <p>{parentsInfo.mother_contact}</p>
                            </div>
                            <div>
                                <p>OCCUPATION</p>
                                <p>{parentsInfo.mother_occupation}</p>
                            </div>
                            <div>
                                <p>EDUCATIONAL ATTAINMENT</p>
                                <p>{parentsInfo.mother_educ_attainment}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}