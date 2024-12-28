import React, { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const Home = () => {
    const { user, loading } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    const [jobTitle, setJobTitle] = useState(""); // Jobbtitel
    const [company, setCompany] = useState(""); // Företagsnamn
    const [status, setStatus] = useState(""); // Status
    const [jobApplications, setJobApplications] = useState([]); // Lista över jobbansökningar

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
            await addDoc(userCollection, {
                jobTitle,
                company,
                status,
                createdAt: new Date(),
            });
            setJobTitle("");
            setCompany("");
            setStatus("");
        } catch (error) {
            console.error("Kunde inte spara jobbsökning:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            {loading ? (
                <p>Laddar...</p>
            ) : user ? (
                <>
                    <h1 style={{ marginBottom: "20px" }}>Jobbsökningar</h1>

                    <form onSubmit={addJobApplication} style={{ marginBottom: "20px" }}>
                        <div>
                            <label>Jobbtitel:</label>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="Ex: Frontend Developer"
                                required
                            />
                        </div>
                        <div>
                            <label>Företag:</label>
                            <input
                                type="text"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Ex: Spotify"
                                required
                            />
                        </div>
                        <div>
                            <label>Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="">Välj status</option>
                                <option value="Ansökt">Ansökt</option>
                                <option value="Intervju">Intervju</option>
                                <option value="Avslag">Avslag</option>
                            </select>
                        </div>
                        <button type="submit">Lägg till</button>
                    </form>

                    <div>
                        <h2>Sparade jobbsökningar</h2>
                        {jobApplications.length === 0 ? (
                            <p>Inga jobbsökningar ännu.</p>
                        ) : (
                            <ul>
                                {jobApplications.map((job) => (
                                    <li key={job.id}>
                                        <strong>{job.jobTitle}</strong> på {job.company} - Status:{" "}
                                        {job.status}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            ) : (
                <p>Du måste vara inloggad för att visa denna sida.</p>
            )}
        </div>
    );
};

export default Home;

