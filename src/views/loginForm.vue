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
            <button type="submit">Login</button>
        </form>
        <router-link to="/signup">Sign Up</router-link>
    </div>
</template>

<script>
export default {
    name: 'LoginForm',
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async login() {
            try {
                const response = await fetch(
                    'http://127.0.0.1:8000/api/token/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: this.username,
                            password: this.password,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to login');
                }

                const data = await response.json();

                // Armazena o token JWT em localStorage ou sessionStorage
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                // Redireciona o usuário para o dashboard
                this.$router.push('/dashboard');
            } catch (error) {
                alert('Invalid credentials, please try again.');
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
</style>
