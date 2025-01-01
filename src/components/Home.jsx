import React, { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";
import { collection, doc, addDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";

import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";

const Home = () => {
    const { user, loading } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    const [jobTitle, setJobTitle] = useState(""); // Jobbtitel
    const [company, setCompany] = useState(""); // Företagsnamn
    const [url, setUrl] = useState(""); // Url
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
                url,
                status,
                createdAt: new Date(),
            });
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

    return (
        <div id="home">
            {loading ? (
                <p>Laddar...</p>
            ) : user ? (
                <>
                    <div id="addjob">

                        <h1 className="headerspace">Jobbsökningar</h1>

                        <form onSubmit={addJobApplication}>
                            <div className="addjobform-group">
                                <label className="addjobform-label">Jobbtitel:</label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="Ex: Frontend Developer"
                                    required
                                    className="addjobform-input"
                                />
                            </div>
                            <div className="addjobform-group">
                                <label className="addjobform-label">Företag:</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="Ex: Spotify"
                                    required
                                    className="addjobform-input"
                                />
                            </div>
                            <div className="addjobform-group">
                                <label className="addjobform-label">Url:</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Ex: www.exempel.com"
                                    required
                                    className="addjobform-input"
                                />
                            </div>
                            <div className="addjobform-group">
                                <label className="addjobform-label">Status:</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                    className="addjobform-select"
                                >
                                    <option value="">Välj status</option>
                                    <option value="Ansökt">Ansökt</option>
                                    <option value="Intervju">Intervju</option>
                                    <option value="Avslag">Avslag</option>
                                </select>
                            </div>
                            <button className="addButton" type="submit">Lägg till</button>
                        </form>
                    </div>

                    <span className="spacer" />

                    <div id="savedjobs">
                        <h2 className="headerspace">Sparade jobbsökningar</h2>
                        {jobApplications.length === 0 ? (
                            <p>Inga jobbsökningar ännu.</p>
                        ) : (
                            <ul id="savedjoblist">
                                {jobApplications.map((job) => (
                                    <li className="savedjoblistitem" key={job.id} onClick={() => window.open(job.url, '_blank')}>
                                        <div>
                                            <strong>{job.jobTitle}</strong> på {job.company}
                                        </div>
                                        <span>Status: {job.status}</span>
                                        <div className="listbuttons">
                                            <button id="change" onClick={() => console.log("Change")} aria-label="Change">
                                                <FaPencilAlt />
                                            </button>
                                            <button id="delete" onClick={() => deleteJobApplication(job.id)} aria-label="Remove">
                                                <MdDelete />
                                            </button>
                                        </div>
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

