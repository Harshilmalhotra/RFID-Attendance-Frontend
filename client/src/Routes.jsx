// src/routes.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ViewAttendance from './pages/ViewAttendance';
import Members from './pages/Members'; // Import the new Members page
import ProtectedRoute from './components/ProtectedRoute';

import Terminal from './pages/Terminal';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/view-attendance"
                element={
                    <ProtectedRoute>
                        <ViewAttendance />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/members"
                element={
                    <ProtectedRoute>
                        <Members />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/terminal" element={<Terminal />} />
            {/* Add more routes as needed */}
        </Routes>
    );
};

export default AppRoutes;
