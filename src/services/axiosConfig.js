import axios from 'axios';
import Cookies from 'js-cookie'; // Importando a biblioteca para gerenciar cookies

const apiUrl = process.env.VUE_APP_API_URL || 'https://twitter-corujinha-web.onrender.com';

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': Cookies.get('csrftoken'), // Obtém o CSRF token do cookie
    },
    withCredentials: true, // Permite o envio de cookies com as requisições
});

// Interceptor para verificar a resposta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login'; // Redireciona para a página de login em caso de não autorizado
        }
        return Promise.reject(error);
    }
);

export default api;
