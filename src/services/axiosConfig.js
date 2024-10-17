import axios from 'axios';
import Cookies from 'js-cookie'; // Importa biblioteca para gerenciamento de cookies

const apiUrl = process.env.VUE_APP_API_URL || 'https://twitter-corujinha-web.onrender.com';

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': Cookies.get('csrftoken'), // Obtém o token CSRF
    },
    withCredentials: true, // Permite o envio de cookies com as requisições
});

// Interceptor para redirecionar em caso de erro de autenticação
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login'; // Redireciona para a página de login em caso de erro
        }
        return Promise.reject(error);
    }
);

export default api;
