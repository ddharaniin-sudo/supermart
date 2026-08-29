import React, { useState, useEffect } from "react";

export function showToast(message, type = "success") {
  window.dispatchEvent(
    new CustomEvent("app-toast", {
      detail: { message, type, id: Date.now() }
    })
  );
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type, id } = e.detail;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    };

    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <span className="toast-icon">✓</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
