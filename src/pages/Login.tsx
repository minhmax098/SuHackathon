import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./auth.css";

export default function Login() {
    const nav = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [err, setErr] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        try {
        await login(email, password);

        if (!remember) {
            const token = localStorage.getItem("token");
            if (token) {
            localStorage.removeItem("token");
            sessionStorage.setItem("token", token);
            }
        }

        nav("/dashboard");
        } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Login failed";
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
            <h2 className="auth-title">Sign In</h2>
            <p className="auth-subtitle">
                Enter your email address and password to <br />
                access Irrigator.
            </p>

            {err && <p className="auth-error">{err}</p>}

            <form className="auth-form" onSubmit={onSubmit}>
                <label className="auth-label">Email address</label>
                <input
                    className="auth-input"
                    placeholder="Please enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />

                <label className="auth-label">Password</label>
                <input
                    className="auth-input"
                    placeholder="Please enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />

                <div className="auth-row">
                <label className="auth-remember">
                    <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    />
                    Remember me
                </label>

                <a className="auth-link" href="#">
                    Forgot your password?
                </a>
                </div>

                <div style={{ textAlign: "center" }}>
                <button className="auth-button" type="submit">
                    Sign In
                </button>
                </div>
            </form>
            </div>

            <div className="auth-footer">
            Don't have an account? <Link className="auth-link" to="/register">Sign Up</Link>
            <div style={{ marginTop: 10 }}>
                <Link className="auth-link" to="/">Home</Link>
            </div>
            </div>
        </div>
        </div>
    );
}
