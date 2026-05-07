import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import FileButtons from "./_components/FileButtons/FileButtons";
import ActionButtons from "./_components/ActionButtons/ActionButtons";
import PersonalInfoCard from "./_components/PersonalInfoCard/PersonalInfoCard";
import ParentsInfoCard from "./_components/ParentsInfoCard/ParentsInfoCard";
import SiblingsCard from "./_components/SiblingsCard/SiblingsCard";
import AcademicCard from "./_components/AcademicCard/AcademicCard";

interface DetailPageProps {
    params: Promise<{ id: string }>
}

export default async function RecordDetailsPage({ params }: DetailPageProps) {

    const { id } = await params;

    const supabase = await createClient();

    const { data: profile, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();
    console.log("fetched profile:", profile, "error:", error);

    if (error || !profile) {
        return (
            <div className={style.mainDiv}>
                <p>Record not found.</p>
            </div>
        );
    }

    const personalInfo = {
        name: profile.name,
        religion: profile.religion,
        bday: profile.bday,
        contact: profile.contact,
        email: profile.email,
        address: profile.address,
        age: profile.age,
        sex: profile.sex,
        citizenship: profile.citizenship,
        maritalStatus: profile.marital_status
    }

    const academicData = {
        school_name: profile.school_name,
        school_type: profile.school_type,
        school_address: profile.school_address,
        student_level: profile.student_level,
        year_level: profile.year_level,
        grade_level: profile.grade_level,
        gwa: profile.gwa,
        average: profile.average
    }

    const parentsInfo = {
        father_name: profile.father_name,
        father_age: profile.father_age,
        father_address: profile.father_address,
        father_contact: profile.father_contact,
        father_occupation: profile.father_occupation,
        father_educ_attainment: profile.father_educ_attainment,
        mother_name: profile.mother_name,
        mother_age: profile.mother_age,
        mother_address: profile.mother_address,
        mother_contact: profile.mother_contact,
        mother_occupation: profile.mother_occupation,
        mother_educ_attainment: profile.mother_educ_attainment
    }

    return (
        <div className={style.mainDiv}>
            <div className={style.personalInfoDiv}>
                <PersonalInfoCard
                    personalData={personalInfo}
                />
            </div>
            <div className={style.parentsInfoDiv}>
                <ParentsInfoCard
                    parentsInfo={parentsInfo}
                />
            </div>
            <SiblingsCard
                dependents={profile.dependents}
            />
            <AcademicCard
                academicData={academicData}
            />
            <FileButtons
                name={profile.name}
                status={profile.status}
                enrollPath={profile.document_urls[0]}
                gradePath={profile.document_urls[1]}
                idPath={profile.document_urls[2]}
            />
            <ActionButtons
                id={profile.id}
            />
        </div>
    )
}