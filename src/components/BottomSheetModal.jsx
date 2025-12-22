// src/components/BottomSheetModal.jsx

import { useEffect } from "react";
import "./BottomSheetModal.css";

export default function BottomSheetModal({
  visible = false,
  closeModal,
  title,
  children,
}) {
  // Prevent background scroll when open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="bottom-sheet__overlay" onClick={closeModal} aria-hidden />

      {/* Sheet */}
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Handle */}
        <div className="bottom-sheet__handle" />

        {/* Title */}
        {title && <div className="bottom-sheet__title">{title}</div>}

        {/* Content */}
        <div className="bottom-sheet__content">{children}</div>
      </div>
    </>
  );
}
