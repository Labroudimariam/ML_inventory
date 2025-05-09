import React, { useEffect } from "react";
import "./alerts.css";

const SuccessAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="alert-container">
      <div className="alert success">
        <div className="alert-content">
          <div className="icon">
            <svg className="alert-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
          </div>
          <div className="text-content">
            <p className="alert-title">Success!</p>
            <p className="alert-message">{message}</p>
          </div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close alert">
          <svg className="close-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;