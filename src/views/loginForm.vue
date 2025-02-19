<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-card class="pa-6 pb-4" width="420" elevation="8" rounded="lg">
            <v-card-title class="text-center text-h5 font-weight-bold">
                Login
            </v-card-title>
                <v-form @submit.prevent="handleLogin" class="d-flex flex-column align-center">
                    <v-text-field
                        v-model="username"
                        label="Nome do Usuário"
                        variant="outlined"
                        density="comfortable"
                        class="mt-4"
                        style="width: 90%"
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        label="Senha"
                        type="password"
                        variant="outlined"
                        density="comfortable"
                        class="mt-0"
                        style="width: 90%"
                    ></v-text-field>
                </v-form>
                <v-btn
                    color="primary"
                    type="submit"
                    :loading="isLoading"
                    size="small"
                    class="mt-3"
                    style="width: 90%"
                >
                    Entrar
                </v-btn>
            <v-card-actions class="justify-center">
                <p class="text-caption">
                    Não tem uma conta?
                    <router-link to="/register">Cadastre-se aqui</router-link>
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
                await this.login({
                    username: this.username,
                    password: this.password,
                });
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
/* Não precisamos mais da maioria dos estilos antigos, pois Vuetify já cuida do layout */
</style>
