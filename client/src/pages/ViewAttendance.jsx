import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'; // Import the date picker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for the date picker
import { fetchAttendanceByDate } from '../api/attendanceApi.js';

const ViewAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
    const [isPickerVisible, setIsPickerVisible] = useState(false); // State to control visibility of date picker

    const getAttendanceData = async () => {
        try {
            const formattedDate = selectedDate.toISOString().slice(0, 10);
            const data = await fetchAttendanceByDate(formattedDate);
            setAttendanceData(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    useEffect(() => {
        getAttendanceData();
    }, [selectedDate]);

    useEffect(() => {
        const interval = setInterval(() => {
            getAttendanceData();
        }, 3000); // Refresh every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [selectedDate]);

    const togglePicker = () => {
        setIsPickerVisible(!isPickerVisible); // Toggle date picker visibility
    };

    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
        },
        th: {
            border: '1px solid #dddddd',
            textAlign: 'left',
            padding: '12px',
            backgroundColor: '#f2f2f2',
        },
        td: {
            border: '1px solid #dddddd',
            textAlign: 'left',
            padding: '12px',
        },
        statusIn: {
            color: 'green',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        statusOut: {
            color: 'red',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: selectedDate.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            position: 'relative',
            zIndex: 10,
        },
        datePickerContainer: {
            position: 'absolute',
            zIndex: 1000,
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
        },
        datePicker: {
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
        }
    };

    return (
        <div>
            <h1>Attendance Logs for {selectedDate.toLocaleDateString()}</h1>
            <button style={styles.button} onClick={togglePicker}>
                {selectedDate.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) ? 'Today' : selectedDate.toLocaleDateString()}
            </button>
            {isPickerVisible && (
                <div style={styles.datePickerContainer}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setIsPickerVisible(false); // Hide date picker on selection
                        }}
                        dateFormat="yyyy/MM/dd"
                        style={styles.datePicker}
                    />
                </div>
            )}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>RFID ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Timestamp</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((entry) => (
                        <tr key={entry.rfid_id} style={{ cursor: 'pointer' }}>
                            <td style={styles.td}>{entry.rfid_id}</td>
                            <td style={styles.td}>{entry.UserData?.name || 'Unknown'}</td>
                            <td style={styles.td}>{new Date(entry.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                            <td style={entry.status ? styles.statusIn : styles.statusOut}>
                                {entry.status ? 'In' : 'Out'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAttendance;
