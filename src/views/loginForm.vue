<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <input type="text" v-model="username" placeholder="nome do usuário" required />
            <input type="password" v-model="password" placeholder="senha" required />
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>
        </form>
        <p>não tem uma conta? <router-link to="/register">cadastre-se aqui</router-link></p>

        <NotificationAlert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import NotificationAlert from '@/components/notificationAlert.vue';

export default {
    components: {
        NotificationAlert,
    },
    data() {
        return {
            username: '',
            password: '',
        };
    },
    computed: {
        ...mapState({
            isAuthenticated: (state) => state.isAuthenticated,
            isLoading: (state) => state.isLoading,
            notificationMessage: (state) => state.notificationMessage,
            notificationType: (state) => state.notificationType,
        }),
    },
    methods: {
        ...mapActions(['login']),
        ...mapMutations(['clearNotification', 'setNotification']),

        async handleLogin() {
            this.clearNotification(); // Limpa notificações anteriores

            try {
                await this.login({ username: this.username, password: this.password });
                if (this.isAuthenticated) {
                    this.setNotification({
                        message: 'Login realizado com sucesso!',
                        type: 'success',
                    });
                    this.$router.push('/dashboard');
                }
            } catch (error) {
                this.setNotification({
                    message: 'Credenciais inválidas ou erro no servidor.',
                    type: 'error',
                });
            }
        },
    },
    created() {
        // Limpa notificações ao abrir a página de login
        this.clearNotification();
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 100px);
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 300px;
}

input {
    display: block;
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
}

button {
    width: 100px; 
    margin-top: 10px;
    padding: 5px 10px; 
    cursor: pointer;
    font-size: 12px;
}
</style>
