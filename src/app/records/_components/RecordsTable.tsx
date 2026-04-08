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
                <option value="yearLevel">Filter by:Year Level</option>
            </select>
            <select name="filterSpecial" id="filterSpecial">
                {filter == "status" && (
                    <>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </>
                )}

                {filter == "sex" && (
                    <>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </>
                )}

                {filter == "maritalStatus" && (
                    <>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="separated">Separated</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                    </>
                )}

                {filter == "schoolType" && (
                    <>
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                        <option value="vocational">Vocational</option>
                    </>
                )}

                {filter == "studentLevel" && (
                    <>
                        <option value="junior">Junior High Student</option>
                        <option value="senior">Senior High Student</option>
                        <option value="college">College Student</option>
                    </>
                )}

                {filter == "gradeLevel" && (
                    <>
                        <option value="7">Grade 7</option>
                        <option value="8">Grade 8</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="11">Grade 11</option>
                        <option value="12">Grade 12</option>
                    </>
                )}

                {filter == "yearLevel" && (
                    <>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                    </>
                )}

            </select>
        </div>
    )
}