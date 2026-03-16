import React from "react";
import styles from "./Modal.module.css";
import Button from "./Button";

export default function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.body}>{children}</div>
        <div style={{ marginTop: 12, textAlign: "right" }}>
          <Button variant="neutral" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
