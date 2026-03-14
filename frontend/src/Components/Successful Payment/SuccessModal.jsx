import React from "react";
import "./SuccessModal.css";


const SuccessModal = ({ show, onClose, amount }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="success-icon-2">✔</div>
        <h2>Payment Successful 🎉</h2>
        <p>Thank you! Your order has been placed successfully.</p>
        <p><b>Your order is done!</b></p>
        {amount && <p><b>Total Paid:</b> ${amount}</p>}
        <button onClick={onClose} className="close-btn">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
