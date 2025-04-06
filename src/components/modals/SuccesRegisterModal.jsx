import "../../css/successModal.css";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import successModalTranslations from "../../utils/language/success-modal.json";

const SuccessModal = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = successModalTranslations[language].successModal;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container success-modal-container">
                <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
                    ×
                </button>
                <section className="success-modal-section">
                    <p className="success-modal-text">{t.successMessage}</p>
                    <p className="success-modal-text">{t.verifyMessage}</p>
                </section>
                <div>
                    <button
                        onClick={() => {
                            navigate("/login");
                        }}
                        className="modal-btn"
                    >
                        {t.okButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;