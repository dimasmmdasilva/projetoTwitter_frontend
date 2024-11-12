<template>
    <div class="container">
        <NotificationAlert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />

        <!-- UserProfile fixo do lado esquerdo -->
        <div class="sidebar-left" v-if="user">
            <UserProfile :userProfile="user" />
        </div>

        <!-- TweetFeed com rolagem interna -->
        <div class="main-content">
            <TweetFeed />
        </div>
        
        <!-- UserList com rolagem interna -->
        <div class="sidebar-right">
            <UserList />
        </div>
    </div>
</template>

<script>
import UserProfile from '@/components/userProfile.vue';
import TweetFeed from '@/components/tweetFeed.vue';
import UserList from '@/components/userList.vue';
import NotificationAlert from '@/components/notificationAlert.vue';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
    name: 'UserDashboard',
    components: {
        UserProfile,
        TweetFeed,
        UserList,
        NotificationAlert,
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
            isLoading: (state) => state.isLoading,
            isAuthenticated: (state) => state.isAuthenticated,
            notificationMessage: (state) => state.notificationMessage,
            notificationType: (state) => state.notificationType,
        }),
    },
    watch: {
        isAuthenticated(isAuth) {
            if (isAuth) {
                this.loadUserProfile();
            } else {
                this.$router.push('/login');
            }
        },
    },
    methods: {
        ...mapActions(['fetchUserProfile', 'logout']),
        ...mapMutations(['clearNotification', 'setNotification']),

        async loadUserProfile() {
            try {
                await this.fetchUserProfile();
                this.setNotification({ message: 'Perfil do usuário carregado com sucesso.', type: 'success' });
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                this.setNotification({ message: 'Erro ao carregar perfil. Faça login novamente.', type: 'error' });
                await this.handleLogout();
            }
        },

        async handleLogout() {
            await this.logout();
            this.$router.push('/login');
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    height: 100%;
    overflow: hidden !important;
}

.sidebar-left {
    width: 20%;
    background-color: #f5f5f5;
    padding: 20px;
}

.main-content {
    width: 70%;
    padding: 20px;
    height: 100vh;
    overflow-y: auto;
}

.sidebar-right {
    width: 10%;
    background-color: #f5f5f5;
    padding: 20px;
    height: 100vh;
    overflow-y: auto;
}
</style>
