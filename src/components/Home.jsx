import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "./auth/AuthContext";
import { useJobs } from "./context/JobContext"; // Ny import
import { collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Header from "./Header";
import AddJobs from "./AddJobs";
import SavedJobs from "./SavedJobs";
import Alert from "./Alert";

const Home = () => {
    const { user, loading: authLoading } = useAuth();
    const { jobApplications, error: jobError, loading: jobsLoading } = useJobs(); // Hämta från Context
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");
    const [url, setUrl] = useState("");
    const [location, setLocation] = useState("");
    const [position, setPosition] = useState("");
    const [jobType, setJobType] = useState("");
    const [status, setStatus] = useState({});
    const [comment, setComment] = useState("");
    const [editJobId, setEditJobId] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia("(max-width: 1000px)").matches);
    const [switchToAdd, setSwitchToAdd] = useState(false);
    const [error, setError] = useState("");
    const [severity, setSeverity] = useState("error");
    const [showErrorBanner, setShowErrorBanner] = useState(false);
    const userCollectionPath = useMemo(() => user ? `users/${user.uid}/jobApplications` : null, [user]);

    useEffect(() => {
        if (jobError) {
            setError(jobError);
            setShowErrorBanner(true);
        }
    }, [jobError]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1000px)");
        setIsSmallScreen(mediaQuery.matches);
        const handleChange = (e) => setIsSmallScreen(e.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const addJobApplication = async (e) => {
        e.preventDefault();
        if (!userCollectionPath || !jobTitle || !company || !status) return alert("Fyll i alla fält.");
        try {
            const userCollection = collection(db, userCollectionPath);
            const jobData = { jobTitle, company, url, location, position, jobType, status, createdAt: new Date(), comment };
            if (editJobId) {
                await updateDoc(doc(db, userCollectionPath, editJobId), jobData);
                setEditJobId(null);
            } else {
                await addDoc(userCollection, jobData);
            }
            cancelEdit();
            if (isSmallScreen) setSwitchToAdd(false);
        } catch (error) {
            setError("Kunde inte spara jobbsökning. Försök igen.");
            setSeverity("warning");
            setShowErrorBanner(true);
        }
    };

    const deleteJobApplication = async (docId) => {
        try {
            await deleteDoc(doc(db, userCollectionPath, docId));
        } catch (error) {
            setError("Kunde inte radera jobbsökning. Försök igen.");
            setSeverity("warning");
            setShowErrorBanner(true);
        }
    };

    const archiveJobApplication = async (job) => {
        try {
            const archived = !(job.archived || false);
            await updateDoc(doc(db, userCollectionPath, job.id), { archived });
        } catch (error) {
            setError("Kunde inte arkivera jobbsökning. Försök igen.");
            setSeverity("warning");
            setShowErrorBanner(true);
        }
    };

    const startEditingJob = (job) => {
        setJobTitle(job.jobTitle || "");
        setCompany(job.company || "");
        setUrl(job.url || "");
        setStatus(job.status || {});
        setEditJobId(job.id);
        setComment(job.comment || "");
        setLocation(job.location || "");
        setPosition(job.position || "");
        setJobType(job.jobType || "");
        if (isSmallScreen) setSwitchToAdd(true);
    };

    const cancelEdit = () => {
        setJobTitle("");
        setCompany("");
        setUrl("");
        setLocation("");
        setPosition("");
        setJobType("");
        setStatus({});
        setComment("");
        setEditJobId(null);
        if (isSmallScreen) setSwitchToAdd(false);
    };

    return (
        <div id="home">
            {authLoading || jobsLoading || isSmallScreen === null ? (
                <p>Laddar...</p>
            ) : user ? (
                <>
                    <Header />
                    {showErrorBanner && (
                        <Alert severity={severity} onClose={() => setShowErrorBanner(false)}>
                            {error}
                        </Alert>
                    )}
                    {isSmallScreen ? (
                        <button className="switch-button" title="Lägg till" onClick={() => setSwitchToAdd(!switchToAdd)}>
                            <p>{!switchToAdd ? "Lägg till ny ansökan +" : "Gå till sparade ansökningar"}</p>
                        </button>
                    ) : null}
                    {!isSmallScreen || switchToAdd ? (
                        <AddJobs
                            jobTitle={jobTitle}
                            setJobTitle={setJobTitle}
                            company={company}
                            setCompany={setCompany}
                            url={url}
                            setUrl={setUrl}
                            location={location}
                            setLocation={setLocation}
                            position={position}
                            setPosition={setPosition}
                            jobType={jobType}
                            setJobType={setJobType}
                            status={status}
                            setStatus={setStatus}
                            comment={comment}
                            setComment={setComment}
                            addJobApplication={addJobApplication}
                            isEditing={!!editJobId}
                            cancelEdit={cancelEdit}
                        />
                    ) : null}
                    {!isSmallScreen ? <div className="spacer" /> : null}
                    {!switchToAdd ? (
                        <SavedJobs
                            className={""}
                            jobApplications={jobApplications}
                            deleteJobApplication={deleteJobApplication}
                            startEditingJob={startEditingJob}
                            archiveJobApplication={archiveJobApplication}
                        />
                    ) : null}
                </>
            ) : (
                <p>Du måste vara inloggad för att visa denna sida. <Link to="/login">login</Link></p>
            )}
        </div>
    );
};

export default Home;

