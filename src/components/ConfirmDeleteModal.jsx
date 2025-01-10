import React, { useState } from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, docId }) => {
    if (!isOpen) return null; // Om modalen inte är öppen renderas den inte

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeBtn} onClick={onClose}>&times;</button>
                <p>Är du säker på att du vill ta bort objektet?</p>
                <div>
                    <button onClick={() => onConfirm(docId)} style={styles.confirmBtn}>Ja</button>
                    <button onClick={onClose} style={styles.cancelBtn}>Nej</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center',
        position: 'relative',
    },
    closeBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '24px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
    },
    confirmBtn: {
        backgroundColor: 'green',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '10px',
    },
    cancelBtn: {
        backgroundColor: 'red',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
    },
};

export default ConfirmDeleteModal;
