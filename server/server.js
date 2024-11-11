// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Define a basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Attendance API!');
});

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


module.exports = app;

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes for user-related endpoints
app.get('/api/users', async (req, res) => {
    const { data, error } = await supabase
        .from('UserData')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
});

app.post('/api/users', async (req, res) => {
    const { name, email, regnumber, role, rfid_id } = req.body;
    const { data, error } = await supabase
        .from('UserData')
        .insert([{ name, email, regnumber, role, rfid_id }]);

    if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
});

app.get('/api/users/:rfid_id', async (req, res) => {
    const { rfid_id } = req.params;
    const { data, error } = await supabase
        .from('UserData')
        .select('*')
        .eq('rfid_id', rfid_id);

    if (error) {
        console.error('Error fetching data by RFID:', error);
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
});


const moment = require('moment-timezone');

// Attendance logging route
app.post('/api/attendance/logs', async (req, res) => {
    const { rfid_id } = req.body;

    
    const istTimestamp = moment.tz('Asia/Kolkata').toISOString();

    const { data: lastRecord, error: lastError } = await supabase
        .from('AttendanceData')
        .select('status')
        .eq('rfid_id', rfid_id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

    if (lastError && lastError.code !== 'PGRST116') {
        console.error('Error fetching last record:', lastError);
        return res.status(500).json({ error: lastError.message });
    }

    const nextStatus = lastRecord ? !lastRecord.status : true;

    const { data, error } = await supabase
        .from('AttendanceData')
        .insert([{ rfid_id, status: nextStatus, timestamp: istTimestamp }]); // Insert IST timestamp

    if (error) {
        console.error('Error logging attendance:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: `User has ${nextStatus ? 'checked in' : 'checked out'}`, data });
});


app.get('/api/attendance/logs/:rfid_id', async (req, res) => {
    const { rfid_id } = req.params;
    const { data, error } = await supabase
        .from('AttendanceData')
        .select('timestamp, status')
        .eq('rfid_id', rfid_id)
        .order('timestamp', { ascending: true });

    if (error) {
        console.error('Error fetching attendance logs:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});

// Route to get attendance logs by date
app.get('/api/attendance/logs/date/:date', async (req, res) => {
    const { date } = req.params;
    const startDate = `${date}T00:00:00.000Z`;
    const endDate = `${date}T23:59:59.999Z`;

    const { data, error } = await supabase
        .from('AttendanceData')
        .select('rfid_id, timestamp, status, UserData(name)')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

    if (error) {
        console.error('Error fetching attendance by date:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data: admin, error } = await supabase
            .from('AdminUser')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !admin) {
            console.error('Authentication failed:', error);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            isAuthenticated: true,
            username: admin.username,
            name: admin.name,
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});




// Check-in/Check-out Route
app.post('/api/attendance/mark', async (req, res) => {
    const { rfid_id } = req.body;

    try {
        // Fetch the last attendance record
        const { data: lastRecord, error: lastError } = await supabase
            .from('AttendanceData')
            .select('status')
            .eq('rfid_id', rfid_id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        if (lastError && lastError.code !== 'PGRST116') {
            console.error('Error fetching last record:', lastError);
            return res.status(500).json({ error: lastError.message });
        }

        // Determine next status (check-in or check-out)
        const nextStatus = lastRecord ? !lastRecord.status : true;

        // Log attendance
        const { data, error } = await supabase
            .from('AttendanceData')
            .insert([{ rfid_id, status: nextStatus }]);

        if (error) {
            console.error('Error logging attendance:', error);
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json({ message: `User has ${nextStatus ? 'checked in' : 'checked out'}`, data });
    } catch (err) {
        console.error('Error processing attendance:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



app.post('/api/validateToken', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from header

    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ isAuthenticated: false });
        }
        // If valid, send user data back
        res.json({ isAuthenticated: true, user: decoded.user });
    });
});


app.post('/api/terminal', async (req, res) => {
    const { data } = req.body;

    // Validate that 'data' is provided
    if (!data) {
        return res.status(400).json({ error: 'Data is required' });
    }

    try {
     
        const { data: result, error } = await supabase
            .from('Terminal')
            .insert([{ data }]);

        
        if (error) {
            console.error('Error inserting data:', error);
            return res.status(500).json({ error: error.message });
        }

     
        res.status(201).json(result);
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Unexpected server error' });
    }
});




app.get('/api/terminal', async (req, res) => {
    const { since } = req.query;
    try {
        const { data, error } = await supabase
            .from('Terminal')
            .select('id, timestamp, data')
            .gt('timestamp', since);

        if (error) {
            throw error;
        }
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching terminal data:', error);
        res.status(500).json({ error: error.message });
    }
});
