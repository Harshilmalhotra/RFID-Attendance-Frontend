// AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, validateToken, logoutAdmin } from "../api/attendanceApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const userData = await validateToken();
                setUser(userData);
            } catch {
                setUser(null);
            }
        };

        verifyUser();
    }, []);

    const login = async (username, password) => {
        const userData = await loginAdmin(username, password);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        logoutAdmin();
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
