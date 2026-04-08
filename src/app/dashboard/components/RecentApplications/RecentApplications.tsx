import style from "./RecentApplications.module.css";
import Link from "next/link";

interface Application {
    id: string;
    student_level: string;
    name: string;
    status: string;
    created_at: string;
    contact: string;
    address: string;
};

interface ApplicationProp {
    recentApps: Application[];
}

export default function RecentApplications({ recentApps }: ApplicationProp) {

    return (
        <div className={style.mainDiv}>
            <p>Recent Applications</p>
            <Link href={"/records"}>View Records</Link>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Created at</th>
                        <th>Student Level</th>
                        <th>Contact</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {recentApps.map((app) => (
                        <tr key={app.id}>
                            <td>
                                {app.status}
                            </td>
                            <td>
                                {app.name}
                            </td>
                            <td>
                                {new Date(app.created_at).toLocaleDateString()}
                            </td>
                            <td>
                                {app.student_level}
                            </td>
                            <td>
                                {app.contact}
                            </td>
                            <td>
                                {app.address}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}