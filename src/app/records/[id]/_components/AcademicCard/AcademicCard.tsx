
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
    const schoolLevel = academicData.year_level || academicData.grade_level;
    const averageValue = academicData.gwa || academicData.average;

    return (
        <>
            <p>Academic Profile</p>
            <div>
                <div>
                    <p>SCHOOL NAME</p>
                    <p>{academicData.school_name || "N/A"}</p>
                </div>
                <div>
                    <p>SCHOOL TYPE</p>
                    <p>{academicData.school_type || "N/A"}</p>
                </div>
                <div>
                    <p>SCHOOL ADDRESS</p>
                    <p>{academicData.school_address || "N/A"}</p>
                </div>
                <div>
                    <p>STUDENT LEVEL</p>
                    <p>{academicData.student_level || "N/A"}</p>
                </div>
                <div>
                    <p>YEAR / GRADE LEVEL</p>
                    <p>{schoolLevel || "N/A"}</p>
                </div>
                <div>
                    <p>GWA / AVERAGE</p>
                    <p>{averageValue || "N/A"}</p>
                </div>
            </div>
        </>
    )
}