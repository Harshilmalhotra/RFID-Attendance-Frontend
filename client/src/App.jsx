// src/App.jsx

import React from 'react';
import { AuthProvider } from './context/AuthContext';

import ErrorBoundary from './ErrorBoundary';
import Navbar from './components/Navbar'; // Import Navbar
import AppRoutes from './Routes'; // Import your routes

const App = () => {
    return (
        <AuthProvider>
            <ErrorBoundary>
                <Navbar /> {/* Add the Navbar here */}
                <AppRoutes />
            </ErrorBoundary>
        </AuthProvider>
    );
};

export default App;
