// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={navbarStyle}>
            <ul style={navListStyle}>
                <li style={navItemStyle}>
                    <Link style={navLinkStyle} to="/">Home</Link>
                </li>
                <li style={navItemStyle}>
                    <Link style={navLinkStyle} to="/view-attendance">Attendance</Link>
                </li>
                <li style={navItemStyle}>
                    <Link style={navLinkStyle} to="/members">Member's Details</Link>
                </li>
            </ul>
        </nav>
    );
};

// Navbar styles
const navbarStyle = {
    backgroundColor: '#4CAF50', // Green background
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const navListStyle = {
    listStyleType: 'none',
    display: 'flex',
    gap: '15px',
};

const navItemStyle = {
    margin: '0',
};

const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
};

export default Navbar;
