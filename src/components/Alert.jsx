import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../css/alert.css'; // Lägg till CSS för styling

const Alert = ({ severity, children, onClose }) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
    };

    return (
        <div className={`alert alert-${severity}`}>
            <span>{children}</span>
            <button className="alert-close-btn" onClick={handleClose}>
                &times;
            </button>
        </div>
    );
};

Alert.propTypes = {
    severity: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
};

Alert.defaultProps = {
    onClose: null,
};

export default Alert;
