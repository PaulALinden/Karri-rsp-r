import React from "react";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";

const SavedJobs = ({ jobApplications, deleteJobApplication, startEditingJob }) => {
    return (
        <div id="savedjobs">
            <h2 className="headerspace">Sparade jobbsökningar</h2>
            {jobApplications.length === 0 ? (
                <p>Inga jobbsökningar ännu.</p>
            ) : (
                <ul id="savedjoblist">
                    {jobApplications.map((job) => (
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
                            <span>Status: {job.status}</span>
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

