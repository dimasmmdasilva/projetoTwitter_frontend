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
        notificationMessage: null, // Mensagem de notificação
        notificationType: 'success', // Tipo de notificação ('success' ou 'error')
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
        removeTweet(state, tweetId) {
            state.tweets = state.tweets.filter(tweet => tweet.id !== tweetId);
        },
        setUsers(state, users) {
            state.users = users;
        },
        updateUserFollowingStatus(state, userId) {
            const user = state.users.find(user => user.id === userId);
            if (user) {
                user.is_following = true;
            }
        },
        setLoading(state, isLoading) {
            state.isLoading = isLoading;
        },
        setNotification(state, { message, type = 'success' }) {
            state.notificationMessage = message;
            state.notificationType = type;
            // Limpar automaticamente a notificação após 3 segundos
            setTimeout(() => {
                state.notificationMessage = null;
                state.notificationType = 'success';
            }, 3000);
        },
        clearNotification(state) {
            state.notificationMessage = null;
            state.notificationType = 'success';
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
            commit('clearNotification');

            try {
                await api.post('/users/', userData);
                commit('setNotification', { message: 'Cadastro realizado com sucesso!', type: 'success' });
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Erro ao criar conta.';
                commit('setNotification', { message: errorMsg, type: 'error' });
            } finally {
                commit('setLoading', false);
            }
        },
        async login({ commit, dispatch }, credentials) {
            commit('setLoading', true);
            commit('clearNotification');

            try {
                const response = await api.post('/auth/login/', credentials);
                const { access, refresh, user } = response.data;

                commit('setToken', access);
                commit('setRefreshToken', refresh);
                commit('setUser', user);
                commit('setNotification', { message: 'Login realizado com sucesso!', type: 'success' });

                await dispatch('loadUsers');
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Credenciais inválidas ou erro no servidor.';
                commit('setNotification', { message: errorMsg, type: 'error' });
            } finally {
                commit('setLoading', false);
            }
        },
        async fetchUserProfile({ commit, state }) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearNotification');

            try {
                const response = await api.get('/users/me/');
                commit('setUser', response.data);
            } catch (error) {
                commit('setNotification', { message: 'Erro ao obter dados do usuário.', type: 'error' });
                commit('clearAuth');
            } finally {
                commit('setLoading', false);
            }
        },
        async loadUsers({ commit, state }) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearNotification');

            try {
                const response = await api.get('/users/');
                commit('setUsers', response.data);
            } catch (error) {
                commit('setNotification', { message: 'Erro ao carregar a lista de usuários.', type: 'error' });
            } finally {
                commit('setLoading', false);
            }
        },
        async followUser({ commit }, userId) {
            try {
                const response = await api.post(`/follows/${userId}/follow_user/`);
                if (response.status === 200) {
                    commit('updateUserFollowingStatus', userId);
                    commit('setNotification', { message: response.data.detail, type: 'success' });
                }
            } catch (error) {
                commit('setNotification', { message: 'Erro ao seguir o usuário.', type: 'error' });
            }
        },
        async unfollowUser({ commit }, userId) {
            try {
                const response = await api.post(`/follows/${userId}/unfollow_user/`);
                if (response.status === 200) {
                    commit('updateUserFollowingStatus', { userId, isFollowing: false });
                    commit('setNotification', { message: response.data.detail, type: 'success' });
                }
            } catch (error) {
                commit('setNotification', { message: 'Erro ao deixar de seguir o usuário.', type: 'error' });
            }
        },
        async updateBio({ commit, state }, bioData) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearNotification');

            try {
                await api.patch('/users/update_bio/', bioData);
                commit('updateUserBio', bioData.bio);
                commit('setNotification', { message: 'Biografia atualizada com sucesso!', type: 'success' });
            } catch (error) {
                commit('setNotification', { message: 'Erro ao atualizar biografia.', type: 'error' });
            } finally {
                commit('setLoading', false);
            }
        },
        async updateProfileImage({ commit, state }, formData) {
            if (!state.isAuthenticated) return;
            
            commit('setLoading', true);
            commit('clearNotification');
            
            try {
                const response = await api.patch('/users/update_profile_image/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${state.token}`,
                    },
                });
                
                const profileImageUrl = response.data.profile_image_url;
                if (profileImageUrl) {
                    commit('updateUserProfileImage', profileImageUrl);
                } else {
                    console.error("URL da imagem de perfil não recebida corretamente.");
                    commit('setNotification', { message: 'Erro ao atualizar a imagem de perfil. URL inválida.', type: 'error' });
                }
        
                commit('setNotification', { message: 'Imagem de perfil atualizada com sucesso!', type: 'success' });
            } catch (error) {
                console.error("Erro durante o upload da imagem:", error);
                commit('setNotification', { message: 'Erro ao atualizar a imagem de perfil.', type: 'error' });
            } finally {
                commit('setLoading', false);
            }
        },        
        async fetchTweets({ commit, state }) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearNotification');

            try {
                const response = await api.get('/tweets/');
                commit('setTweets', response.data);
            } catch (error) {
                commit('setNotification', { message: 'Erro ao carregar tweets.', type: 'error' });
            } finally {
                commit('setLoading', false);
            }
        },
        async createTweet({ commit, state }, tweetData) {
            if (!state.isAuthenticated) return;

            commit('setLoading', true);
            commit('clearNotification');

            try {
                const response = await api.post('/tweets/', tweetData);
                commit('addTweet', response.data);
                commit('setNotification', { message: 'Tweet criado com sucesso!', type: 'success' });
            } catch (error) {
                commit('setNotification', { message: 'Erro ao criar tweet.', type: 'error' });
            } finally {
                commit('setLoading', false);
            }
        },
        async deleteTweet({ commit, state }, { tweetId }) {
            try {
                if (state.token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
                }
        
                const response = await api.delete(`/tweets/${tweetId}/`);
                if (response.status === 204) {
                    commit('removeTweet', tweetId);
                    commit('setNotification', { message: 'Tweet excluído com sucesso!', type: 'success' });
                }
            } catch (error) {
                commit('setNotification', { message: 'Erro ao excluir o tweet.', type: 'error' });
            }
        },        
        async refreshToken({ commit, state }) {
            if (!state.refreshToken) return;

            try {
                const response = await api.post('/auth/token/refresh/', { refresh: state.refreshToken });
                commit('setToken', response.data.access);
            } catch (error) {
                commit('setNotification', { message: 'Erro ao atualizar token.', type: 'error' });
                commit('clearAuth');
            }
        },
        logout({ commit }) {
            commit('clearAuth');
            commit('setNotification', { message: 'Logout realizado com sucesso!', type: 'success' });
        },
    },
    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        isLoading: (state) => state.isLoading,
        notificationMessage: (state) => state.notificationMessage,
        notificationType: (state) => state.notificationType,
        getUser: (state) => state.user,
        getTweets: (state) => state.tweets,
        getUsers: (state) => state.users,
    },
});

export default store;
