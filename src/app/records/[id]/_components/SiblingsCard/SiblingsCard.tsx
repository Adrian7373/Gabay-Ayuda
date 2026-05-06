

interface Dependent {
    name: string,
    yearLevel: string,
    occupation: string
}
interface SiblingsCardProps {
    dependents: Dependent[]
}

export default function SiblingsCard({ dependents }: SiblingsCardProps) {
    return (
        <>
            <p>Siblings</p>
            {dependents.map((dependent, index) => (
                <div key={index}>
                    <div>
                        <p>{dependent.name}</p>
                        <p>{dependent.yearLevel}</p>
                    </div>
                    <p>{dependent.occupation}</p>
                </div>
            ))}
        </>
    )
}