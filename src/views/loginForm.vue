<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <input
                type="text"
                v-model="username"
                placeholder="Nome de usuário"
                required
            />
            <input
                type="password"
                v-model="password"
                placeholder="Senha"
                required
            />
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Entrando...' : 'Login' }}
            </button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
        <p>
            Não tem uma conta? <router-link to="/register">Cadastre-se aqui</router-link>
        </p>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    computed: {
        ...mapState(['isAuthenticated', 'isLoading', 'errorMessage']),
    },
    methods: {
        ...mapActions(['login']),
        async handleLogin() {
            // Limpa mensagens de erro antes de tentar o login
            this.$store.commit('setErrorMessage', null);

            // Verifica se os campos de login estão preenchidos
            if (!this.username || !this.password) {
                this.$store.commit('setErrorMessage', 'Por favor, preencha todos os campos.');
                return;
            }

            try {
                // Chama a action de login do Vuex com as credenciais do usuário
                await this.login({ username: this.username, password: this.password });

                // Redireciona para o dashboard se o usuário estiver autenticado
                if (this.isAuthenticated) {
                    this.$router.push('/dashboard');
                }
            } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Credenciais inválidas ou erro no servidor.';
                this.$store.commit('setErrorMessage', errorMsg);
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
input {
    display: block;
    margin-bottom: 10px;
    padding: 8px;
    width: 200px;
}
button {
    margin-top: 10px;
    padding: 10px 20px;
    cursor: pointer;
}
.error {
    color: red;
    margin-top: 10px;
}
</style>
