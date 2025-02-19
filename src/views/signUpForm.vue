<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-card class="pa-6 pb-4" width="420" elevation="8" rounded="lg">
            <v-card-title class="text-center text-h5 font-weight-bold">
                Cadastro
            </v-card-title>
            <v-form @submit.prevent="handleSignUp" class="d-flex flex-column align-center">
                <v-text-field
                    v-model="username"
                    label="Nome do Usuário"
                    variant="outlined"
                    density="comfortable"
                    class="mt-4"
                    style="width: 90%"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    label="Senha"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                    class="mt-0"
                    style="width: 90%"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="confirmPassword"
                    label="Confirmar Senha"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                    class="mt-0"
                    style="width: 90%"
                    required
                ></v-text-field>
            </v-form>
            <v-btn
                color="primary"
                type="submit"
                :loading="isLoading"
                size="small"
                class="mt-2 mb-0"
                style="width: 90%"
            >
                {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
            </v-btn>
            <v-card-actions class="justify-center">
                <p class="text-caption">
                    Já possui uma conta?
                    <router-link to="/login">Entre por aqui</router-link>
                </p>
            </v-card-actions>
            <NotificationAlert
                v-if="notificationMessage"
                :message="notificationMessage"
                :type="notificationType"
                @close="clearNotification"
            />
        </v-card>
    </v-container>
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
