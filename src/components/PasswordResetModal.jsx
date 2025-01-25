import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../css/PasswordResetModal.css";

const PasswordResetModal = ({ isOpen, onClose, error, setError, handleFirebaseAuthError }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handlePasswordReset = async () => {
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Återställningslänk har skickats till din e-post.");
            setError(""); // Töm felmeddelanden
        } catch (err) {
            const message = handleFirebaseAuthError(err);
            setError(message);
            setMessage(""); // Töm framgångsmeddelanden
        }
    };

    if (!isOpen) return null; // Rendera inte modalen om den inte är öppen

    return (
        <div className="modal-overlay">
            <div className="modal-container password-reset-container">
                <div className="modal-close-btn" onClick={onClose}>&times;</div>
                <section>
                    <h3 className="password-reset-title">Återställ lösenord</h3>
                    <p>Ange din e-postadress nedan för att få en återställningslänk.</p>
                    <input
                        type="email"
                        placeholder="E-postadress"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="password-reset-input"
                    />
                    <div className="message-container">
                        {message && <p className="password-reset-message password-reset-success">{message}</p>}
                        {error && <p className="password-reset-message password-reset-error">{error}</p>}
                    </div>

                </section>
                <div>
                    <button onClick={handlePasswordReset} className="modal-btn">Skicka länk</button>
                    <button onClick={onClose} className="modal-btn">Avbryt</button>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetModal;
