import React from "react";
import "./popup.css";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const AlertPopup = ({ message, type, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="alert-icon success" size={48} />;
      case "error":
        return <XCircle className="alert-icon error" size={48} />;
      case "warning":
        return <AlertCircle className="alert-icon warning" size={48} />;
      default:
        return null;
    }
  };

  return (
    <div className="popup-overlay">
      <div className="alert-container">
        <div className="alert-content">
          {getIcon()}
          <p className="alert-message">{message}</p>
          <button className="alert-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
