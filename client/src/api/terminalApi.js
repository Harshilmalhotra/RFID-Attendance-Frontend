// src/api/terminalApi.js

import apiClient from './apiClient';

export const fetchTerminalData = async (afterTimestamp) => {
    try {
        const response = await apiClient.get('/terminal', {
            params: { after: afterTimestamp }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching terminal data:', error);
        throw error;
    }
};
