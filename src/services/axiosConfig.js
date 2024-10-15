import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL || 'https://twitter-corujinha-web.onrender.com';

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default api;
