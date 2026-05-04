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

    return (
        <div className={style.mainDiv}>
            <PersonalInfoCard
                personalData={personalInfo}
            />
            <SiblingsCard />
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