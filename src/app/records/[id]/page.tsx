import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import FileButtons from "./_components/FileButtons/FileButtons";
import ActionButtons from "./_components/ActionButtons/ActionButtons";

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

    return (
        <div className={style.mainDiv}>
            <FileButtons
                name={profile.name}
                status={profile.status}
                enrollPath={profile.document_urls[0]}
                gradePath={profile.document_urls[1]}
                idPath={profile.document_urls[2]}
            />
            <div>
                <p>Applied: {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
            <div>
                <p>Religion: {profile.religion}</p>
            </div>
            <div>
                <p>Marital Status: {profile.marital_status}</p>
            </div>
            <div>
                <p>Age: {profile.age}</p>
            </div>
            <div>
                <p>Citizenship: {profile.citizenship}</p>
            </div>
            <div>
                <p>Contact: {profile.contact}</p>
            </div>
            <div>
                <p>Sex: {profile.sex}</p>
            </div>
            <div>
                <p>Date of Birth: {profile.bday}</p>
            </div>
            <div>
                <p>Email: {profile.email}</p>
            </div>
            <div>
                <p>Address: {profile.address}</p>
            </div>
            <hr />
            <div>
                <p>School Type: {profile.school_type}</p>
            </div>
            <div>
                <p>Student Level: {profile.student_level}</p>
            </div>
            <div>
                <p>School Name: {profile.school_name}</p>
            </div>
            <div>
                <p>Grade Level: {profile.grade_level}</p>
            </div>
            <div>
                <p>School Address: {profile.school_address}</p>
            </div>
            <div>
                <p>Average: {profile.average}</p>
            </div>
            <hr />
            <div className={style.motherDiv}>
                <p>{profile.mother_name}</p>
                <p>{profile.mother_educ_attainment}</p>
                <p>Age: {profile.mother_age}</p>
                <p>Contact: {profile.mother_contact}</p>
                <p>Occupation: {profile.mother_occupation}</p>
                <p>Address: {profile.mother_address}</p>
            </div>
            <div className={style.fatherDiv}>
                <p>{profile.father_name}</p>
                <p>{profile.father_educ_attainment}</p>
                <p>Age: {profile.father_age}</p>
                <p>Contact: {profile.father_contact}</p>
                <p>Occupation: {profile.father_occupation}</p>
                <p>Address: {profile.father_address}</p>
            </div>

            <ActionButtons
                id={profile.id}
            />
        </div>
    )
}