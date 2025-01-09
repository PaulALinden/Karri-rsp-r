import { useState, useEffect } from "react";
import FilterOptions from "./FilterOptions";

import { MdDelete } from "react-icons/md";
import { FaPencilAlt, FaArchive } from "react-icons/fa";

const SavedJobs = ({ jobApplications, deleteJobApplication, startEditingJob, archiveJobApplication }) => {
    const [searchValue, setSearchValue] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const [appliedCount, setAppliedCount] = useState(0);
    const [interviewCount, setInterviewCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);

    // Uppdatera statistik
    useEffect(() => {
        const applied = jobApplications.filter((job) => job.status === "Ansökt").length;
        const interview = jobApplications.filter((job) => job.status === "Intervju").length;
        const rejected = jobApplications.filter((job) => job.status === "Avslag").length;
        setAppliedCount(applied);
        setInterviewCount(interview);
        setRejectedCount(rejected);
    }, [jobApplications])


    // Sortera jobben baserat på valt sorteringsordning
    const sortedJobs = [...jobApplications].sort((a, b) => {
        const dateA = new Date(a.createdAt.toDate());
        const dateB = new Date(b.createdAt.toDate());
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Filtrera jobben baserat på status
    const statusFilteredJobs = sortedJobs.filter((job) => !filterStatus || job.status === filterStatus);

    // Filtrera jobben baserat på sökvärde
    const filteredJobs = statusFilteredJobs.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.company.toLowerCase().includes(searchValue.toLowerCase())
    );

    function setStatusColor(status) {
        let statusColor;

        switch (status) {
            case "Avslag":
                statusColor = "rejection";
                break;

            case "Intervju":
                statusColor = "interview";
                break;
            default:
                statusColor = "applied"
                break;
        }

        return statusColor;
    }


    return (
        <div id="savedjobs">
            <h2 className="headerspace">Sparade jobbsökningar</h2>

            <div className="statistics">
                <h2>Statistik</h2>
                <p>Ansökningar: {appliedCount}</p>
                <p>Intervjuer: {interviewCount}</p>
                <p>Avslag: {rejectedCount}</p>
            </div>

            <FilterOptions
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            {jobApplications.length === 0 ? (
                <p>Inga jobbsökningar ännu.</p>
            ) : (
                <ul id="savedjoblist">
                    {filteredJobs
                        .filter((job) => job.status !== "Arkiverad")
                        .map((job) => (
                            <li
                                className="savedjoblistitem"
                                key={job.id}
                                onClick={(e) => {
                                    if (!e.target.closest("button")) {
                                        window.open(job.url, '_blank');
                                    }
                                }}
                            >
                                <div>
                                    <strong>{job.jobTitle}</strong> på {job.company}
                                </div>
                                <p className={setStatusColor(job.status)}>Status: {job.status}</p>
                                <div className="listbuttons">
                                    <button id="change" onClick={() => startEditingJob(job)} aria-label="Change">
                                        <FaPencilAlt />
                                    </button>
                                    <button id="archive" onClick={() => archiveJobApplication(job.id)} aria-label="Remove">
                                        <FaArchive />
                                    </button>
                                    <button id="delete" onClick={() => deleteJobApplication(job.id)} aria-label="Remove">
                                        <MdDelete />
                                    </button>
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default SavedJobs;

