import ReactDOM from "react-dom";
import { auth, db } from "../../../config/firebaseConfig";
import { deleteUser } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../auth/AuthContext";
import "../../css/confirmDelete.css";
import { useLanguage } from "../LanguageContext"; // Importera språk-kontexten
import deleteAccountModalTranslations from "../deleteAccountModalTranslations.json"; // Importera översättningar

const DeleteAccountModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const t = deleteAccountModalTranslations[language].deleteAccountModal; // Hämta översättningar

    if (!isOpen) return null;

    const deleteUserAccount = async (userId) => {
        if (!userId) {
            console.error("Ingen användar-ID angiven.");
            return;
        }

        try {
            console.log(`Försöker radera Firestore-data för user: ${userId}`);

            const termsCollection = collection(db, `users/${userId}/terms`);
            const termsDocs = await getDocs(termsCollection);
            for (const term of termsDocs.docs) {
                await deleteDoc(doc(db, `users/${userId}/terms`, term.id));
            }
            console.log("Alla terms-dokument raderade");

            const jobAppsCollection = collection(db, `users/${userId}/jobApplications`);
            const jobAppsDocs = await getDocs(jobAppsCollection);
            for (const job of jobAppsDocs.docs) {
                await deleteDoc(doc(db, `users/${userId}/jobApplications`, job.id));
            }
            console.log("Alla jobApplications-dokument raderade");

            await deleteDoc(doc(db, `users/${userId}`));
            console.log(`Firestore-data för användare ${userId} har raderats.`);

            await deleteUser(auth.currentUser);
            console.log(`Användaren ${userId} har raderats från Firebase Auth.`);
        } catch (error) {
            console.error("Fel vid radering av användare:", error);
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container confirm-delete-container">
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                <section className="confirm-delete-section">
                    <p className="confirm-delete-text">{t.confirmationText}</p>
                </section>
                <div>
                    <button onClick={() => deleteUserAccount(user.uid)} className="modal-btn">
                        {t.yesButton}
                    </button>
                    <button onClick={onClose} className="modal-btn">
                        {t.noButton}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("root")
    );
};

export default DeleteAccountModal;
