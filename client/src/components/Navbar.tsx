import React from "react";
import { NavLink } from "react-router-dom";

type NavbarProps = {
    onOpenTutorials?: () => void;
    onOpenMethods?: () => void;
};

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#111827" : "#6B7280",
    textDecoration: "none",
    fontSize: 16,
    padding: "10px 6px",
});

export default function Navbar({ onOpenTutorials, onOpenMethods }: NavbarProps) {
    const openTutorials = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = "tutorials";
        onOpenTutorials?.();
    };

    const openMethods = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = "methods";
        onOpenMethods?.();
    };

    return (
        <header style={styles.header}>
        <div style={styles.topRow}>
            <div style={styles.brand}>
            <div style={styles.logoDot} />
            <span style={styles.brandText}>Irrigator</span>
            </div>

            <div style={styles.authButtons}>
            <NavLink to="/login" style={styles.btnPrimary}>
                SIGN IN
            </NavLink>
            <NavLink to="/register" style={styles.btnPrimary}>
                REGISTER
            </NavLink>
            </div>
        </div>

        <nav style={styles.nav}>
            <NavLink to="/" style={linkStyle}>
            Home
            </NavLink>

            <a href="#about" style={styles.navA}>
            About
            </a>

            <a href="#tutorials" style={styles.navA} onClick={openTutorials}>
            Tutorials
            </a>

            <a href="#methods" style={styles.navA} onClick={openMethods}>
            Methods
            </a>

            <a href="#download" style={styles.navA}>
            Download the App
            </a>
        </nav>
        </header>
    );
}

const styles: Record<string, React.CSSProperties> = {
    header: { 
        width: "100%", background: "#fff", borderBottom: "1px solid #E5E7EB" 
    },
    topRow: { 
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px" 
    },
    brand: { 
        display: "flex", alignItems: "center", gap: 10 
    },
    logoDot: { 
        width: 18, height: 18, borderRadius: 999, background: "linear-gradient(180deg, #5B8CFF, #7C3AED)" 
    },
    brandText: { 
        fontSize: 22, fontWeight: 700, color: "#111827" 
    },
    authButtons: { 
        display: "flex", gap: 10 
    },
    btnPrimary: { 
        display: "inline-block", padding: "10px 16px", background: "#6D74FF", color: "white", borderRadius: 6, textDecoration: "none", fontWeight: 700, fontSize: 14, letterSpacing: 0.3 
    },
    nav: { 
        display: "flex", gap: 18, padding: "8px 22px 14px" 
    },
    navA: { 
        color: "#6B7280", textDecoration: "none", fontSize: 16, padding: "10px 6px", cursor: "pointer" 
    },
};
