import React from 'react';
import '../Successful Payment/SuccessModal.css';

const ComingSoonModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon-2">⏳</div>
        <h2>Coming Soon! 🚀</h2>
        <p>We are working hard to bring our mobile app to you.</p>
        <p><b>Stay tuned for the official launch!</b></p>
        <button onClick={onClose} className="close-btn">
          Got it!
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
