import React, { useState } from "react";
import FilterOptions from "./FilterOptions";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";

const SavedJobs = ({ jobApplications, deleteJobApplication, startEditingJob }) => {

    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    // Sortera jobben baserat på valt sorteringsordning
    const sortedJobs = [...jobApplications].sort((a, b) => {
        const dateA = new Date(a.createdAt.toDate());
        const dateB = new Date(b.createdAt.toDate());
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Filtrera jobben baserat på status
    const filteredJobs = sortedJobs.filter((job) => !filterStatus || job.status === filterStatus);

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

            <h3>Sortera efter:</h3>
            <FilterOptions
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            {jobApplications.length === 0 ? (
                <p>Inga jobbsökningar ännu.</p>
            ) : (
                <ul id="savedjoblist">
                    {filteredJobs.map((job) => (
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

