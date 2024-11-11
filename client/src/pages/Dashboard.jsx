// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAttendanceByDate } from '../api/attendanceApi'; // Adjust the import path as needed

const Dashboard = () => {
    const [checkedInNames, setCheckedInNames] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const navigate = useNavigate();

    // Fetch checked-in names by date
    const fetchCheckedInNames = async (selectedDate) => {
        try {
            const data = await fetchAttendanceByDate(selectedDate);
            
            // Filter out checked-out users and map to names
            const checkedInUsers = data
                .filter(log => log.status) // Only keep checked-in entries
                .map(log => log.name); // Extract names of checked-in users

            setCheckedInNames([...new Set(checkedInUsers)]); // Ensure no duplicates
        } catch (error) {
            console.error('Error fetching checked-in names:', error);
        }
    };

    useEffect(() => {
        fetchCheckedInNames(date);

        // Update current time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [date]); // Fetch attendance when date changes

    // Handle date change
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    // Navigate to View Attendance
    const handleViewAttendance = () => {
        navigate('/view-attendance'); // Modify this route as needed
    };

    return (
        <div style={styles.container}>
            <h1>Dashboard</h1>
            <div style={styles.box}>
                <h2>People Currently in Lab: {checkedInNames.length}</h2>
                <p>Current Date & Time: {currentTime.toLocaleString()}</p>
                <input 
                    type="date" 
                    value={date} 
                    onChange={handleDateChange} 
                    style={styles.dateInput}
                />
            </div>
            <button style={styles.button} onClick={handleViewAttendance}>
                View Attendance
            </button>
            <div style={styles.attendanceList}>
                <h3>Checked-In Users</h3>
                <ul>
                    {checkedInNames.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto',
    },
    box: {
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        margin: '10px 0',
    },
    dateInput: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '10px',
        marginBottom: '10px',
    },
    attendanceList: {
        marginTop: '20px',
        textAlign: 'left',
    },
};

export default Dashboard;
