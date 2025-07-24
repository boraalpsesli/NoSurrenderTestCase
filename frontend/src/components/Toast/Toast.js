import React from 'react';
import './Toast.css';

function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast-message">
        {message}
        <button className="toast-close" onClick={onClose} aria-label="Kapat">&times;</button>
      </div>
    </div>
  );
}

export default Toast; 