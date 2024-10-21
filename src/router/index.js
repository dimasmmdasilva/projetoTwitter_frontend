import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/views/loginForm.vue';
import UserDashboard from '@/views/userDashboard.vue';
import api from '@/services/axiosConfig';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginForm },
    {
        path: '/dashboard',
        component: UserDashboard,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            await api.get('/api/users/me/');
            next();
        } catch {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;
