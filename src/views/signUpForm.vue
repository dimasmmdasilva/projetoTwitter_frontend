<template>
    <div class="signup-container">
        <h1>Sign Up</h1>
        <form @submit.prevent="signUp">
            <div>
                <input
                    type="text"
                    v-model="username"
                    placeholder="Username"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    v-model="password"
                    placeholder="Password"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    v-model="confirmPassword"
                    placeholder="Confirm Password"
                    required
                />
            </div>
            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Signing Up...' : 'Sign Up' }}
            </button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </form>
        <router-link to="/">Login</router-link>
    </div>
</template>

<script>
import api from '../services/axiosConfig';

export default {
    name: 'SignUpForm',
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: '',
            isLoading: false,
            errorMessage: null,
            successMessage: null,
        };
    },
    methods: {
        async signUp() {
            if (this.password !== this.confirmPassword) {
                this.errorMessage = 'Passwords do not match';
                this.confirmPassword = '';
                return;
            }

            this.isLoading = true;
            this.errorMessage = null;
            this.successMessage = null;

            try {
                const response = await api.post('/api/users/', {
                    username: this.username,
                    password: this.password,
                });

                if (response.status === 201) {
                    this.successMessage = 'Cadastro realizado com sucesso!';
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 4000);
                } else {
                    this.errorMessage = 'Unexpected error during sign up.';
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    this.errorMessage = error.response.data?.detail || 'Failed to sign up. Try a different username.';
                } else {
                    this.errorMessage = 'An error occurred. Please try again later.';
                }
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.signup-container {
    text-align: center;
    margin-top: 50px;
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
.success {
    color: rgb(0, 255, 0);
    margin-top: 10px;
}
</style>
