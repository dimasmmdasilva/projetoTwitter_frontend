import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/api', // Ajuste para apontar para o Nginx
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adicionar o access_token nas requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
