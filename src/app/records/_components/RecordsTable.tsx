"use client";
import style from "./RecordsTable.module.css";
import { useState } from "react";

export default function RecordsTable() {

    const [isAscending, setIsAscending] = useState<boolean>(true);
    const [sort, setSort] = useState<string>("date");
    const [filter, setFilter] = useState<string>("status");
    const [filterSpecial, setfilterSpecial] = useState<string>("pending");

    return (
        <div className={style.mainDiv}>
            <label>Search:
                <input type="text" />
            </label>
            <select name="sortBy" id="sortBy">
                <option value="date">Sort by:Date</option>
                <option value="age">Sort by:Age</option>
                <option value="name">Sort by:Name</option>
            </select>
            <button>{isAscending ? "Ascending" : "Descending"}</button>
            <select name="filterBy" id="filterBy">
                <option value="status">Filter by:Status</option>
                <option value="sex">Filter by:Sex</option>
                <option value="maritalStatus">Filter by:Marital Status</option>
                <option value="schoolType">Filter by:School Type</option>
                <option value="studentLevel">Filter by:Student Level</option>
                <option value="gradeLevel">Filter by:Grade Level</option>
                <option value="schoolType">Filter by:Year Level</option>
            </select>
            <select name="filterSpecial" id="filterSpecial"></select>
        </div>
    )
}