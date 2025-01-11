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
    const { user, loading, handleSignOut } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    const [jobTitle, setJobTitle] = useState(""); // Jobbtitel
    const [company, setCompany] = useState(""); // Företagsnamn
    const [url, setUrl] = useState(""); // Url
    const [status, setStatus] = useState(""); // Status
    const [jobApplications, setJobApplications] = useState([]); // Lista över jobbansökningar
    const [editJobId, setEditJobId] = useState(null); // För att hantera redigeringsläge
    const [stats, setStats] = useState({ applied: 0, interview: 0, rejected: 0 });
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
            if (editJobId) {
                await updateDoc(doc(db, userCollectionPath, editJobId), { jobTitle, company, url, status });
                setEditJobId(null);
            } else {
                await addDoc(userCollection, { jobTitle, company, url, status, createdAt: new Date() });
            }
            setJobTitle(""); setCompany(""); setUrl(""); setStatus("");
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
            await updateDoc(doc(db, userCollectionPath, docId), { status: "Arkiverad" });
            console.log("Status uppdaterad till Arkiverad.");
        } catch (error) {
            console.error("Kunde inte uppdatera status:", error);
        }
    };

    const startEditingJob = (job) => {
        setJobTitle(job.jobTitle); setCompany(job.company); setUrl(job.url); setStatus(job.status); setEditJobId(job.id);
    };

    const cancelEdit = () => {
        setJobTitle(""); setCompany(""); setUrl(""); setStatus(""); setEditJobId(null);
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
                        status={status}
                        setStatus={setStatus}
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

