<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <input
                v-model="username"
                type="text"
                placeholder="Username"
                required
            />
            <input
                v-model="password"
                type="password"
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import api from '../services/axiosConfig';

export default {
    data() {
        return {
            username: '',
            password: '',
            errorMessage: null,
        };
    },
    methods: {
        async login() {
            try {
                await api.post('/api/users/login/', {
                    username: this.username,
                    password: this.password,
                });
                this.$router.push('/dashboard');
            } catch (error) {
                this.errorMessage = 'Credenciais inválidas.';
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
}
button {
    margin-top: 10px;
}
.error {
    color: red;
    margin-top: 10px;
}
</style>
