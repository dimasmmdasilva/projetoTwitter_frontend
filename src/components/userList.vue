<template>
    <div class="user-list">
        <h3>Suggested Users</h3>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-else>
            <div v-for="user in users" :key="user.id" class="user-item">
                <img :src="user.profile_image" alt="Profile" class="user-img" />
                <div>
                    <p>{{ user.username }}</p>
                    <button
                        @click="followUser(user.id)"
                        :disabled="user.isFollowing"
                    >
                        {{ user.isFollowing ? 'Following' : 'Follow' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/services/axiosConfig';

export default {
    name: 'UserList',
    data() {
        return {
            users: [],
            errorMessage: null,
        };
    },
    async mounted() {
        try {
            const response = await api.get('users/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            this.users = response.data;
        } catch (error) {
            this.errorMessage = 'Failed to load users.';
        }
    },
    methods: {
        async followUser(userId) {
            try {
                await api.post(
                    `users/${userId}/follow_user/`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    },
                );
                // Atualiza a lista de usuários
                this.users = this.users.map((user) => {
                    if (user.id === userId) {
                        user.isFollowing = true;
                    }
                    return user;
                });
            } catch (error) {
                console.error('Failed to follow user');
            }
        },
    },
};
</script>

<style scoped>
.user-list {
    margin-top: 20px;
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
}
.user-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.user-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}
.error {
    color: red;
    font-weight: bold;
    margin-bottom: 20px;
}
</style>
