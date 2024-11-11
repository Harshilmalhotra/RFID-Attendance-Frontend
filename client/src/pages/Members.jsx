// src/pages/Members.jsx

import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api/attendanceApi'; // Adjust the import path as needed

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMembers = async () => {
            try {
                const data = await fetchUsers();
                setMembers(data); // Set fetched data into state
            } catch (error) {
                setError(error); // Handle any errors
            } finally {
                setLoading(false); // Loading complete
            }
        };

        getMembers();
    }, []);

    if (loading) {
        return <div style={loadingStyle}>Loading...</div>;
    }

    if (error) {
        return <div style={errorStyle}>Error: {error}</div>;
    }

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Member's Details</h1>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registration Number</th>
                        <th>Role</th>
                        <th>RFID ID</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.rfid_id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.regnumber}</td>
                            <td>{member.role}</td>
                            <td>{member.rfid_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={graphicsContainerStyle}>
                {/* Add any graphics or images here */}
                <img src="https://via.placeholder.com/300" alt="Member Graphics" style={graphicStyle} />
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    padding: '20px',
};

const titleStyle = {
    color: '#4CAF50',
    marginBottom: '20px',
};

const loadingStyle = {
    fontSize: '20px',
    textAlign: 'center',
};

const errorStyle = {
    color: 'red',
    textAlign: 'center',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
};

const graphicsContainerStyle = {
    marginTop: '20px',
    textAlign: 'center',
};

const graphicStyle = {
    width: '300px',
    height: 'auto',
};

export default Members;
