
interface AcademicProfile {
    school_name: string,
    school_type: string,
    school_address: string,
    student_level: string,
    year_level: string,
    grade_level: string,
    gwa: string,
    average: string
}

interface AcademicCardProps {
    academicData: AcademicProfile
}

export default function AcademicCard({ academicData }: AcademicCardProps) {
    return (
        <>
            <p>Academic Profile</p>
        </>
    )
}