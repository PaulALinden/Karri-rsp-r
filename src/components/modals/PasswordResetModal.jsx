import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../../css/PasswordResetModal.css";
import { useLanguage } from "../context/LanguageContext";
import passwordResetModalTranslations from "../../utils/language/password-reset-modal.json";

const PasswordResetModal = ({ isOpen, onClose, error, setError, handleFirebaseAuthError }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const { language } = useLanguage();
    const t = passwordResetModalTranslations[language].passwordResetModal;

    const handlePasswordReset = async () => {
        const auth = getAuth();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(t.successMessage);
            setError("");
        } catch (err) {
            const message = handleFirebaseAuthError(err, language);
            setError(message);
            setMessage("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container password-reset-container">
                <div className="modal-close-btn" onClick={onClose}>
                    ×
                </div>
                <section>
                    <h3 className="password-reset-title">{t.title}</h3>
                    <p>{t.instruction}</p>
                    <input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="password-reset-input"
                    />
                    <div className="message-container">
                        {message && (
                            <p className="password-reset-message password-reset-success">
                                {message}
                            </p>
                        )}
                        {error && (
                            <p className="password-reset-message password-reset-error">
                                {error}
                            </p>
                        )}
                    </div>
                </section>
                <div>
                    <button onClick={handlePasswordReset} className="modal-btn">
                        {t.sendButton}
                    </button>
                    <button onClick={onClose} className="modal-btn">
                        {t.cancelButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetModal;
