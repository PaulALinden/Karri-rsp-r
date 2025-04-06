import ReactDOM from "react-dom";
import "../../css/confirmDelete.css";
import { useLanguage } from "../context/LanguageContext"; // Importera språk-kontexten
import translations from "../../utils/language/confirm-delete-modal.json"; // Importera översättningar

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, docId }) => {
    const { language } = useLanguage();
    const t = translations[language].confirmDeleteModal; // Hämta översättningar

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container confirm-delete-container">
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                <section className="confirm-delete-section">
                    <p className="confirm-delete-text">{t.confirmationText1}</p>
                    <p className="confirm-delete-text">{t.confirmationText2}</p>
                    <p className="confirm-delete-text">{t.confirmationText3}</p>
                </section>
                <div>
                    <button onClick={() => onConfirm(docId)} className="modal-btn">
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

export default ConfirmDeleteModal;
