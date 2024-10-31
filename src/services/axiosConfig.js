import axios from 'axios';
import store from '../store';
import router from '../router/index';

// Configuração inicial do Axios
const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Interceptor de requisição para adicionar o token de autorização
api.interceptors.request.use(
    (config) => {
        const token = store.state.token;
        if (token) {
            console.log('[Axios] Adicionando token de autorização ao cabeçalho.');
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('[Axios] Erro no interceptor de requisição:', error);
        return Promise.reject(error);
    }
);

// Interceptor de resposta para lidar com erros de autenticação e renovação de token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { response } = error;

        // Verifica se houve erro de autorização (401) e tenta renovar o token
        if (response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                console.log('[Axios] Tentando renovar o token de acesso...');
                await store.dispatch('refreshToken');
                console.log('[Axios] Token renovado com sucesso.');
                return api(originalRequest); // Reenvia a requisição original após a renovação do token
            } catch (refreshError) {
                console.error('[Axios] Erro ao renovar o token:', refreshError);
                store.dispatch('logout');  // Realiza logout seguro
                router.push('/login');
                return Promise.reject(refreshError);
            }
        }

        // Define mensagem de erro no estado Vuex e retorna erro
        const errorMsg = response?.data?.detail || 'Erro de autenticação.';
        store.commit('setErrorMessage', errorMsg);
        console.error('[Axios] Erro na resposta:', errorMsg);
        return Promise.reject(error);
    }
);

export default api;
