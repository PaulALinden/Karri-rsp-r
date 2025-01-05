import React, { useState, useEffect } from "react";

import { db } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";

import AddJobs from "./AddJobs";
import SavedJobs from "./SavedJobs";

const Home = () => {
    const { user, loading } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    const [jobTitle, setJobTitle] = useState(""); // Jobbtitel
    const [company, setCompany] = useState(""); // Företagsnamn
    const [url, setUrl] = useState(""); // Url
    const [status, setStatus] = useState(""); // Status
    const [jobApplications, setJobApplications] = useState([]); // Lista över jobbansökningar
    const [editJobId, setEditJobId] = useState(null); // För att hantera redigeringsläge

    // Firestore-referens
    const userCollectionPath = user ? `users/${user.uid}/jobApplications` : null;

    // Realtidsuppdatering
    useEffect(() => {
        if (!userCollectionPath) return;

        const userCollection = collection(db, userCollectionPath);
        const jobsQuery = query(userCollection, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(jobsQuery, (snapshot) => {
            const jobs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJobApplications(jobs);
        });

        return () => unsubscribe();
    }, [userCollectionPath]);

    // Lägga till ny jobbsökning
    const addJobApplication = async (e) => {
        e.preventDefault();
        if (!userCollectionPath) return;

        if (!jobTitle || !company || !status) {
            alert("Fyll i alla fält.");
            return;
        }

        try {
            const userCollection = collection(db, userCollectionPath);
            if (editJobId) {
                // Uppdatera jobb
                const docRef = doc(db, userCollectionPath, editJobId);
                await updateDoc(docRef, { jobTitle, company, url, status });
                setEditJobId(null); // Avsluta redigeringsläge
            } else {
                // Lägg till nytt jobb
                await addDoc(userCollection, {
                    jobTitle,
                    company,
                    url,
                    status,
                    createdAt: new Date(),
                });
            }

            setJobTitle("");
            setCompany("");
            setUrl("");
            setStatus("");
        } catch (error) {
            console.error("Kunde inte spara jobbsökning:", error);
        }
    };

    //Tabort befintlig jobbsökning
    const deleteJobApplication = async (docId) => {
        try {
            // Skapa referens till det specifika dokumentet
            const docRef = doc(db, userCollectionPath, docId);
            // Radera dokumentet
            await deleteDoc(docRef);
            console.log("Dokumentet har raderats framgångsrikt.");
        } catch (error) {
            console.error("Kunde inte radera jobbsökning:", error);
        }
    };

    const startEditingJob = (job) => {
        setJobTitle(job.jobTitle);
        setCompany(job.company);
        setUrl(job.url);
        setStatus(job.status);
        setEditJobId(job.id); // Spara ID:t på jobbet som redigeras
    };

    const cancelEdit = () => {
        // Återställ formuläret och avsluta redigeringsläge
        setJobTitle("");
        setCompany("");
        setUrl("");
        setStatus("");
        setEditJobId(null);
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
                    <SavedJobs
                        jobApplications={jobApplications}
                        deleteJobApplication={deleteJobApplication}
                        startEditingJob={startEditingJob}
                    />
                </>
            ) : (
                <p>Du måste vara inloggad för att visa denna sida.</p>
            )}
        </div>
    );
};

export default Home;

