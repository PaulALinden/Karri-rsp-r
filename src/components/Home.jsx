//React
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
//DB & Auth
import { db } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
//Components
import AddJobs from "./AddJobs";
import SavedJobs from "./SavedJobs";

const Home = () => {
    //Auth
    const { user, loading, handleSignOut } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    //Form
    const [jobTitle, setJobTitle] = useState(""); // Jobbtitel
    const [company, setCompany] = useState(""); // Företagsnamn
    const [url, setUrl] = useState(""); // Url
    const [location, setLocation] = useState("");//City and so on/ integrera med API?
    const [position, setPosition] = useState("");//Remote/Hybrid/Onsite
    const [jobType, setJobType] = useState("");//Full-time/Part-time/Contract/Internship
    const [status, setStatus] = useState(""); // Status
    const [comment, setComment] = useState(""); // Kommentar
    const [editJobId, setEditJobId] = useState(null); // För att hantera redigeringsläge
    //Applications
    const [jobApplications, setJobApplications] = useState([]); // Lista över jobbansökningar
    const [stats, setStats] = useState({ applied: 0, interview: 0, rejected: 0 });
    //Navigation
    const navigate = useNavigate();

    // Firestore-referens
    const userCollectionPath = user ? `users/${user.uid}/jobApplications` : null;

    useEffect(() => {
        if (!user && !loading) {
            console.log("No user");
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        if (!userCollectionPath) return;
        console.log("hämtar");
        const unsubscribeJobs = onSnapshot(
            query(collection(db, userCollectionPath), orderBy("createdAt", "desc")),
            (snapshot) => {
                const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setJobApplications(jobs);
                let count = { applied: jobs.length, interview: jobs.filter(j => j.status === "Intervju").length, rejected: jobs.filter(j => j.status === "Avslag").length };
                setStats(count);
            });

        return unsubscribeJobs;
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
            console.error("Kunde inte spara jobbsökning:", error);
        }
    };

    const deleteJobApplication = async (docId) => {
        try {
            await deleteDoc(doc(db, userCollectionPath, docId));
            console.log("Dokumentet har raderats framgångsrikt.");
        } catch (error) {
            console.error("Kunde inte radera jobbsökning:", error);
        }
    };

    const archiveJobApplication = async (docId) => {
        try {
            await updateDoc(doc(db, userCollectionPath, docId), { archived: true });
            console.log("Status uppdaterad till Arkiverad.");
        } catch (error) {
            console.error("Kunde inte uppdatera status:", error);
        }
    };

    const startEditingJob = (job) => {
        setJobTitle(job.jobTitle); setCompany(job.company); setUrl(job.url || ""); setStatus(job.status); setEditJobId(job.id); setComment(job.comment || "")
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
                        stats={stats}
                    />

                    <button onClick={handleSignOut} id="signout">Sign out</button>
                </>
            ) : (
                <p >Du måste vara inloggad för att visa denna sida. <Link to="/login">login</Link></p>
            )}
        </div>
    );
};

export default Home;

