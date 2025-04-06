import { useState } from "react";
import FilterOptions from "./FilterOptions";
import StatusPieChart from "./StatusPieChart";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import "../css/savedJobs.css";
import inventory from "../assets/inventory.svg";
import edit from "../assets/edit.svg";
import trash from "../assets/trash.svg";
import open_in_browser from "../assets/open_in_browser.svg";

import { useLanguage } from "./context/LanguageContext";
import translations from "../utils/language/saved-jobs.json";

const SavedJobs = ({
    jobApplications,
    deleteJobApplication,
    startEditingJob,
    archiveJobApplication,
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDocId, setCurrentDocId] = useState(null);
    const { language } = useLanguage();
    const t = translations[language].savedJobs;

    // Sortera jobben baserat på valt sorteringsordning
    const sortedJobs = [...jobApplications].sort((a, b) => {
        const dateA = new Date(a.createdAt.toDate());
        const dateB = new Date(b.createdAt.toDate());
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Filtrera jobben baserat på status (använd svenska värden för filtrering)
    const statusFilteredJobs = sortedJobs.filter((job) => {
        if (filterStatus === "") {
            return job.status && !job.archived;
        } else if (filterStatus === "Arkiverad") {
            return job.archived;
        }
        return job.status === filterStatus && !job.archived;
    });

    // Filtrera jobben baserat på sökvärde
    const filteredJobs = statusFilteredJobs.filter(
        (job) =>
            job.jobTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
            job.company.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleDeleteClick = (docId) => {
        setCurrentDocId(docId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async (docId) => {
        await deleteJobApplication(docId);
        setIsModalOpen(false);
    };

    const handleExpandListItem = (itemId, event) => {
        if (
            event.target.tagName.toLowerCase() === "button" ||
            event.target.tagName.toLowerCase() === "img"
        ) {
            return;
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
                return "applied";
        }
    };

    // Funktioner för att översätta värden baserat på språk
    const translatePosition = (position) =>
        position ? t.positionTranslations[position] || position : "";
    const translateJobType = (jobType) =>
        jobType ? t.jobTypeTranslations[jobType] || jobType : "";
    const translateStatus = (status) =>
        status ? t.statusTranslations[status] || status : "";

    return (
        <div id="savedjobs">
            <h2 className="headerspace">{t.title}</h2>

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
                <p className="empty-list">{t.emptyList}</p>
            ) : (
                <ul id="savedjoblist">
                    {filteredJobs.map((job) => (
                        <li
                            className={`savedjoblistitem ${job.id === expandedItemId ? "expand" : ""
                                }`}
                            key={job.id}
                            onClick={(event) => handleExpandListItem(job.id, event)}
                        >
                            <div className="row">
                                <div className="saved-job-row-item">
                                    <strong className="inline-paragraph">{job.jobTitle}</strong>
                                    <p className="inline-paragraph">{`${t.companyPrefix} ${job.company}`}</p>
                                    <p className="date-paragraph">
                                        {job.createdAt.toDate().toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="saved-job-row-item-2">
                                    <strong>{t.positionLabel}</strong>
                                    <p>{translatePosition(job.position)}</p>
                                </div>
                                <div className="saved-job-row-item-2">
                                    <strong>{t.statusLabel}</strong>
                                    <p>{translateStatus(job.status)}</p>
                                </div>
                            </div>

                            {job.id === expandedItemId && (
                                <>
                                    <div className="row">
                                        <div className="saved-job-row-item">
                                            <strong>{t.locationLabel}</strong>
                                            <p>{job.location}</p>
                                        </div>

                                        <div className="saved-job-row-item">
                                            <strong>{t.jobTypeLabel}</strong>
                                            <p>{translateJobType(job.jobType)}</p>
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
                                        <button
                                            className="change"
                                            title={t.changeButtonTitle}
                                            onClick={() => startEditingJob(job)}
                                            aria-label="Change"
                                        >
                                            <img src={edit} alt="Edit" />
                                        </button>
                                        <button
                                            className="archive"
                                            title={t.archiveButtonTitle}
                                            onClick={() => archiveJobApplication(job)}
                                            aria-label="Archive"
                                        >
                                            <img src={inventory} alt="Archive" />
                                        </button>
                                        <button
                                            className="delete"
                                            title={t.deleteButtonTitle}
                                            onClick={() => handleDeleteClick(job.id)}
                                            aria-label="Remove"
                                        >
                                            <img src={trash} alt="Delete" />
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            className="url-button"
                                            title={t.urlButtonTitle}
                                            onClick={() => {
                                                window.open(job.url);
                                            }}
                                        >
                                            <img src={open_in_browser} alt="Visit" />
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