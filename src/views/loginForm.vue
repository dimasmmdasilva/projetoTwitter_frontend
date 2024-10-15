<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div>
                <label for="username">Username</label>
                <input v-model="username" type="text" id="username" required />
            </div>
            <div>
                <label for="password">Password</label>
                <input
                    v-model="password"
                    type="password"
                    id="password"
                    required
                />
            </div>
            <button type="submit" :disabled="isLoading">
                <span v-if="isLoading">
                    <i class="fas fa-spinner fa-spin"></i> Logging in...
                </span>
                <span v-else>Login</span>
            </button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
        <router-link to="/signup">Sign Up</router-link>
    </div>
</template>

<script>
import api from '../services/axiosConfig';

export default {
    name: 'LoginForm',
    data() {
        return {
            username: '',
            password: '',
            isLoading: false,
            errorMessage: null,
        };
    },
    methods: {
        async login() {
            this.isLoading = true;
            this.errorMessage = null;

            try {
                // Fazendo a requisição de login com as credenciais do usuário
                const response = await api.post('/login/', {
                    username: this.username,
                    password: this.password,
                });

                if (response.status === 200) {
                    // Login bem-sucedido, redireciona para o dashboard
                    this.$router.push('/dashboard');
                } else {
                    throw new Error('Erro ao autenticar o usuário.');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
                } else {
                    this.errorMessage = 'Ocorreu um erro durante o login. Tente novamente mais tarde.';
                }
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    text-align: center;
    margin-top: 50px;
}
form {
    display: inline-block;
}
label,
input {
    display: block;
    margin-bottom: 10px;
}
button {
    margin-top: 10px;
}
.error {
    color: red;
    margin-top: 10px;
}
</style>
