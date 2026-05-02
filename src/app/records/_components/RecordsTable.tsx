"use client";
import style from "./RecordsTable.module.css";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

// 1. Updated Interface to include all filterable fields
interface Application {
    id: string;
    student_level: string;
    name: string;
    status: string;
    created_at: string;
    contact: string;
    grade_level?: string;
    year_level?: string;
};

interface ApplicationProp {
    applications: Application[];
}

export default function RecordsTable({ applications }: ApplicationProp) {
    const [isAscending, setIsAscending] = useState<boolean>(true);
    const [sort, setSort] = useState<string>("date");
    const [filter, setFilter] = useState<string>("status");
    const [filterSpecial, setfilterSpecial] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [displaySearch, setDisplaySearch] = useState<string>("");

    // 2. Proper Debouncing for Search
    // This prevents the table from flickering on every single keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(displaySearch);
        }, 300); // 300ms delay is usually the sweet spot

        return () => clearTimeout(handler);
    }, [displaySearch]);

    const filteredAndSortedData = useMemo(() => {
        let result = [...applications];

        // 3. Search Logic
        if (searchTerm) {
            result = result.filter(app =>
                app.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 4. Completed Filter Logic
        if (filterSpecial) {
            const target = filterSpecial.toLowerCase();

            if (filter === "status" && filterSpecial !== "") {
                result = result.filter(app => app.status.toLowerCase() === target);
            } else if (filter === "studentLevel") {
                result = result.filter(app => app.student_level.toLowerCase() === target);
            }
        }
        // 5. Completed Sorting Logic
        result.sort((a, b) => {
            let comparison = 0;
            if (sort === "date") {
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sort === "name") {
                comparison = a.name.localeCompare(b.name);
            }

            return isAscending ? comparison : -comparison;
        });

        return result;
    }, [applications, searchTerm, filter, filterSpecial, sort, isAscending]);

    return (
        <>
            <div className={style.utils}>
                <div className={style.searchDiv}>
                    <label><Search height="1em" width="1em" />
                        <input
                            className={style.searchInput}
                            type="text"
                            value={displaySearch}
                            onChange={(e) => setDisplaySearch(e.target.value)}
                            placeholder="Search"
                        />
                    </label>
                </div>

                <div className={style.filterUtils}>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="date">Sort by: Date</option>
                        <option value="name">Sort by: Name</option>
                    </select>

                    <select value={filter} onChange={(e) => {
                        setFilter(e.target.value);
                        setfilterSpecial(""); // Reset special filter when category changes
                    }}>
                        <option value="status">Filter by: Status</option>
                        <option value="studentLevel">Filter by: Student Level</option>
                    </select>

                    <select value={filterSpecial} onChange={(e) => setfilterSpecial(e.target.value)}>
                        <option value="">Select Option</option>
                        {filter == "status" && (
                            <>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </>
                        )}
                        {filter == "studentLevel" && (
                            <>
                                <option value="junior">Junior High</option>
                                <option value="senior">Senior High</option>
                                <option value="college">College</option>
                            </>
                        )}
                    </select>
                    <button onClick={() => setIsAscending(!isAscending)}>
                        {isAscending ? "Ascending ↑" : "Descending ↓"}
                    </button>
                </div>
            </div>

            <div className={style.tableContainer}>
                <table className={style.recordsTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created at</th>
                            <th>Level</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedData.map((app) => (
                            <tr key={app.id}>
                                <td>{app.name}</td>
                                <td>{new Date(app.created_at).toLocaleDateString()}</td>
                                <td>{app.student_level}</td>
                                <td>{app.contact}</td>
                                <td>{app.status}</td>
                                <td>
                                    <Link href={`/records/${app.id}`} className={style.reviewLink}>
                                        Review
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}