import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/views/loginForm.vue';
import SignUpForm from '@/views/signUpForm.vue';
import UserDashboard from '@/views/userDashboard.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/signup', name: 'SignUp', component: SignUpForm },
    { path: '/dashboard', name: 'UserDashboard', component: UserDashboard },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
