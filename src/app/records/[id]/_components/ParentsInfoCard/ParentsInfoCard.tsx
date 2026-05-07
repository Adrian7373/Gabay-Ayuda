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
                    <div className={style.moreInfo}>
                        <div>
                            <p>AGE</p>
                            <p>{father_age}</p>
                        </div>
                        <div>
                            <p>ADDRESS</p>
                            <p>{father_address}</p>
                        </div>
                        <div>
                            <p>CONTACT</p>
                            <p>{father_contact}</p>
                        </div>
                        <div>
                            <p>OCCUPATION</p>
                            <p>{father_occupation}</p>
                        </div>
                        <div>
                            <p>EDUCATIONAL ATTAINMENT</p>
                            <p>{father_educ_attainment}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <p>MOTHER NAME</p>
                        <p>{mother_name}</p>
                    </div>
                    <button>More info</button>
                    <div className={style.moreInfo}>
                        <div>
                            <p>AGE</p>
                            <p>{mother_age}</p>
                        </div>
                        <div>
                            <p>ADDRESS</p>
                            <p>{mother_address}</p>
                        </div>
                        <div>
                            <p>CONTACT</p>
                            <p>{mother_contact}</p>
                        </div>
                        <div>
                            <p>OCCUPATION</p>
                            <p>{mother_occupation}</p>
                        </div>
                        <div>
                            <p>EDUCATIONAL ATTAINMENT</p>
                            <p>{mother_educ_attainment}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}