import axios from 'axios';

// Use a variável de ambiente para a URL da API, ou defina a URL do Render diretamente
const apiUrl =
    process.env.VUE_APP_API_URL || 'https://twitter-corujinha-web.onrender.com/api/';

const api = axios.create({
    baseURL: apiUrl, // Usar a URL pública do seu back-end no Render
    headers: {
        'Content-Type': 'application/json',
    },
});

// Adicionar o access_token nas requisições automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // Adiciona o token JWT
    }
    return config;
});

export default api;
