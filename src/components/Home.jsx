//React
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
//DB & Auth
import { db } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
//Components
import Header from "./Header";
import AddJobs from "./AddJobs";
import SavedJobs from "./SavedJobs";
import Alert from "./Alert";

const Home = () => {
    //Auth
    const { user, loading } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    //Form
    const [jobTitle, setJobTitle] = useState(""); // Jobbtitel
    const [company, setCompany] = useState(""); // Företagsnamn
    const [url, setUrl] = useState(""); // Url
    const [location, setLocation] = useState("");//City and so on/ integrera med API?
    const [position, setPosition] = useState("");//Remote/Hybrid/Onsite
    const [jobType, setJobType] = useState("");//Full-time/Part-time/Contract/Internship
    const [status, setStatus] = useState({}); // Status
    const [comment, setComment] = useState(""); // Kommentar
    const [editJobId, setEditJobId] = useState(null); // För att hantera redigeringsläge
    //Applications
    const [jobApplications, setJobApplications] = useState([]); // Lista över jobbansökningar
    const [stats, setStats] = useState({ applied: 0, interview: 0, rejected: 0 });
    //Error handling
    const [error, setError] = useState("");
    const [severity, setSeverity] = useState("error");
    const [showErrorBanner, setShowErrorBanner] = useState(false);
    //Navigation
    const navigate = useNavigate();

    // Firestore-referens
    const userCollectionPath = user ? `users/${user.uid}/jobApplications` : null;

    useEffect(() => {
        if (!user && !loading) {
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        if (!userCollectionPath) return;

        const unsubscribeJobs = onSnapshot(
            query(collection(db, userCollectionPath), orderBy("createdAt", "desc")),
            (snapshot) => {
                try {
                    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setJobApplications(jobs);
                } catch (error) {
                    setError("Ett fel uppstod vid hämtning av jobbansökningar.");
                    setSeverity("warning");
                    setShowErrorBanner(true);
                }
            },
            (error) => {
                console.error("Fel vid anslutning till Firestore:", error);
                setError("Ett fel uppstod vid anslutning till databasen. Försök igen senare.");
                setShowErrorBanner(true);
            }
        );

        return () => {
            try {
                unsubscribeJobs();
            } catch (error) {
                console.error("Fel vid avregistrering av Firestore-listener:", error);
            }
        };
    }, [userCollectionPath]);


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
        } catch (error) {
            setError("Kunde inte spara jobbsökning. Försök igen.");
            setSeverity("warning");
            setShowErrorBanner(true);
        }
    };

    const deleteJobApplication = async (docId) => {
        try {
            await deleteDoc(doc(db, userCollectionPath, docId));
            console.log("Dokumentet har raderats framgångsrikt.");
        } catch (error) {
            setError("Kunde inte radera jobbsökning. Försök igen.");
            setSeverity("warning");
            setShowErrorBanner(true);
        }
    };

    const archiveJobApplication = async (docId) => {
        try {
            await updateDoc(doc(db, userCollectionPath, docId), { archived: true });
            console.log("Status uppdaterad till Arkiverad.");
        } catch (error) {
            setError("Kunde inte arkivera jobbsökning. Försök igen.");
            setSeverity("warning");
            setShowErrorBanner(true);
        }
    };

    const startEditingJob = (job) => {
        console.log(job)
        setJobTitle(job.jobTitle || "");
        setCompany(job.company || "");
        setUrl(job.url || "");
        setStatus(job.status || "");
        setEditJobId(job.id);
        setComment(job.comment || "");
        setLocation(job.location || "");
        setPosition(job.position || "");
        setJobType(job.jobType || "");
    };

    const cancelEdit = () => {
        setJobTitle(""); setCompany(""); setUrl(""); setLocation(""); setPosition(""); setJobType(""); setStatus(""); setComment(""); setEditJobId(null);
    };

    return (
        <div id="home">
            {loading ? (
                <p>Laddar...</p>
            ) : user ? (
                <>
                    <Header />
                    {showErrorBanner && (
                        <Alert severity={severity} onClose={() => setShowErrorBanner(false)}>
                            {error}
                        </Alert>
                    )}
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

                    <div className="spacer" />

                    <SavedJobs
                        jobApplications={jobApplications}
                        deleteJobApplication={deleteJobApplication}
                        startEditingJob={startEditingJob}
                        archiveJobApplication={archiveJobApplication}
                    />
                </>
            ) : (
                <p>Du måste vara inloggad för att visa denna sida. <Link to="/login">login</Link></p>
            )}
        </div>
    );
};

export default Home;

