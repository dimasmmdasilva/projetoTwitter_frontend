import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/views/loginForm.vue';
import SignUpForm from '@/views/signUpForm.vue';
import UserDashboard from '@/views/userDashboard.vue';

// Define as rotas do aplicativo
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/signup', name: 'SignUp', component: SignUpForm },
    {
        path: '/dashboard',
        name: 'UserDashboard',
        component: UserDashboard,
        // Adiciona um "meta" campo para definir que essa rota requer autenticação
        meta: { requiresAuth: true },
    },
];

// Cria o roteador Vue
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Adiciona um "navigation guard" para proteger rotas que requerem autenticação
router.beforeEach((to, from, next) => {
    // Verifica se a rota requer autenticação
    if (to.meta.requiresAuth) {
        const accessToken = localStorage.getItem('access_token');

        // Se o token não existir, redireciona para a página de login
        if (!accessToken) {
            return next({ path: '/login' });
        }
    }

    // Se a autenticação estiver ok, ou se a rota não precisar de autenticação, continua normalmente
    next();
});

export default router;
