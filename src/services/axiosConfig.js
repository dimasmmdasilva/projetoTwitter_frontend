import axios from 'axios';
import store from '../store';
import router from '../router/index';

// Configuração inicial do Axios
const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'https://projetofinal-back-end.onrender.com/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

// Interceptor de requisição para adicionar o token de autorização em todas as requisições
api.interceptors.request.use(
    (config) => {
        const token = store.state.token;
        
        if (token) {
            console.log('[Axios] Adicionando token de autorização ao cabeçalho.');
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Garante que 'Content-Type' seja configurado automaticamente para `multipart/form-data` se for um FormData
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type']; // Permite que o Axios defina o tipo correto
        } else {
            config.headers['Content-Type'] = 'application/json';
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

        // Verifica se houve erro de autorização (401) no endpoint de renovação de token
        if (response?.status === 401 && originalRequest.url.includes('/auth/token/refresh/')) {
            console.warn('[Axios] Falha na renovação do token, realizando logout.');
            await store.dispatch('logout');  // Executa o logout para limpar os dados de autenticação
            router.push('/login');     // Redireciona o usuário para a página de login
            return Promise.reject(error);
        }

        // Verifica se o erro é 401 e tenta renovar o token se ainda não foi tentado
        if (response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // Marca a requisição para evitar loops
            try {
                console.log('[Axios] Tentando renovar o token de acesso...');
                await store.dispatch('refreshToken');  // Chama a ação `refreshToken` para renovar o token
                console.log('[Axios] Token renovado com sucesso.');
                
                // Atualiza o cabeçalho da requisição original com o novo token
                originalRequest.headers['Authorization'] = `Bearer ${store.state.token}`;
                
                return api(originalRequest); // Reenvia a requisição original com o token atualizado
            } catch (refreshError) {
                console.error('[Axios] Erro ao renovar o token:', refreshError);
                await store.dispatch('logout');  // Executa o logout para limpar os dados de autenticação
                router.push('/login');     // Redireciona o usuário para a página de login
                return Promise.reject(refreshError);
            }
        }

        // Define mensagem de erro no estado Vuex se houver erro de autenticação e retorna erro
        const errorMsg = response?.data?.detail || 'Erro de autenticação.';
        store.commit('setErrorMessage', errorMsg);
        console.error('[Axios] Erro na resposta:', errorMsg);
        return Promise.reject(error);
    }
);

export default api;
