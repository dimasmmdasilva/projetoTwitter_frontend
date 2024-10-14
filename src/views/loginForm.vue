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
                // Certifique-se de que a URL e o endpoint para a requisição estejam corretos
                const response = await api.post('/api/token/', {
                    username: this.username,
                    password: this.password,
                }, {
                    headers: {
                        'Content-Type': 'application/json', // Certifique-se de que os dados são enviados como JSON
                    }
                });

                // Verificar se o token foi recebido corretamente
                if (response.data.access && response.data.refresh) {
                    // Armazenando os tokens no localStorage
                    localStorage.setItem('access_token', response.data.access);
                    localStorage.setItem('refresh_token', response.data.refresh);

                    // Armazena o user_id no localStorage, se estiver presente
                    if (response.data.user_id) {
                        localStorage.setItem('user_id', response.data.user_id);
                    }

                    // Redirecionando para o dashboard
                    this.$router.push('/dashboard');
                } else {
                    throw new Error('Erro ao receber tokens de autenticação.');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.errorMessage = 'Credenciais inválidas. Verifique seu usuário e senha.';
                } else if (error.response && error.response.data.detail) {
                    this.errorMessage = error.response.data.detail;
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
