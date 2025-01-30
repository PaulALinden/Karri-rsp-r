
import ReactDOM from 'react-dom';
import "../css/confirmDelete.css"

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, docId }) => {
    if (!isOpen) return null; // Om modalen inte är öppen renderas den inte

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container confirm-delete-container">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <section className="confirm-delete-section">
                    <p className="confirm-delete-text">Är du säker på att du vill ta bort objektet?</p>
                    <p className="confirm-delete-text">Detta kommer även att påverka din statistik.</p>
                    <p className="confirm-delete-text">Välj annars arkivera.</p>
                </section>
                <div>
                    <button onClick={() => onConfirm(docId)} className="modal-btn">Ja</button>
                    <button onClick={onClose} className="modal-btn">Nej</button>
                </div>
            </div>
        </div>,
        document.getElementById('root') // Render the modal overlay in the div with id="root"
    );
};

export default ConfirmDeleteModal;
