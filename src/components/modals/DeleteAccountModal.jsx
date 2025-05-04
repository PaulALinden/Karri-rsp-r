import ReactDOM from "react-dom";
import { auth, db } from "../../../config/firebaseConfig";
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../auth/AuthContext";
import "../../css/confirmDelete.css";
import { useLanguage } from "../context/LanguageContext";
import translations from "../../utils/language/delete-account-modal.json";
import { useState } from "react";

const DeleteAccountModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const t = translations[language].deleteAccountModal;
    const [password, setPassword] = useState(""); // För att lagra lösenordet
    const [error, setError] = useState(null); // För att visa felmeddelanden
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false); // Visa lösenordsfält vid behov

    if (!isOpen) return null;

    const reauthenticateUser = async () => {
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);
            setShowPasswordPrompt(false); // Stäng lösenordsfältet efter lyckad reautentisering
            await deleteUserAccount(user.uid); // Fortsätt med radering
        } catch (err) {
            setError(t.reauthFailed); // Visa felmeddelande om reautentisering misslyckas
            //console.error("Reautentisering misslyckades:", err);
        }
    };

    const deleteUserAccount = async (userId) => {
        if (!userId) {
            //console.error("Ingen användar-ID angiven.");
            return;
        }

        try {
            //console.log(`Försöker radera Firestore-data för user: ${userId}`);

            const termsCollection = collection(db, `users/${userId}/terms`);
            const termsDocs = await getDocs(termsCollection);
            for (const term of termsDocs.docs) {
                await deleteDoc(doc(db, `users/${userId}/terms`, term.id));
            }
            //console.log("Alla terms-dokument raderade");

            const jobAppsCollection = collection(db, `users/${userId}/jobApplications`);
            const jobAppsDocs = await getDocs(jobAppsCollection);
            for (const job of jobAppsDocs.docs) {
                await deleteDoc(doc(db, `users/${userId}/jobApplications`, job.id));
            }
            //console.log("Alla jobApplications-dokument raderade");

            await deleteDoc(doc(db, `users/${userId}`));
            //console.log(`Firestore-data för användare ${userId} har raderats.`);

            await auth.currentUser.reload();
            await deleteUser(auth.currentUser);
            //console.log(`Användaren ${userId} har raderats från Firebase Auth.`);
            onClose(); // Stäng modalen efter lyckad radering
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                setShowPasswordPrompt(true); // Visa lösenordsfält om reautentisering krävs
            } else {
                //console.error("Fel vid radering av användare:", error);
                setError(t.deleteFailed); // Visa generellt felmeddelande
            }
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container confirm-delete-container">
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                <section className="confirm-delete-section">
                    {showPasswordPrompt ? (
                        <>
                            <p>{t.reauthPrompt}</p>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.passwordPlaceholder}
                                className="modal-input"
                            />
                            {error && <p className="error-text">{error}</p>}
                            <button onClick={reauthenticateUser} className="modal-btn">
                                {t.confirmReauthButton}
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="confirm-delete-text">{t.confirmationText}</p>
                            {error && <p className="error-text">{error}</p>}
                            <div>
                                <button onClick={() => deleteUserAccount(user.uid)} className="modal-btn">
                                    {t.yesButton}
                                </button>
                                <button onClick={onClose} className="modal-btn">
                                    {t.noButton}
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>,
        document.getElementById("root")
    );
};

export default DeleteAccountModal;