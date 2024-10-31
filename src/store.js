import { createStore } from 'vuex';
import api from './services/axiosConfig';

const store = createStore({
    state: {
        token: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: !!localStorage.getItem('accessToken'),
        tweets: [],
        isLoading: false,
        errorMessage: null,
        successMessage: null,
    },
    mutations: {
        setToken(state, token) {
            console.log('[Mutação] Armazenando token de acesso:', token);
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
            console.log('[Mutação] Armazenando token de atualização:', refreshToken);
            state.refreshToken = refreshToken;
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                localStorage.removeItem('refreshToken');
            }
        },
        setUser(state, user) {
            console.log('[Mutação] Armazenando dados do usuário:', user);
            state.user = user;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        },
        setTweets(state, tweets) {
            console.log('[Mutação] Armazenando tweets:', tweets);
            state.tweets = tweets;
        },
        addTweet(state, tweet) {
            console.log('[Mutação] Adicionando novo tweet:', tweet);
            state.tweets.unshift(tweet);
        },
        clearAuth(state) {
            console.log('[Mutação] Limpando autenticação.');
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        setLoading(state, isLoading) {
            console.log(`[Mutação] Alterando estado de carregamento para: ${isLoading}`);
            state.isLoading = isLoading;
        },
        setErrorMessage(state, message) {
            console.log('[Mutação] Definindo mensagem de erro:', message);
            state.errorMessage = message;
        },
        setSuccessMessage(state, message) {
            console.log('[Mutação] Definindo mensagem de sucesso:', message);
            state.successMessage = message;
        },
    },
    actions: {
        initializeStore({ commit }) {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const user = JSON.parse(localStorage.getItem('user'));

            console.log('[Ação] Inicializando store com tokens e usuário armazenado.');
            if (accessToken) commit('setToken', accessToken);
            if (refreshToken) commit('setRefreshToken', refreshToken);
            if (user) commit('setUser', user);
        },
        async login({ commit, dispatch }, credentials) {
            commit('setLoading', true);
            commit('setErrorMessage', null);

            console.log('[Ação] Tentando login com credenciais:', credentials);

            try {
                const response = await api.post('/token/', credentials);
                const { access, refresh } = response.data;

                if (!access || !refresh) {
                    console.error('[Erro] Resposta de token inválida:', response.data);
                    throw new Error('Resposta de token inválida.');
                }

                commit('setToken', access);
                commit('setRefreshToken', refresh);

                await dispatch('fetchUserProfile');

                commit('setSuccessMessage', 'Login realizado com sucesso!');
                console.log('[Ação] Login realizado com sucesso.');
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Credenciais inválidas ou erro no servidor.';
                console.error('[Erro durante o login]:', errorMsg);
                commit('setErrorMessage', errorMsg);
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchUserProfile({ commit }) {
            commit('setLoading', true);
            console.log('[Ação] Buscando dados do perfil do usuário autenticado.');

            try {
                const response = await api.get('/users/me/');
                if (response?.data) {
                    commit('setUser', response.data);
                } else {
                    console.error('[Erro] Resposta inválida ao obter perfil do usuário.');
                    throw new Error('Resposta inválida do servidor.');
                }
            } catch (error) {
                console.error('[Erro ao obter perfil do usuário]:', error);
                commit('setErrorMessage', 'Erro ao obter dados do usuário.');
                commit('clearAuth');
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchTweets({ commit }) {
            commit('setLoading', true);
            console.log('[Ação] Carregando tweets do servidor.');

            try {
                const response = await api.get('/tweets/');
                commit('setTweets', response.data);
            } catch (error) {
                console.error('[Erro ao carregar tweets]:', error);
                commit('setErrorMessage', 'Erro ao carregar tweets.');
            } finally {
                commit('setLoading', false);
            }
        },
        async createTweet({ commit }, tweetData) {
            commit('setLoading', true);
            console.log('[Ação] Criando novo tweet:', tweetData);

            try {
                const response = await api.post('/tweets/', tweetData);
                commit('addTweet', response.data);
                commit('setSuccessMessage', 'Tweet criado com sucesso!');
            } catch (error) {
                console.error('[Erro ao criar tweet]:', error);
                commit('setErrorMessage', 'Erro ao criar tweet.');
            } finally {
                commit('setLoading', false);
            }
        },
        async refreshToken({ commit, state }) {
            try {
                const response = await api.post('/token/refresh/', { refresh: state.refreshToken });
                commit('setToken', response.data.access);
            } catch (error) {
                console.error('[Erro ao renovar o token]:', error);
                commit('setErrorMessage', 'Erro ao atualizar token.');
                commit('clearAuth');
            }
        },
        logout({ commit }) {
            console.log('[Ação] Realizando logout.');
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
        getTweets: (state) => state.tweets,
    },
});

export default store;
