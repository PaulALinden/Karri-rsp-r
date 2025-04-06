import ReactDOM from 'react-dom';
import { auth, db } from "../../../config/firebaseConfig";
import { deleteUser } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../auth/AuthContext";
import "../../css/confirmDelete.css"
const DeleteAccountModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Om modalen inte är öppen renderas den inte
    const { user } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp

    const deleteUserAccount = async (userId) => {
        if (!userId) {
            console.error("Ingen användar-ID angiven.");
            return;
        }

        try {
            console.log(`Försöker radera Firestore-data för user: ${userId}`);

            // Radera alla `terms/` under användaren
            const termsCollection = collection(db, `users/${userId}/terms`);
            const termsDocs = await getDocs(termsCollection);
            for (const term of termsDocs.docs) {
                await deleteDoc(doc(db, `users/${userId}/terms/${term.id}`));
            }
            console.log("Alla terms-dokument raderade");

            // Radera alla `jobApplications/` under användaren
            const jobAppsCollection = collection(db, `users/${userId}/jobApplications`);
            const jobAppsDocs = await getDocs(jobAppsCollection);
            for (const job of jobAppsDocs.docs) {
                await deleteDoc(doc(db, `users/${userId}/jobApplications/${job.id}`));
            }
            console.log("Alla jobApplications-dokument raderade");

            // Nu kan vi radera huvud-dokumentet i `users/`
            await deleteDoc(doc(db, `users/${userId}`));
            console.log(`Firestore-data för användare ${userId} har raderats.`);

            // Radera användaren från Firebase Authentication
            await deleteUser(auth.currentUser);
            console.log(`Användaren ${userId} har raderats från Firebase Auth.`);

        } catch (error) {
            console.error("Fel vid radering av användare:", error);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container confirm-delete-container">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <section className="confirm-delete-section">
                    <p className="confirm-delete-text">Är du säker på att du vill ta bort ditt konto?</p>
                </section>
                <div>
                    <button onClick={() => deleteUserAccount(user.uid)} className="modal-btn">Ja</button>
                    <button onClick={onClose} className="modal-btn">Nej</button>
                </div>
            </div>
        </div>,
        document.getElementById('root') // Render the modal overlay in the div with id="root"
    );
};

export default DeleteAccountModal;
