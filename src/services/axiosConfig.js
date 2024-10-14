import axios from 'axios';

// Define a URL da API usando a variável de ambiente ou a URL pública no Render
const apiUrl = process.env.VUE_APP_API_URL || 'https://twitter-corujinha-web.onrender.com/api/';

// Cria uma instância do Axios com a baseURL
const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de requisições: Adiciona o access_token ao cabeçalho das requisições, se disponível
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // Adiciona o token JWT ao cabeçalho
    }
    return config;
}, (error) => {
    // Se houver algum erro ao configurar a requisição, retorna a Promise rejeitada
    return Promise.reject(error);
});

// Interceptor de respostas: Tratamento automático de erros de autenticação
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Caso o erro seja 401 (não autorizado), redireciona para a página de login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        window.location.href = '/login';  // Redireciona para a página de login
    }
    return Promise.reject(error);  // Retorna a Promise rejeitada para permitir tratamento adicional
});

export default api;
