<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <input type="text" v-model="username" placeholder="Nome de usuário" required />
            <input type="password" v-model="password" placeholder="Senha" required />
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Entrando...' : 'Login' }}
            </button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
        <p>Não tem uma conta? <router-link to="/register">Cadastre-se aqui</router-link></p>
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
            try {
                await this.login({ username: this.username, password: this.password });
                if (this.isAuthenticated) {
                    this.$router.push('/dashboard');
                }
            } catch (error) {
                this.$store.commit('setErrorMessage', 'Credenciais inválidas ou erro no servidor.');
            }
        },
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

.error {
    color: red;
    margin-top: 10px;
    text-align: center;
}
</style>
