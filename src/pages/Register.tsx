import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./auth.css";

export default function Register() {
    const nav = useNavigate();
    const { register } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [accept, setAccept] = useState(false);
    const [err, setErr] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr("");

        if (!firstName.trim()) return setErr("Please enter a name");
        if (!lastName.trim()) return setErr("Please enter a last name");
        if (!email.trim()) return setErr("Please enter an email");
        if (password.length < 8) return setErr("Password must be at least 8 characters");
        if (password !== confirm) return setErr("Passwords do not match");
        if (!accept) return setErr("Please accept Terms and Conditions");

        try {
        // Backend bạn đang dùng register(name, email, password)
            await register(`${firstName} ${lastName}`.trim(), email, password);
            nav("/dashboard");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Register failed";
            setErr(message);
        }
    }

    return (
        <div className="auth-page">
        <div className="auth-card">
            <div className="auth-header">
            <span className="logo" />
                Irrigator
            </div>

            <div className="auth-body">
            <h2 className="auth-title">Free Sign Up</h2>
            <p className="auth-subtitle">
                Don't have an account? Create your account, <br />
                it takes less than a minute
            </p>

            {err && <p className="auth-error">{err}</p>}

            <form className="auth-form" onSubmit={onSubmit}>
                <label className="auth-label">Name</label>
                <input
                    className="auth-input"
                    placeholder="Please enter a name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                />

                <label className="auth-label">Last Name</label>
                <input
                    className="auth-input"
                    placeholder="Please enter a last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                />

                <label className="auth-label">Email address</label>
                <input
                    className="auth-input"
                    placeholder="Please enter an email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />

                <label className="auth-label">Password</label>
                <input
                    className="auth-input"
                    placeholder="Please enter a password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                />

                <label className="auth-label">Confirm password</label>
                <input
                    className="auth-input"
                    placeholder="Please confirm your password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                />

                <div className="auth-row" style={{ justifyContent: "flex-start" }}>
                <label className="auth-remember">
                    <input
                    type="checkbox"
                    checked={accept}
                    onChange={(e) => setAccept(e.target.checked)}
                    />
                    I accept <span style={{ color: "#6d74ff" }}>Terms and Conditions</span>
                </label>
                </div>

                <div style={{ textAlign: "center" }}>
                <button className="auth-button" type="submit">
                    Sign Up
                </button>
                </div>
            </form>
            </div>

            <div className="auth-footer">
            Already have an account?{" "}
            <Link className="auth-link" to="/login">
                Sign In
            </Link>
            <div style={{ marginTop: 10 }}>
                <Link className="auth-link" to="/">
                Home
                </Link>
            </div>
            <div style={{ marginTop: 22, fontSize: 14, color: "#9CA3AF" }}>
                Developed by Ctrl + S, 2026
            </div>
            </div>
        </div>
        </div>
    );
}
