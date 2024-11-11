// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your Auth context

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth(); // Get the user state from Auth context

    if (!user) {
        // If there is no user, redirect to login
        return <Navigate to="/login" replace />;
    }

    return children; // Render children if user is authenticated
};

export default ProtectedRoute;
