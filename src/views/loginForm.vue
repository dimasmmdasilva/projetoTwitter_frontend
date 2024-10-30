<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <input
                    type="text"
                    v-model="username"
                    placeholder="Nome de usuário"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    v-model="password"
                    placeholder="Senha"
                    required
                />
            </div>
            <div>
                <button type="submit" :disabled="isLoading">
                    {{ isLoading ? 'Entrando...' : 'Login' }}
                </button>
            </div>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
        <div class="register-link">
            <p>
                Não tem uma conta?
                <router-link to="/register">Cadastre-se aqui</router-link>
            </p>
        </div>
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
            this.$store.commit('setErrorMessage', null);

            // Verifica se os campos estão preenchidos
            if (!this.username || !this.password) {
                this.$store.commit('setErrorMessage', 'Por favor, preencha todos os campos.');
                console.warn('Campos de login não preenchidos.');
                return;
            }

            try {
                // Tenta realizar o login
                await this.login({ username: this.username, password: this.password });

                // Verifica se o usuário foi autenticado
                if (this.isAuthenticated) {
                    console.log('Login bem-sucedido, redirecionando para o dashboard.');
                    this.$router.push('/dashboard');
                }
            } catch (error) {
                console.error('Erro durante o login:', error);
                this.$store.commit('setErrorMessage', error.response?.data?.detail || 'Credenciais inválidas ou erro no servidor.');
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
.register-link {
    margin-top: 20px;
}
</style>
