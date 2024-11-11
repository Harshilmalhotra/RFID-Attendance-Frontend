// src/pages/Terminal.jsx

import React, { useState, useEffect } from 'react';
import { fetchTerminalData } from '../api/attendanceApi';

const Terminal = () => {
    const [dataStream, setDataStream] = useState([]);
    const [startTime, setStartTime] = useState(new Date().toISOString());

    // Fetch new data entries only
    const fetchData = async () => {
        try {
            const newEntries = await fetchTerminalData(startTime);
            setDataStream((prevData) => [
                ...prevData,
                ...newEntries,
            ]);
        } catch (error) {
            console.error("Error fetching terminal data:", error);
        }
    };

    // Fetch data periodically (every 5 seconds for this example)
    useEffect(() => {
        // Fetch initial data on load
        fetchData();

        const interval = setInterval(fetchData, 5000); // Adjust interval as needed
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [startTime]); // Re-run when startTime changes

    // Inline styles
    const styles = {
        container: {
            backgroundColor: 'black',
            color: '#00FF00',
            fontFamily: "'Courier New', Courier, monospace",
            padding: '20px',
            minHeight: '100vh',
            textAlign: 'center',
        },
        output: {
            whiteSpace: 'pre',
            fontSize: '16px',
            lineHeight: '1.6',
            textAlign: 'left',
            margin: '0 auto',
            maxWidth: '800px',
        }
    };

    return (
        <div style={styles.container}>
            <h1>Data Stream Terminal</h1>
            <div style={styles.output}>
                <pre>
                    ┌───────┬──────────────────────────┬───────────────┐
                    │ Row   │ Timestamp               │ Data          │
                    ├───────┼──────────────────────────┼───────────────┤
                    {dataStream.map((entry, index) => (
                        <React.Fragment key={entry.id}>
                            │ {String(index + 1).padEnd(5)} │ {new Date(entry.timestamp).toLocaleString().padEnd(20)} │ {entry.data.padEnd(12)} │
                            <br />
                        </React.Fragment>
                    ))}
                    └───────┴──────────────────────────┴───────────────┘
                </pre>
            </div>
        </div>
    );
};

export default Terminal;
