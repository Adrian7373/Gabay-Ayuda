"use client";

import { useState, useRef, useEffect } from "react"
import style from "./page.module.css"
import { submitApplication, checkNameExists } from "../actions";

export default function ApplicationForm() {

    const [formStep, setFormStep] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [isCollegeStudent, setIsCollegeStudent] = useState<boolean>(false);
    const [dependents, setDependents] = useState<number>(0);
    const [nameInput, setNameInput] = useState<string>("");
    const [nameStatus, setNameStatus] = useState<"idle" | "checking" | "record already exists!" | "Available for application">("idle");
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const formElement = e.currentTarget.closest('form');
        e.preventDefault()

        if (!formElement) return;

        setIsSubmitting(true);
        const formData = new FormData(formElement);

        const response = await submitApplication(formData);

        if (response.success) {
            alert(response.message)
            setIsSubmitting(false);
            console.log("Redirect to Thank you page")
        } else {
            alert(response.message)
        }

    }

    useEffect(() => {
        if (nameInputRef && nameStatus == "record already exists!") {
            nameInputRef.current?.focus();
        }
    }, [nameStatus])

    useEffect(() => {
        if (nameInput.length < 2) {
            setNameStatus("idle");
            return;
        }
        setNameStatus("checking");
        const delayBounce = setTimeout(async () => {
            const isDuplicate = await checkNameExists(nameInput);
            isDuplicate ? setNameStatus("record already exists!")
                : setNameStatus("Available for application")
                ;
        }, 3000)

        return () => clearTimeout(delayBounce);

    }, [nameInput]);

    const handleDependents = (value: string) => {
        if (!value) return;
        const numberOfDependents = Number(value);
        if (numberOfDependents > 0) setDependents(numberOfDependents);
    }

    const handleNext = () => {
        if (!formRef.current) return;

        const stepInputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            `#step-${formStep} input, #step-${formStep} select, #step-${formStep} textarea`
        );

        for (const input of Array.from(stepInputs)) {
            if (!input.checkValidity()) {
                input.reportValidity();

                return;
            }
        }

        // 4. If the loop finishes without returning, everything is valid!
        setFormStep(prev => prev + 1);
    };
    const handleBack = () => setFormStep(prevStep => prevStep - 1);

    const handleStudentLevel = (value: string) => {
        value == "college" ? setIsCollegeStudent(true) : setIsCollegeStudent(false);
    }

    return (
        <div>
            <p>Barangay Ayuda Application</p>
            <form action="POST" onSubmit={handleSubmit} ref={formRef}>
                <div id="step-1" className={style.personalInfoDiv} hidden={formStep != 1}>
                    <p>PERSONAL INFORMATION</p>
                    <label>Name:
                        <input ref={nameInputRef} onChange={(e) => setNameInput(e.target.value)} required name="name" type="text" className={style.nameInput} />
                    </label>
                    <label>Age:
                        <input required name="age" type="number" className={style.ageInput} />
                    </label>
                    <label>sex:
                        <select name="sex" id="sex">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <label>Religion:
                        <input name="religion" type="text" className={style.religionInput} />
                    </label>
                    <label>Citizenship:
                        <input required name="citizenship" type="text" className={style.citizenShipInput} />
                    </label>
                    <label>Date of Birth:
                        <input required name="bday" type="date" className={style.bdayInput} />
                    </label>
                    <label>Marital Status:
                        <select required name="maritalStatus" id="maritalStatus" className={style.maritalStatusInput}>
                            <option value="" disabled selected hidden>Select an option</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="separated">Separated</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </label>

                    <label>Contact number:
                        <input required name="contact" type="tel" className={style.contactInput} />
                    </label>

                    <label>Email:
                        <input name="email" type="email" className={style.emailInput} />
                    </label>

                    <label>Permanent Address:
                        <input required name="address" type="text" className={style.permAddressInput} />
                    </label>

                    <label>School Type:
                        <select required name="schoolType" id="schoolType" className={style.schoolTypeInput}>
                            <option value="" disabled selected hidden>Select an option</option>
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                            <option value="vocational">Vocational</option>
                        </select>
                    </label>

                    <label>School Name:
                        <input required name="schoolName" type="text" className={style.schoolNameInput} />
                    </label>

                    <label>School Address:
                        <input required name="schoolAddress" type="text" className={style.schoolAddressInput} />
                    </label>

                    <label>Student Level:
                        <select onChange={(e) => handleStudentLevel(e.target.value)} required name="studentLevel" id="studentLevel" className={style.studentLevelInput}>
                            <option value="" disabled selected hidden>Select an option</option>
                            <option value="junior">Junior High Student</option>
                            <option value="senior">Senior High Student</option>
                            <option value="college">College Student</option>
                        </select>
                    </label>

                    {isCollegeStudent && (
                        <>
                            <label>Year Level:
                                <select required name="yearLevel" id="yearLevel" className={style.yearLevelInput}>
                                    <option value="" disabled selected hidden>Select an option</option>
                                    <option value="y1">1st Year College</option>
                                    <option value="y2">2nd Year College</option>
                                    <option value="y3">3rd Year College</option>
                                    <option value="y4">4th Year College</option>
                                    <option value="y5">5th Year College</option>
                                </select>
                            </label>

                            <label>Course:
                                <input name="course" type="text" className={style.courseInput} />
                            </label>
                            <label>General Weighted Average(GWA):
                                <input required name="gwa" type="number" step="0.01" className={style.gwaInput} />
                            </label>
                        </>
                    )}

                    {!isCollegeStudent && (
                        <>
                            <label>Grade:
                                <select required name="gradeLevel" id="gradeLevel" className={style.gradeLevelInput}>
                                    <option value="" disabled selected hidden>Select an option</option>
                                    <option value="7">Grade 7</option>
                                    <option value="8">Grade 8</option>
                                    <option value="9">Grade 9</option>
                                    <option value="10">Grade 10</option>
                                    <option value="11">Grade 11</option>
                                    <option value="12">Grade 12</option>
                                </select>
                            </label>

                            <label>Grade Average:
                                <input required name="average" type="number" step="0.01" className={style.averageInput} />
                            </label>
                        </>
                    )}

                </div>


                {/*STEP 2 FAMILY BACKGROUND*/}

                <div id="step-2" className={style.familyBackgorundDiv} hidden={formStep != 2}>
                    <p>FAMILY BACKGROUND</p>
                    <label>Mother:
                        <label htmlFor="aliveTrue">
                            <input type="radio" id="aliveMotherTrue" name="isMotherAlive" value="true" className={style.aliveInput} />Alive
                        </label>

                        <label htmlFor="aliveFalse">
                            <input type="radio" id="aliveMotherFalse" name="isMotherAlive" value="false" className={style.aliveInput} />Deceased
                        </label>
                    </label>

                    <label>Father:
                        <label htmlFor="aliveTrue">
                            <input type="radio" id="aliveFatherTrue" name="isFatherAlive" value="true" className={style.aliveInput} />Alive
                        </label>

                        <label htmlFor="aliveFalse">
                            <input type="radio" id="aliveFatherFalse" name="isFatherAlive" value="false" className={style.aliveInput} />Deceased
                        </label>
                    </label>

                    <label>Total Parents Gross Income:
                        <input name="totalIncome" type="number" className={style.totalIncomeInput} />
                    </label>

                    <label>Number of Child(not including yourself):
                        <input onChange={(e) => handleDependents(e.target.value)} required name="numberOfChild" type="number" className={style.numberOfChildInput} />
                    </label>
                </div>

                {/*MOTHER INFORMATION*/}

                <div id="step-3" className={style.motherInfoDiv} hidden={formStep != 3}>
                    <p>MOTHER INFORMATION</p>

                    <label>Name:
                        <input name="motherName" type="text" className={style.motherNameInput} />
                    </label>
                    <label>Age:
                        <input name="motherAge" type="text" className={style.motherAgeInput} />
                    </label>
                    <label>Address:
                        <input name="motherAddress" type="text" className={style.motherAddressInput} />
                    </label>
                    <label>Contact Number:
                        <input name="motherContact" type="tel" className={style.motherContactInput} />
                    </label>
                    <label>Occupation:
                        <input name="motherOccupation" type="text" className={style.motherOccupationInput} />
                    </label>
                    <label>Education Attainment:
                        <select name="motherEducAttainment" id="motherEducAttainment" className={style.motherEducAttainmentInput}>
                            <option value="" disabled selected hidden>Select an option</option>
                            <option value="college">College Graduate</option>
                            <option value="highSchool">High School Graduate</option>
                            <option value="elemSchool">Elementary School Graduate</option>
                        </select>
                    </label>
                </div>

                {/*FATHER INFORMATION*/}

                <div id="step-4" className={style.fatherInfoDiv} hidden={formStep != 4}>
                    <p>FATHER INFORMATION</p>

                    <label>Name:
                        <input name="fatherName" type="text" className={style.fatherNameInput} />
                    </label>
                    <label>Age:
                        <input name="fatherAge" type="text" className={style.fatherAgeInput} />
                    </label>
                    <label>Address:
                        <input name="fatherAddress" type="text" className={style.fatherAddressInput} />
                    </label>
                    <label>Contact Number:
                        <input name="fatherContact" type="tel" className={style.fatherContactInput} />
                    </label>
                    <label>Occupation:
                        <input name="fatherOccupation" type="text" className={style.fatherOccupationInput} />
                    </label>
                    <label>Education Attainment:
                        <select name="fatherEducAttainment" id="fatherEducAttainment" className={style.fatherEducAttainmentInput}>
                            <option value="" disabled selected hidden>Select an option</option>
                            <option value="college">College Graduate</option>
                            <option value="highSchool">High School Graduate</option>
                            <option value="elemSchool">Elementary School Graduate</option>
                        </select>
                    </label>
                </div>

                {/*CHILDREN INFORMATION */}

                <div id="step-5" className={style.childrenInfoDiv} hidden={formStep != 5}>
                    <p>CHILDREN INFORMATION</p>
                    {Array.from({ length: dependents }).map((_, index) => (
                        <div className="dependentDiv" key={index}>
                            <label>Name:
                                <input name="childrenName" type="text" className={style.childrenNameInput} />
                            </label>
                            <label>Occupation:
                                <select name="childrenOccupation" id="childrenOccupation" className={style.childrenOccupationInput}>
                                    <option value="" disabled selected hidden>Select an option</option>
                                    <option value="student">Student</option>
                                    <option value="graduate">Graduate</option>
                                    <option value="employed">Employed</option>
                                </select>
                            </label>
                            <label>Course & Year/ Grade Level:
                                <input name="childrenYearLevel" type="text" className={style.childrenYearLevelInput} />
                            </label>
                        </div>
                    ))}

                </div>

                {/*REQUIREMENT FILES*/}

                <div id="step-6" className={style.requirementFilesDiv} hidden={formStep != 6}>
                    <p>ADDITIONAL REQUIREMENTS</p>
                    <label>Certificate of Registration/Enrollment:
                        <input required name="coe" type="file" className={style.coeInput} />
                    </label>
                    <label>Certificate of Grades/Report Card:
                        <input required name="cog" type="file" className={style.cogInput} />
                    </label>
                    <label>School ID/Valid ID:
                        <input required name="validID" type="file" className={style.idInput} />
                    </label>
                </div>

                <div className="absolute right-3 top-2.5 text-sm font-bold">
                    {nameStatus === 'checking' && <span className="text-gray-500 animate-pulse">Checking...</span>}
                    {nameStatus === 'record already exists!' && <span className="text-red-600">Your application is already submitted</span>}
                    {nameStatus === 'Available for application' && <span className="text-green-600">Eligible for application</span>}
                </div>

                <button type="button" onClick={handleBack} className={style.backButton} hidden={formStep == 1}>Back</button>
                <button type="button" onClick={handleNext} className={style.nextButton} hidden={formStep == 6} disabled={nameStatus === "record already exists!"}>Next</button>
                <button type="submit" className={style.formSubmitButton} hidden={formStep != 6}>
                    {isSubmitting ? "Uploading submission" : "Submit"}
                </button>

            </form>
        </div >
    )
}