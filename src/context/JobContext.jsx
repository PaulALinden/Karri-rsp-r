// JobContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const JobContext = createContext();

export const JobProvider = ({ user, children }) => {
    const [jobApplications, setJobApplications] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const userCollectionPath = user ? `users/${user.uid}/jobApplications` : null;

    useEffect(() => {
        console.log("Hämtar i effect")
        if (!userCollectionPath) {
            setLoading(false);
            return;
        }

        const unsubscribeJobs = onSnapshot(
            query(collection(db, userCollectionPath), orderBy("createdAt", "desc")),
            (snapshot) => {
                try {
                    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setJobApplications(jobs);
                    setError("");
                } catch (err) {
                    setError("Ett fel uppstod vid hämtning av jobbansökningar.");
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError("Ett fel uppstod vid anslutning till databasen.");
                setLoading(false);
            }
        );

        return () => unsubscribeJobs();
    }, [userCollectionPath]);

    return (
        <JobContext.Provider value={{ jobApplications, error, loading }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobs = () => useContext(JobContext);