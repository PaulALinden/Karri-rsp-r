import { useState, useEffect } from "react";
import FilterOptions from "./FilterOptions";

import { MdDelete } from "react-icons/md";
import { FaPencilAlt, FaArchive } from "react-icons/fa";

import ConfirmDeleteModal from "./ConfirmDeleteModal";

const SavedJobs = ({ jobApplications, deleteJobApplication, startEditingJob, archiveJobApplication, stats }) => {
    const [searchValue, setSearchValue] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDocId, setCurrentDocId] = useState(null); // För att hålla reda på vilket dokument som ska tas bort

    // Sortera jobben baserat på valt sorteringsordning
    const sortedJobs = [...jobApplications].sort((a, b) => {
        const dateA = new Date(a.createdAt.toDate());
        const dateB = new Date(b.createdAt.toDate());
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Filtrera jobben baserat på status
    const statusFilteredJobs = sortedJobs.filter((job) => {
        if (filterStatus === "") {
            return job.status !== "Arkiverad"; // Visa alla jobb utom arkiverade
        }
        // Annars filtrera på den valda specifika statusen
        return job.status === filterStatus;
    });

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

    const handleDeleteClick = (docId) => {
        setCurrentDocId(docId); // Sätt det valda docId
        setIsModalOpen(true); // Visa modalen
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Stäng modalen utan att ta bort något
    };

    const handleConfirmDelete = async (docId) => {
        await deleteJobApplication(docId); // Anropa deleteJobApplication med det valda docId
        setIsModalOpen(false); // Stäng modalen efter radering
    };

    return (
        <div id="savedjobs">
            <h2 className="headerspace">Sparade jobbsökningar</h2>

            <div className="statistics">
                <h2>Statistik</h2>
                <p>Ansökningar: {stats.applied}</p>
                <p>Intervjuer: {stats.interview}</p>
                <p>Avslag: {stats.rejected}</p>
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
                                <button id="archive" onClick={() => archiveJobApplication(job.id)} aria-label="Remove">
                                    <FaArchive />
                                </button>
                                <button id="delete" onClick={() => handleDeleteClick(job.id)} aria-label="Remove">
                                    <MdDelete />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                docId={currentDocId}
            />
        </div>
    );
};

export default SavedJobs;

