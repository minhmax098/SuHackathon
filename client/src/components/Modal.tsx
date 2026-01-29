import React, { useEffect } from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: number;   // px
    maxHeightVh?: number; // %
};

export default function Modal({
    open,
    onClose,
    title,
    children,
    width = 980,
    maxHeightVh = 86,
    }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
        document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div style={styles.backdrop} onClick={onClose} role="presentation">
        <div
            style={{ ...styles.panel, width: `min(${width}px, 100%)`, maxHeight: `${maxHeightVh}vh` }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div style={styles.header}>
            <div style={styles.title}>{title}</div>
            <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
                ×
            </button>
            </div>

            <div style={styles.body}>{children}</div>
        </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    backdrop: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 9999,
    },
    panel: {
        background: "#fff",
        borderRadius: 6,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        borderBottom: "1px solid #e9eef4",
        background: "#fff",
        flex: "0 0 auto",
    },
    title: { fontSize: 14, fontWeight: 600, color: "#4b5563" },
    closeBtn: {
        padding: 0,
        width: 32,
        height: 32,
        border: "none",
        borderRadius: 6,
        background: "transparent",
        fontSize: 22,
        lineHeight: 1,
        cursor: "pointer",
        color: "#6b7280",
    },
    body: {
        padding: 16,
        overflow: "auto",
    },
};
