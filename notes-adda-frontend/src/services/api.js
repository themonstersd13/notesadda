import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust if backend port differs

const api = axios.create({
    baseURL: API_URL,
});

// Add Token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;