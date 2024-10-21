import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/views/loginForm.vue';
import SignUpForm from '@/views/signUpForm.vue';
import UserDashboard from '@/views/userDashboard.vue';
import api from '@/services/axiosConfig';  // Importa a configuração do Axios para verificar o status do usuário

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/signup', name: 'SignUp', component: SignUpForm },
    {
        path: '/dashboard',
        name: 'UserDashboard',
        component: UserDashboard,
        meta: { requiresAuth: true },  // Rota protegida que requer autenticação
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Verificação de autenticação antes de acessar rotas protegidas
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            // Faz uma requisição ao backend para verificar se o usuário está autenticado
            await api.get('/api/users/me/');

            // Se o backend confirmar a autenticidade, o acesso à rota protegida é permitido
            next();
        } catch (error) {
            // Se a autenticação falhar, redireciona para a página de login
            next({ path: '/login' });
        }
    } else {
        next();  // Permite a navegação para rotas públicas sem autenticação
    }
});

export default router;
