import { createStore } from 'vuex';
import api from './services/axiosConfig';

const store = createStore({
    state: {
        token: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: !!localStorage.getItem('accessToken'),
        tweets: [],
        users: [],
        isLoading: false,
        errorMessage: null,
        successMessage: null,
    },
    mutations: {
        setToken(state, token) {
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
            state.refreshToken = refreshToken;
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                localStorage.removeItem('refreshToken');
            }
        },
        setUser(state, user) {
            state.user = user;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        },
        clearAuth(state) {
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        setTweets(state, tweets) {
            state.tweets = tweets;
        },
        addTweet(state, tweet) {
            state.tweets.unshift(tweet);
        },
        setUsers(state, users) {
            state.users = users;
        },
        updateUserFollowingStatus(state, userId) {
            const user = state.users.find((user) => user.id === userId);
            if (user) {
                user.is_following = true;
            }
        },
        setLoading(state, isLoading) {
            state.isLoading = isLoading;
        },
        setErrorMessage(state, message) {
            state.errorMessage = message;
        },
        setSuccessMessage(state, message) {
            state.successMessage = message;
        },
        clearMessages(state) {
            state.errorMessage = null;
            state.successMessage = null;
        },
        updateUserBio(state, bio) {
            if (state.user) {
                state.user.bio = bio;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
        updateUserProfileImage(state, profileImageUrl) {
            if (state.user) {
                state.user.profile_image_url = profileImageUrl;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
    actions: {
        initializeStore({ commit }) {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const user = JSON.parse(localStorage.getItem('user'));

            if (accessToken) commit('setToken', accessToken);
            if (refreshToken) commit('setRefreshToken', refreshToken);
            if (user) commit('setUser', user);
        },
        async signUp({ commit }, userData) {
            commit('setLoading', true);
            commit('clearMessages');

            try {
                await api.post('/users/', userData);
                commit('setSuccessMessage', 'Cadastro realizado com sucesso!');
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Erro ao criar conta.';
                commit('setErrorMessage', errorMsg);
            } finally {
                commit('setLoading', false);
            }
        },
        async login({ commit }, credentials) {
            commit('setLoading', true);
            commit('clearMessages');

            try {
                const response = await api.post('/auth/login/', credentials);
                const { access, refresh, user } = response.data;

                commit('setToken', access);
                commit('setRefreshToken', refresh);
                commit('setUser', user);
                commit('setSuccessMessage', 'Login realizado com sucesso!');
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Credenciais inválidas ou erro no servidor.';
                commit('setErrorMessage', errorMsg);
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchUserProfile({ commit, state }) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearMessages');

            try {
                const response = await api.get('/users/me/');
                commit('setUser', response.data);
            } catch (error) {
                commit('setErrorMessage', 'Erro ao obter dados do usuário.');
                commit('clearAuth');
            } finally {
                commit('setLoading', false);
            }
        },
        async loadUsers({ commit }) {
            commit('setLoading', true);
            commit('clearMessages');

            try {
                const response = await api.get('/users/');
                commit('setUsers', response.data);
            } catch (error) {
                commit('setErrorMessage', 'Erro ao carregar a lista de usuários.');
                console.error('Erro ao carregar usuários:', error);
            } finally {
                commit('setLoading', false);
            }
        },
        async followUser({ commit }, userId) {
            try {
                const response = await api.post(`/follow/${userId}/follow_user/`);
                if (response.status === 200) {
                    commit('updateUserFollowingStatus', userId);
                    commit('setSuccessMessage', response.data.detail);
                }
            } catch (error) {
                commit('setErrorMessage', 'Erro ao seguir o usuário.');
            }
        },
        async updateBio({ commit, state }, bioData) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearMessages');

            try {
                await api.patch('/users/update_bio/', bioData);
                commit('updateUserBio', bioData.bio);
                commit('setSuccessMessage', 'Biografia atualizada com sucesso!');
            } catch (error) {
                commit('setErrorMessage', 'Erro ao atualizar biografia.');
            } finally {
                commit('setLoading', false);
            }
        },
        async updateProfileImage({ commit, state }, formData) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearMessages');

            try {
                const response = await api.patch('/users/update_profile_image/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const profileImageUrl = response.data.profile_image_url;
                commit('updateUserProfileImage', profileImageUrl);
                commit('setSuccessMessage', 'Imagem de perfil atualizada com sucesso!');
            } catch (error) {
                commit('setErrorMessage', 'Erro ao atualizar a imagem de perfil.');
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchTweets({ commit, state }) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearMessages');

            try {
                const response = await api.get('/tweets/');
                commit('setTweets', response.data);
            } catch (error) {
                commit('setErrorMessage', 'Erro ao carregar tweets.');
            } finally {
                commit('setLoading', false);
            }
        },
        async createTweet({ commit, state }, tweetData) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearMessages');

            try {
                const response = await api.post('/tweets/', tweetData);
                commit('addTweet', response.data);
                commit('setSuccessMessage', 'Tweet criado com sucesso!');
            } catch (error) {
                commit('setErrorMessage', 'Erro ao criar tweet.');
            } finally {
                commit('setLoading', false);
            }
        },
        async refreshToken({ commit, state }) {
            if (!state.refreshToken) {
                console.warn('[Aviso] Nenhum token de atualização encontrado.');
                return;
            }

            try {
                const response = await api.post('/auth/token/refresh/', { refresh: state.refreshToken });
                commit('setToken', response.data.access);
            } catch (error) {
                commit('setErrorMessage', 'Erro ao atualizar token.');
                commit('clearAuth');
            }
        },
        logout({ commit }) {
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
        getUsers: (state) => state.users,
    },
});

export default store;
