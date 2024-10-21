import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,  // Permite o envio automático de cookies HttpOnly
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Acesso não autorizado');
            window.location.href = '/login';  // Redireciona para a página de login
        }
        return Promise.reject(error);
    }
);

export default api;