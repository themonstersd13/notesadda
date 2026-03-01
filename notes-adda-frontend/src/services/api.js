import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; 

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

// Handle expired/invalid tokens – force re-login on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            !/\/auth\/(login|register)$/.test(error.config.url)
        ) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.replace('/');
        }
        return Promise.reject(error);
    }
);

export default api;