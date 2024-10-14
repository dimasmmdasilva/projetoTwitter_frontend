import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/views/loginForm.vue';
import SignUpForm from '@/views/signUpForm.vue';
import UserDashboard from '@/views/userDashboard.vue';

// Define as rotas do aplicativo
const routes = [
    { path: '/', redirect: '/login' }, // Redireciona para a página de login
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/signup', name: 'SignUp', component: SignUpForm },
    {
        path: '/dashboard',
        name: 'UserDashboard',
        component: UserDashboard,
        meta: { requiresAuth: true }, // Define que essa rota requer autenticação
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

        // Se o token não existir ou estiver expirado, redireciona para a página de login
        if (!accessToken) {
            return next({ path: '/' });
        }
    }

    // Se a rota não requer autenticação ou a autenticação estiver válida, permite a navegação
    next();
});

export default router;
