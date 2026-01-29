import { useAuth } from "../context/useAuth";

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: 24 }}>
        <h2>
            Dashboard
        </h2>
        <p>
            Welcome: {user?.name} ({user?.email})
        </p>
        <button onClick={logout}>
            Logout
        </button>
        </div>
    );
}
