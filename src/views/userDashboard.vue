<template>
    <div class="container">
        <div class="sidebar">
            <UserProfile :userProfile="userProfile" />
        </div>
        <div class="main-content">
            <TweetFeed />
            <UserList />
        </div>
        <div v-if="isLoading" class="loading">Carregando...</div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
</template>

<script>
import UserProfile from '@/components/userProfile.vue';
import TweetFeed from '@/components/tweetFeed.vue';
import UserList from '@/components/userList.vue';
import api from '@/services/axiosConfig';

export default {
    name: 'UserDashboard',
    components: {
        UserProfile,
        TweetFeed,
        UserList,
    },
    data() {
        return {
            userProfile: null,
            isLoading: true,
            errorMessage: null,
        };
    },
    async mounted() {
        await this.loadUserProfile();
    },
    methods: {
        async loadUserProfile() {
            this.isLoading = true; // Inicia o carregamento
            this.errorMessage = null; // Limpa mensagens de erro

            try {
                const response = await api.get('/api/users/me/');
                this.userProfile = response.data;
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        this.errorMessage = 'Você não está autorizado. Faça login novamente.';
                        this.$router.push('/login');
                    } else {
                        this.errorMessage = 'Erro ao carregar perfil: ' + (error.response.data.detail || 'Tente novamente mais tarde.');
                    }
                } else {
                    this.errorMessage = 'Erro ao carregar perfil. Verifique sua conexão com a internet.';
                }
            } finally {
                this.isLoading = false; // Finaliza o carregamento
            }
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    height: 100vh;
}
.sidebar {
    width: 20%;
    background-color: #f5f5f5;
    padding: 20px;
}
.main-content {
    width: 80%;
    padding: 20px;
}
.loading {
    text-align: center;
    margin-top: 20px;
}
.error {
    color: red;
    margin-top: 20px;
}
</style>
