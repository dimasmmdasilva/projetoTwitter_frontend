import { createRouter, createWebHistory } from 'vue-router';
import store from '../store.js';
import LoginForm from '../views/loginForm.vue';
import SignUpForm from '../views/signUpForm.vue';
import UserDashboard from '../views/userDashboard.vue';

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginForm,
        meta: { guest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: SignUpForm,
        meta: { guest: true },
    },
    {
        path: '/dashboard',
        name: 'UserDashboard',
        component: UserDashboard,
        meta: { requiresAuth: true },
    },
];

// Criando a instância do roteador
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Middleware de verificação de autenticação antes de cada navegação
router.beforeEach(async (to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;

    // Se a rota exige autenticação
    if (to.meta.requiresAuth) {
        if (isAuthenticated) {
            next(); // Usuário já autenticado, permite o acesso
        } else {
            try {
                // Tenta renovar o token de acesso
                console.log('[Router] Tentando renovar o token de acesso...');
                await store.dispatch('refreshToken');
                next(); // Permite a navegação após renovação do token
            } catch (error) {
                console.warn('[Router] Falha na renovação do token, redirecionando para login.');
                store.dispatch('logout'); // Limpa o estado de autenticação no Vuex
                next('/login'); // Redireciona para a página de login se a renovação falhar
            }
        }
    } 
    // Se a rota é para visitantes e o usuário está autenticado
    else if (to.meta.guest && isAuthenticated) {
        next('/dashboard'); // Redireciona usuários autenticados para o dashboard
    } 
    // Caso contrário, permite o acesso à rota
    else {
        next();
    }
});

export default router;
