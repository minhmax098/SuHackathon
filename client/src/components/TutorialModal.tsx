import React, { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    youtubeId: string;
};

export default function TutorialModal({
    open,
    onClose,
    title = "Web System Tutorials",
    youtubeId,
    }: Props) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        };
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
            style={styles.panel}
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

            <div style={styles.body}>
            <div style={styles.videoWrap}>
                <iframe
                style={styles.iframe}
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Tutorial video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                />
            </div>
            </div>
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
        width: "min(980px, 100%)",
        background: "#fff",
        borderRadius: 6,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    },
    header: {
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        borderBottom: "1px solid #e9eef4",
        background: "#fff",
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
    body: { padding: 14 },
    videoWrap: {
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        background: "#000",
    },
    iframe: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
    },
};
