import axios from 'axios';
import store from '../store';
import router from '../router/index';

const api = axios.create({
    baseURL: 'http://web:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = store.state.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                await store.dispatch('refreshToken');
                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch('logout');
                router.push('/login');
            }
        } else if (error.response && error.response.data) {
            try {
                JSON.parse(error.response.data);
            } catch {
                store.commit('setErrorMessage', 'Resposta de JSON inválida.');
            }
        }

        return Promise.reject(error);
    },
);

export default api;
