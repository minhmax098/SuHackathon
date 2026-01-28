import React, { useEffect, useState } from "react";
import { api } from "../lib/api"; // (hoặc ../lib/api nếu bạn dùng file đó)
import { AuthCtx } from "./auth.context";
import type { User } from "./auth.types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshMe() {
        try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        } catch {
        setUser(null);
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        refreshMe();
    }, []);

    async function login(email: string, password: string) {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }

    async function register(name: string, email: string, password: string) {
        const { data } = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
        {children}
        </AuthCtx.Provider>
    );
}
