import { createStore } from 'vuex';
import api from './services/axiosConfig';
import jwtDecode from 'jwt-decode';

const store = createStore({
    state: {
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        errorMessage: null,
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            state.isAuthenticated = !!token;
            api.defaults.headers.common['Authorization'] = token
                ? `Bearer ${token}`
                : '';
        },
        setRefreshToken(state, refreshToken) {
            state.refreshToken = refreshToken;
        },
        clearAuth(state) {
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;
            state.errorMessage = null;
            delete api.defaults.headers.common['Authorization'];
        },
        setUser(state, user) {
            state.user = user;
        },
        setLoading(state, isLoading) {
            state.isLoading = isLoading;
        },
        setErrorMessage(state, message) {
            state.errorMessage = message;
        },
    },
    actions: {
        async login({ commit }, credentials) {
            commit('setLoading', true);
            commit('setErrorMessage', null);

            try {
                const response = await api.post('/api/token/', credentials);
                const { access, refresh } = response.data;

                if (!access || !refresh) {
                    throw new Error('Resposta de token inválida.');
                }

                commit('setToken', access);
                commit('setRefreshToken', refresh);

                try {
                    const decodedToken = jwtDecode(access);
                    if (decodedToken?.user_id) {
                        await this.dispatch('fetchUser');
                    } else {
                        throw new Error('Token inválido.');
                    }
                } catch (decodeError) {
                    commit('setErrorMessage', 'Falha ao decodificar o token.');
                    throw decodeError;
                }
            } catch (error) {
                commit(
                    'setErrorMessage',
                    'Credenciais inválidas ou erro no servidor.',
                );
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async signUp({ commit }, credentials) {
            commit('setLoading', true);
            commit('setErrorMessage', null);

            try {
                const response = await api.post('/api/users/', credentials);
                return response;
            } catch (error) {
                const errorMsg =
                    error.response?.data?.detail || 'Erro no cadastro.';
                commit('setErrorMessage', errorMsg);
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchUser({ commit }) {
            commit('setLoading', true);
            try {
                const response = await api.get('/api/users/me/');
                if (response && response.data) {
                    commit('setUser', response.data);
                } else {
                    throw new Error('Resposta inválida do servidor.');
                }
            } catch (error) {
                commit('clearAuth');
                commit('setErrorMessage', 'Erro ao obter dados do usuário.');
                throw error;
            } finally {
                commit('setLoading', false);
            }
        },
        async refreshToken({ state, commit }) {
            try {
                const response = await api.post('/api/token/refresh/', {
                    refresh: state.refreshToken,
                });
                const { access } = response.data;
                commit('setToken', access);
                return access;
            } catch (error) {
                commit('clearAuth');
                throw error;
            }
        },
        logout({ commit }) {
            commit('clearAuth');
        },
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        isLoading: (state) => state.isLoading,
        errorMessage: (state) => state.errorMessage,
        getUser: (state) => state.user,
    },
});

export default store;
