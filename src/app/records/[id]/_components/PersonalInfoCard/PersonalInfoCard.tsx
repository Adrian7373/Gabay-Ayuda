

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

    return (
        <>
            <p>Personal Info</p>
        </>
    )
}