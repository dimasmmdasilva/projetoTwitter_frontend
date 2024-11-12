<template>
    <div class="signup-container">
        <h1>Cadastro</h1>
        <form @submit.prevent="handleSignUp" class="signup-form">
            <div class="form-group">
                <input
                    type="text"
                    v-model="username"
                    placeholder="nome do usuário"
                    required
                />
            </div>
            <div class="form-group">
                <input
                    type="password"
                    v-model="password"
                    placeholder="senha"
                    required
                />
            </div>
            <div class="form-group">
                <input
                    type="password"
                    v-model="confirmPassword"
                    placeholder="confirmar senha"
                    required
                />
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
            </button>
        </form>
        <router-link to="/login">Já possui uma conta? Login</router-link>

        <!-- Componente de notificação para exibir mensagens de erro ou sucesso -->
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
    name: 'SignUpForm',
    components: {
        NotificationAlert,
    },
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: '',
        };
    },
    computed: {
        ...mapState({
            isLoading: (state) => state.isLoading,
            notificationMessage: (state) => state.notificationMessage,
            notificationType: (state) => state.notificationType,
        }),
    },
    methods: {
        ...mapActions(['signUp']),
        ...mapMutations(['clearNotification', 'setNotification']),

        async handleSignUp() {
            this.clearNotification(); // Limpa notificações anteriores

            if (this.password !== this.confirmPassword) {
                this.setNotification({
                    message: 'As senhas não coincidem.',
                    type: 'error',
                });
                return;
            }

            try {
                await this.signUp({
                    username: this.username,
                    password: this.password,
                    confirm_password: this.confirmPassword,
                });

                this.setNotification({
                    message: 'Cadastro realizado com sucesso!',
                    type: 'success',
                });

                setTimeout(() => {
                    this.$router.push('/login');
                }, 3000); // Redireciona para a página de login após 3 segundos
            } catch (error) {
                console.error('Erro durante o cadastro:', error);
                this.setNotification({
                    message: 'Erro ao realizar o cadastro. Tente novamente.',
                    type: 'error',
                });
            }
        },
    },
    created() {
        // Limpa mensagens anteriores ao abrir a página de cadastro
        this.clearNotification();
    },
};
</script>

<style scoped>
.signup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 100px);
    text-align: center;
}

.signup-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 300px;
}

.form-group {
    width: 100%;
}

input {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    box-sizing: border-box;
}

button {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 12px;
}
</style>
