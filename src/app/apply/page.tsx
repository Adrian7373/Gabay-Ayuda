"use client";

import { useState } from "react"
import style from "./page.module.css"

export default function ApplicationForm() {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {

            setTimeout(() => {
                console.log("okay na")
                setIsSubmitting(false);
                console.log(isSubmitting);
            }, 2000)

            console.log(formData);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <p>Barangay Ayuda Application</p>
            <form action="POST" onSubmit={handleSubmit}>
                <label>Name:
                    <input type="text" className={style.nameInput} />
                </label>
                <label>Age:
                    <input type="number" className={style.ageInput} />
                </label>
                <label>Barangay:
                    <input type="text" className={style.barangayInput} />
                </label>
                <label>School/University:
                    <input type="text" className={style.schoolInput} />
                </label>
                <hr />
                <label>Certificate of Enrollment(file/picture):
                    <input type="file" className={style.enrollmentFileInput} />
                </label>
                <label>Certificate of Grades/Report card(file/picture):
                    <input type="file" className={style.gradesFileInput} />
                </label>
                <label>School ID/Valid ID(file/picture):
                    <input type="file" className={style.validIDFileInput} />
                </label>

                <button type="submit" className={style.formSubmitButton}>
                    {isSubmitting ? "Uploading submission" : "Submit"}
                </button>

            </form>
        </div>
    )
}