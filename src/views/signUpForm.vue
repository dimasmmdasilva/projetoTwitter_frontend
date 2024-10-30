<template>
    <div class="signup-container">
        <h1>Cadastro</h1>
        <form @submit.prevent="handleSignUp">
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
                <input
                    type="password"
                    v-model="confirmPassword"
                    placeholder="Confirmar senha"
                    required
                />
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
            </button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </form>
        <router-link to="/login">Já possui uma conta? Login</router-link>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'SignUpForm',
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: '',
            successMessage: null,
        };
    },
    computed: {
        ...mapState(['isLoading', 'errorMessage']),
    },
    methods: {
        ...mapActions(['signUp']),
        async handleSignUp() {
            // Verifica se as senhas correspondem
            if (this.password !== this.confirmPassword) {
                this.$store.commit(
                    'setErrorMessage',
                    'As senhas não coincidem.',
                );
                return;
            }

            try {
                await this.signUp({
                    username: this.username,
                    password: this.password,
                    confirm_password: this.confirmPassword,
                });

                this.successMessage = 'Cadastro realizado com sucesso!';
                setTimeout(() => {
                    this.$router.push('/login');
                }, 2000);
            } catch {
                this.successMessage = null;
                this.$store.commit('setErrorMessage', 'Falha no cadastro.');
            }
        },
    },
};
</script>

<style scoped>
.signup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
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
.success {
    color: green;
    margin-top: 10px;
}
</style>
