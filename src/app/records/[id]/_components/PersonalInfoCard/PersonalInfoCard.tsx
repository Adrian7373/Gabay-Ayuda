import style from "./PersonalInfoCard.module.css";
import { User } from "lucide-react";
interface PersonalInfo {
    name: string,
    religion: string,
    bday: string,
    contact: string,
    email: string,
    address: string,
    age: string,
    sex: string,
    citizenship: string,
    maritalStatus: string
}

interface PersonalInfoProps {
    personalData: PersonalInfo
}

export default function PersonalInfoCard({ personalData }: PersonalInfoProps) {

    const { name, religion, bday, contact, email, address, age, sex, citizenship, maritalStatus } = personalData;
    const ageGender = `${age || ""}${age && sex ? "/" : ""}${sex || ""}`;

    return (
        <>
            <p><User height="3vh" width="1.5vw" />Personal Info</p>
            <div className={style.detailsDiv}>
                <div style={{ gridArea: "name" }}>
                    <p>FULL NAME</p>
                    <p>{name || "N/A"}</p>
                </div>
                <div style={{ gridArea: "age" }}>
                    <p>AGE/GENDER</p>
                    <p>{ageGender || "N/A"}</p>
                </div>
                <div style={{ gridArea: "religion" }}>
                    <p>RELIGION</p>
                    <p>{religion || "N/A"}</p>
                </div>
                <div style={{ gridArea: "citizenship" }}>
                    <p>CITIZENSHIP</p>
                    <p>{citizenship || "N/A"}</p>
                </div>
                <div style={{ gridArea: "bday" }}>
                    <p>BIRTHDATE</p>
                    <p>{bday || "N/A"}</p>
                </div>
                <div style={{ gridArea: "mstatus" }}>
                    <p>MARITAL STATUS</p>
                    <p>{maritalStatus || "N/A"}</p>
                </div>
                <div style={{ gridArea: "contact" }}>
                    <p>CONTACT</p>
                    <p>{contact || "N/A"}</p>
                </div>
                <div style={{ gridArea: "email" }}>
                    <p>EMAIL</p>
                    <p>{email || "N/A"}</p>
                </div>
                <div style={{ gridArea: "address" }}>
                    <p>ADDRESS</p>
                    <p>{address || "N/A"}</p>
                </div>
            </div>
        </>
    )
}