import { createRouter, createWebHistory } from 'vue-router';
import store from '../store.js';
import LoginForm from '../views/loginForm.vue';
import SignUpForm from '../views/signUpForm.vue';
import UserDashboard from '../views/userDashboard.vue';

// Definindo as rotas
const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginForm,
    },
    {
        path: '/register',
        name: 'Register',
        component: SignUpForm,
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

    // Verifica se a rota exige autenticação e se o usuário está autenticado
    if (to.meta.requiresAuth && !isAuthenticated) {
        try {
            await store.dispatch('refreshToken');  // Tenta renovar o token de acesso
            next();  // Permite a navegação após renovação
        } catch (error) {
            next('/login');  // Redireciona para login se a renovação falhar
        }
    } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
        // Redireciona para o dashboard se já estiver autenticado
        next('/dashboard');
    } else {
        next();  // Prossegue para a rota desejada
    }
});

export default router;
