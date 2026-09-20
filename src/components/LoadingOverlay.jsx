import React from 'react';
import '../css/LoadingOverlay.css';

const LoadingOverlay = ({ message = "Loading..." }) => {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
            <div className="loading-text">{message}</div>
        </div>
    );
};

export default LoadingOverlay;
