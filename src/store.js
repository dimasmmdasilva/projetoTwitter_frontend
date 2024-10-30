import { createStore } from 'vuex';
import api from './services/axiosConfig';
import jwtDecode from 'jwt-decode';

const store = createStore({
    state: {
        token: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        isAuthenticated: !!localStorage.getItem('accessToken'),
        user: JSON.parse(localStorage.getItem('user')) || null,
        isLoading: false,
        errorMessage: null,
        successMessage: null,
    },
    mutations: {
        setToken(state, token) {
            console.log('Mutação: Armazenando token de acesso.', token);
            state.token = token;
            state.isAuthenticated = !!token;
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('accessToken', token);
            } else {
                delete api.defaults.headers.common['Authorization'];
                localStorage.removeItem('accessToken');
            }
        },
        setRefreshToken(state, refreshToken) {
            console.log('Mutação: Armazenando token de atualização.', refreshToken);
            state.refreshToken = refreshToken;
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                localStorage.removeItem('refreshToken');
            }
        },
        setUser(state, user) {
            console.log('Mutação: Armazenando dados do usuário.', user);
            state.user = user;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        },
        clearAuth(state) {
            console.log('Mutação: Limpando autenticação.');
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        setLoading(state, isLoading) {
            console.log(`Mutação: Alterando estado de carregamento para ${isLoading}`);
            state.isLoading = isLoading;
        },
        setErrorMessage(state, message) {
            console.log('Mutação: Definindo mensagem de erro.', message);
            state.errorMessage = message;
        },
        setSuccessMessage(state, message) {
            console.log('Mutação: Definindo mensagem de sucesso.', message);
            state.successMessage = message;
        },
    },
    actions: {
        initializeStore({ commit }) {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const user = JSON.parse(localStorage.getItem('user'));

            console.log('Ação: Inicializando store com tokens e usuário armazenado.');
            if (accessToken) {
                commit('setToken', accessToken);
            }
            if (refreshToken) {
                commit('setRefreshToken', refreshToken);
            }
            if (user) {
                commit('setUser', user);
            }
        },
        async login({ commit, dispatch }, credentials) {
            commit('setLoading', true);
            commit('setErrorMessage', null);

            console.log('Ação: Tentando login com credenciais.', credentials);

            try {
                // Envio das credenciais para o servidor
                const response = await api.post('/token/', credentials);
                const { access, refresh } = response.data;

                if (!access || !refresh) {
                    console.error('Erro: Resposta de token inválida do servidor.', response.data);
                    throw new Error('Resposta de token inválida.');
                }

                console.log('Ação: Tokens recebidos com sucesso.', { access, refresh });

                // Salva os tokens no estado e no localStorage
                commit('setToken', access);
                commit('setRefreshToken', refresh);

                // Decodifica o token JWT para obter o ID do usuário
                const decodedToken = jwtDecode(access);
                const userId = decodedToken?.user_id;

                if (userId) {
                    console.log('Ação: Decodificação do token bem-sucedida. ID do usuário:', userId);
                    await dispatch('fetchUser', userId);
                } else {
                    console.error('Erro: Token inválido.', decodedToken);
                    throw new Error('Token inválido.');
                }

                commit('setSuccessMessage', 'Login realizado com sucesso!');
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Credenciais inválidas ou erro no servidor.';
                console.error('Erro durante o login:', errorMsg);
                commit('setErrorMessage', errorMsg);
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async signUp({ commit }, credentials) {
            commit('setLoading', true);
            commit('setErrorMessage', null);

            console.log('Ação: Tentando cadastro de novo usuário.', credentials);

            try {
                await api.post('/users/', credentials);
                commit('setSuccessMessage', 'Cadastro realizado com sucesso!');

                // Adiciona um atraso de 5 segundos antes de redirecionar para login
                setTimeout(() => {
                    window.location.href = '/login'; // Redireciona para a página de login
                }, 5000);
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Erro no cadastro.';
                console.error('Erro durante o cadastro:', errorMsg);
                commit('setErrorMessage', errorMsg);

                // NÃO redireciona para a página de login em caso de erro
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchUser({ commit }, userId) {
            commit('setLoading', true);
            commit('setErrorMessage', null);

            console.log('Ação: Buscando dados do usuário com ID:', userId);

            try {
                const response = await api.get(`/users/${userId}/`);
                if (response && response.data) {
                    console.log('Ação: Dados do usuário recebidos com sucesso.', response.data);
                    commit('setUser', response.data);
                } else {
                    console.error('Erro: Resposta inválida do servidor ao buscar usuário.');
                    throw new Error('Resposta inválida do servidor.');
                }
            } catch (error) {
                console.error('Erro ao obter dados do usuário:', error);
                commit('clearAuth');
                commit('setErrorMessage', 'Erro ao obter dados do usuário.');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async logout({ commit }) {
            console.log('Ação: Realizando logout.');
            commit('clearAuth');
            commit('setSuccessMessage', 'Logout realizado com sucesso!');
        },
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        isLoading: (state) => state.isLoading,
        errorMessage: (state) => state.errorMessage,
        successMessage: (state) => state.successMessage,
        getUser: (state) => state.user,
    },
});

export default store;
