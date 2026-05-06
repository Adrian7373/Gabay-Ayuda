import style from "./ParentsInfoCard.module.css";

interface ParentsInfoCardProps {
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

export default function ParentsInfoCard({ father_name, father_age, father_address, father_contact, father_occupation, father_educ_attainment,
    mother_name, mother_age, mother_address, mother_contact, mother_occupation, mother_educ_attainment
}: ParentsInfoCardProps) {

    return (
        <>
            <p>Parents Info</p>
            <div className={style.detailsDiv}>
                <div>
                    <div>
                        <p>FATHER NAME</p>
                        <p>{father_name}</p>
                    </div>
                    <button>More info</button>
                </div>
                <div>
                    <div>
                        <p>MOTHER NAME</p>
                        <p>{mother_name}</p>
                    </div>
                    <button>More info</button>
                </div>
            </div>
        </>
    )
}