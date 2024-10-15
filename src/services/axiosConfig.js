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

// Interceptor para adicionar o CSRF Token em cada requisição
api.interceptors.request.use((config) => {
    const token = getCookie('csrftoken');  // Função para pegar o CSRF Token do cookie
    if (token) {
        config.headers['X-CSRFToken'] = token;  // Adiciona o CSRF Token ao cabeçalho
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Função para obter o valor do cookie
function getCookie(name) {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return cookieValue ? cookieValue.split('=')[1] : null;
}

export default api;
