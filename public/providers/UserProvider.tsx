"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../lib/types";

interface AuthContextProps {
    user: User | null;
    token: string | "";
    loading: boolean;
    login: (data: { user: User; token: string }) => void;
    logout: () => void;
}

const UserContext = createContext<AuthContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | "">("");
    const [loading, setLoading] = useState(true);

    // Load từ localStorage khi refresh
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    // Hàm login
    const login = (data: { user: User; token: string  }) => {
        setUser(data.user);
        setToken(data.token);

        document.cookie = `role=${data.user.role}; path=/;`;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
    };

    // Hàm logout
    const logout = () => {
        setUser(null);
        setToken("");
        
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "role=; path=/; max-age=0"; 
    };

    return (
        <UserContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Helper hook
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used inside <UserProvider>");
    }
    return context;
};
