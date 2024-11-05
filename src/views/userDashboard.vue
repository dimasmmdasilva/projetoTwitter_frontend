<template>
    <div class="container">
        <!-- Componente de notificação -->
        <notification-alert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />

        <div class="sidebar" v-if="user">
            <UserProfile :userProfile="user" />
        </div>
        <div class="main-content">
            <TweetFeed />
            <UserList />
        </div>
        <div v-if="isLoading" class="loading">Carregando...</div>
    </div>
</template>

<script>
import UserProfile from '@/components/userProfile.vue';
import TweetFeed from '@/components/tweetFeed.vue';
import UserList from '@/components/userList.vue';
import NotificationAlert from '@/components/notificationAlert.vue';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'UserDashboard',
    components: {
        UserProfile,
        TweetFeed,
        UserList,
        NotificationAlert,
    },
    data() {
        return {
            notificationMessage: null,
            notificationType: 'success', // Pode ser 'success' ou 'error'
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
            isLoading: (state) => state.isLoading,
            errorMessage: (state) => state.errorMessage,
            isAuthenticated: (state) => state.isAuthenticated,
        }),
    },
    watch: {
        // Observa mudanças no erro global do Vuex e exibe uma notificação
        errorMessage(newValue) {
            if (newValue) {
                this.showNotification(newValue, 'error');
            }
        },
    },
    async created() {
        if (!this.isAuthenticated) {
            console.warn('Usuário não autenticado, redirecionando para o login.');
            this.$router.push('/login');
        } else {
            try {
                await this.fetchUserProfile();
                console.log('Perfil do usuário carregado com sucesso.');
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                this.showNotification('Erro ao carregar perfil. Faça login novamente.', 'error');
                await this.handleLogout();
            }
        }
    },
    methods: {
        ...mapActions(['fetchUserProfile', 'logout']),

        async handleLogout() {
            await this.logout();
            this.$router.push('/login');
        },

        // Método para exibir notificações
        showNotification(message, type = 'success') {
            this.notificationMessage = message;
            this.notificationType = type;
        },

        // Método para limpar a notificação
        clearNotification() {
            this.notificationMessage = null;
            this.notificationType = 'success';
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
</style>
