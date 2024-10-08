<template>
    <div class="container">
        <div class="sidebar">
            <UserProfile :userProfile="userProfile" />
        </div>
        <div class="main-content">
            <TweetFeed />
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
            userProfile: {},
            isLoading: true,
            errorMessage: null,
        };
    },
    async mounted() {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                this.errorMessage = 'ID de usuário não encontrado';
                return;
            }
            // Fazendo a requisição para carregar os dados do usuário
            const response = await api.get(`/api/users/${userId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            this.userProfile = response.data;
        } catch (error) {
            this.errorMessage = 'Erro ao carregar perfil.';
        } finally {
            this.isLoading = false;
        }
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
