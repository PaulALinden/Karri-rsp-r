import "../css/confirmDelete.css"

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, docId }) => {
    if (!isOpen) return null; // Om modalen inte är öppen renderas den inte

    return (
        <div className="confirm-delete-overlay">
            <div className="confirm-delete-modal">
                <div className="confirm-delete-divider">
                    <section className="confirm-delete-section">
                        <p className="confirm-delete-p">Är du säker på att du vill ta bort objektet?</p>
                        <p className="confirm-delete-p">Detta kommer även att påverka din statistik.</p>
                        <p className="confirm-delete-p">Välj annars arkivera.</p>
                    </section>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div>
                    <button onClick={() => onConfirm(docId)} className="confirm-btn">Ja</button>
                    <button onClick={onClose} className="confirm-btn">Nej</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
