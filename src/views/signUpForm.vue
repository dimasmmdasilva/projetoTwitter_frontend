<template>
    <div class="signup-container">
        <h1>Cadastro</h1>
        <form @submit.prevent="handleSignUp" class="signup-form">
            <div class="form-group">
                <input
                    type="text"
                    v-model="username"
                    placeholder="Nome de usuário"
                    required
                />
            </div>
            <div class="form-group">
                <input
                    type="password"
                    v-model="password"
                    placeholder="Senha"
                    required
                />
            </div>
            <div class="form-group">
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
        };
    },
    computed: {
        ...mapState(['isLoading', 'errorMessage', 'successMessage']),
    },
    methods: {
        ...mapActions(['signUp']),
        async handleSignUp() {
            this.$store.commit('setErrorMessage', null);
            this.$store.commit('setSuccessMessage', null);

            if (this.password !== this.confirmPassword) {
                this.$store.commit('setErrorMessage', 'As senhas não coincidem.');
                return;
            }

            try {
                await this.signUp({
                    username: this.username,
                    password: this.password,
                    confirm_password: this.confirmPassword,
                });

                this.$store.commit('setSuccessMessage', 'Cadastro realizado com sucesso!');
                setTimeout(() => {
                    this.$router.push('/login');
                }, 3000);
            } catch (error) {
                console.error('Erro durante o cadastro:', error);
            }
        },
    },
    created() {
        // Limpa as mensagens de erro e sucesso ao carregar a página de cadastro
        this.$store.commit('setErrorMessage', null);
        this.$store.commit('setSuccessMessage', null);
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

.form {
    margin-bottom: 10px;
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

.error {
    color: rgb(196, 5, 5);
    margin-top: 5px;
}

.success {
    color: rgba(0, 103, 247, 0.845);
    margin-top: 5px;
}
</style>
