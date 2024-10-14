<template>
    <div class="container">
        <div class="sidebar">
            <!-- Passando as informações de perfil para o componente de perfil -->
            <UserProfile :userProfile="userProfile" />
        </div>
        <div class="main-content">
            <!-- Componente do feed de tweets -->
            <TweetFeed />
            <!-- Componente da lista de usuários -->
            <UserList />
        </div>
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
            userProfile: null,  // Perfil do usuário
            isLoading: true,    // Controla o estado de carregamento
            errorMessage: null, // Mensagens de erro
        };
    },
    async mounted() {
        this.loadUserProfile(); // Carrega o perfil quando o componente é montado
    },
    methods: {
        async loadUserProfile() {
            try {
                const userId = localStorage.getItem('user_id');
                if (!userId) {
                    this.errorMessage = 'ID de usuário não encontrado.';
                    return;
                }

                // Fazendo a requisição para obter o perfil do usuário
                const response = await api.get(`users/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                
                // Se a resposta for bem-sucedida, armazena os dados do perfil
                this.userProfile = response.data;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.errorMessage = 'Você não está autorizado. Faça login novamente.';
                    this.$router.push('/login'); // Redireciona para o login
                } else {
                    this.errorMessage = 'Erro ao carregar perfil. Tente novamente mais tarde.';
                }
            } finally {
                this.isLoading = false; // Para o carregamento
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
</style>
