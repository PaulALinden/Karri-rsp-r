import { useState } from "react";
import FilterOptions from "./FilterOptions";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt, FaArchive } from "react-icons/fa";
import Statistics from "./Statistics"
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "../css/savedJobs.css"

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

    return (
        <div id="savedjobs">
            <h2 className="headerspace">Sparade jobbsökningar</h2>

            <Statistics className="statistics" stats={stats}/>

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
                    {filteredJobs.map((job) => (console.log(job.createdAt.toDate().toLocaleDateString()),

                        <li
                            className="savedjoblistitem"
                            key={job.id}
                            onClick={(e) => {
                                if (!e.target.closest("button")) {
                                    window.open(job.url, '_blank');
                                }
                            }}
                        >

                            <div className="first-row">

                                <div className="saved-job-row-item">
                                    <strong className="inline-paragraph">{job.jobTitle}</strong>
                                    <p className="inline-paragraph">{`på ${job.company}`}</p>
                                    <p className="inline-paragraph">{job.createdAt.toDate().toLocaleDateString()}</p>
                                </div>

                                <div className="saved-job-row-item-2">
                                    <strong>Arbetsform: </strong>
                                    <p>{job.jobType}</p>
                                </div>
                                <div className="saved-job-row-item-2">
                                    <strong>Status:</strong><p> {job.status}</p>
                                </div>
                            </div>

                        
                            <div className="listbuttons">
                                <button className="change" onClick={() => startEditingJob(job)} aria-label="Change">
                                    <FaPencilAlt />
                                </button>
                                <button className="archive" onClick={() => archiveJobApplication(job.id)} aria-label="Remove">
                                    <FaArchive />
                                </button>
                                <button className="delete" onClick={() => handleDeleteClick(job.id)} aria-label="Remove">
                                    <MdDelete />
                                </button>
                            </div>
                            
                            <div className="status-color"/>
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

