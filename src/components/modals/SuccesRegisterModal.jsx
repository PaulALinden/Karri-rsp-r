import "../../css/successModal.css";
import { useNavigate } from "react-router";

const SuccessModal = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    if (!isOpen) return null; // Om modalen inte är öppen renderas den inte

    return (
        <div className="modal-overlay">
            <div className="modal-container success-modal-container">
                <button className="modal-close-btn" onClick={() => setIsOpen(false)}>&times;</button>
                <section className="success-modal-section">
                    <p className="success-modal-text">Konto skapat framgångsrikt!</p>
                    <p className="success-modal-text">Vänligen verifiera din e-postadress innan du loggar in.</p>
                </section>
                <div>
                    <button onClick={() => {
                        navigate("/login");
                    }} className="modal-btn">OK</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
