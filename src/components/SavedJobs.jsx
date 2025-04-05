import { useState } from "react";
import FilterOptions from "./FilterOptions";
import StatusPieChart from "./StatusPieChart";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "../css/savedJobs.css";

import inventory from "../assets/inventory.svg";
import edit from "../assets/edit.svg";
import trash from "../assets/trash.svg";
import open_in_browser from "../assets/open_in_browser.svg"

const SavedJobs = ({ jobApplications, deleteJobApplication, startEditingJob, archiveJobApplication }) => {
    const [searchValue, setSearchValue] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [expandedItemId, setExpandedItemId] = useState(null);

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
            return job.status && !job.archived; // Visa alla jobb utom arkiverade
        } else if (filterStatus === "Arkiverad") {
            return job.archived
        }
        // Annars filtrera på den valda specifika statusen
        return job.status === filterStatus && !job.archived;;
    });

    // Filtrera jobben baserat på sökvärde
    const filteredJobs = statusFilteredJobs.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
        job.company.toLowerCase().includes(searchValue.toLowerCase())
    );
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

    const handleExpandListItem = (itemId, event) => {
        if (event.target.tagName.toLowerCase() === 'button' || event.target.tagName.toLowerCase() === 'img') {
            return; // Expandera inte listan om klicket var på en knapp
        }
        setExpandedItemId(itemId === expandedItemId ? null : itemId);
    };

    const getJobStatus = (status) => {
        switch (status) {
            case "Intervju":
                return "interview";
            case "Avslag":
                return "rejected";
            default:
                return "applied"
        }
    }

    return (
        <div id="savedjobs">
            <h2 className="headerspace">Sparade jobbsökningar</h2>

            <StatusPieChart className="statistics" jobs={jobApplications} />

            <FilterOptions
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />

            {jobApplications.length === 0 ? (
                <p className="empty-list">Inga jobbsökningar ännu.</p>
            ) : (

                <ul id="savedjoblist">
                    {filteredJobs.map((job) => (

                        <li
                            className={`savedjoblistitem ${job.id === expandedItemId ? 'expand' : ''}`}
                            key={job.id}
                            onClick={(event) => handleExpandListItem(job.id, event)}
                        >

                            <div className="row">

                                <div className="saved-job-row-item">
                                    <strong className="inline-paragraph">{job.jobTitle}</strong>
                                    <p className="inline-paragraph">{`på ${job.company}`}</p>
                                    <p className="date-paragraph">{job.createdAt.toDate().toLocaleDateString()}</p>
                                </div>

                                <div className="saved-job-row-item-2">
                                    <strong>Arbetsform: </strong>
                                    <p>{job.position}</p>
                                </div>
                                <div className="saved-job-row-item-2">
                                    <strong>Status:</strong><p> {job.status}</p>
                                </div>
                            </div>

                            {job.id === expandedItemId && (
                                <>
                                    <div className="row">
                                        <div className="saved-job-row-item">
                                            <strong>Plats: </strong>
                                            <p>{job.location}</p>
                                        </div>

                                        <div className="saved-job-row-item">
                                            <strong>Anställningsform: </strong>
                                            <p>{job.jobType}</p>
                                        </div>
                                    </div>


                                    <div className="full-row">
                                        <p className="comment">{job.comment}</p>
                                    </div>

                                </>
                            )}


                            <div className="full-row">
                                <div className="saved-job-btn-group">
                                    <div>
                                        <button className="change" title="Ändra" onClick={() => startEditingJob(job)} aria-label="Change">
                                            <img src={edit} ></img>
                                        </button>
                                        <button className="archive" title="Arkivera" onClick={() => archiveJobApplication(job)} aria-label="Archive">
                                            <img src={inventory} ></img>
                                        </button>
                                        <button className="delete" title="Ta bort" onClick={() => handleDeleteClick(job.id)} aria-label="Remove">
                                            <img src={trash} ></img>
                                        </button>
                                    </div>

                                    <div>
                                        <button className="url-button" title="Gå till" onClick={() => { window.open(job.url) }} >
                                            <img src={open_in_browser} />
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <div className={`status-color ${getJobStatus(job.status)}`} />
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

