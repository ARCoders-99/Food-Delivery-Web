import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Toast;
