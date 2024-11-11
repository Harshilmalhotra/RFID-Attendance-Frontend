import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://rfid-attendance-backend.vercel.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add token to requests if it exists
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Function to log in as admin and save token to localStorage
export const loginAdmin = async (username, password) => {
    try {
        const response = await apiClient.post('/login', { username, password });
        const { token } = response.data;

        // Save the token in localStorage
        if (token) {
            localStorage.setItem('authToken', token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to fetch user data
export const fetchUsers = async () => {
    try {
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to insert a new user
export const insertUser = async (userData) => {
    try {
        const response = await apiClient.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to log attendance
export const logAttendance = async (rfid_id) => {
    try {
        const response = await apiClient.post('/attendance/logs', { rfid_id });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to fetch attendance logs by RFID
export const fetchAttendanceByRfid = async (rfid_id) => {
    try {
        const response = await apiClient.get(`/attendance/logs/${rfid_id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to fetch attendance logs by date
export const fetchAttendanceByDate = async (date) => {
    try {
        const response = await apiClient.get(`/attendance/logs/date/${date}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to fetch attendance statistics (e.g., daily or weekly summaries)
export const fetchAttendanceStats = async (dateRange) => {
    try {
        const response = await apiClient.get('/attendance/stats', { params: { dateRange } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to validate token on app load
export const validateToken = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return null;

        const response = await apiClient.get('/validateToken');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Function to log out the user
export const logoutAdmin = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    // You may also want to clear any user data or redirect to login page here
};


// Explicitly export loginAdmin as loginApi if this is intended for login
export { loginAdmin as loginApi };


export const fetchTerminalData = async (since) => {
    try {
        const response = await apiClient.get('/api/terminal', {
            params: { since }
        });
        return response.data; // Assuming response.data contains the new data entries
    } catch (error) {
        console.error("Error fetching terminal data:", error);
        throw error;
    }
};