<template>
    <div class="user-list">
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-else-if="!filteredUsers || filteredUsers.length === 0" class="no-users">
            não existem usuários
        </div>
        <div v-else class="user-container">
            <div v-for="user in filteredUsers" :key="user.id" class="user-item">
                <img :src="user.profile_image_url" alt="Profile" class="user-img" />
                <div>
                    <p>{{ user.username }}</p>
                    <button
                        @click="toggleFollow(user)"
                        @mouseover="showUnfollowOption(user)"
                        @mouseleave="hideUnfollowOption(user)"
                        :class="{ following: user.is_following }"
                        :disabled="isLoading"
                    >
                        {{ user.is_following ? (user.showUnfollow ? 'Reverter' : 'Seguindo') : 'Seguir' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
    name: 'UserList',
    computed: {
        ...mapState({
            isLoading: (state) => state.isLoading,
            errorMessage: (state) => state.errorMessage,
        }),
        ...mapGetters(['getUsers', 'getUser']),

        filteredUsers() {
            return this.getUsers.filter(user => user.id !== this.getUser.id);
        },
    },
    async mounted() {
        try {
            await this.loadUsers();
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            this.$store.commit('setErrorMessage', 'Erro ao carregar a lista de usuários.');
        }
    },
    methods: {
        ...mapActions(['loadUsers', 'followUser', 'unfollowUser']),

        async toggleFollow(user) {
            if (user.is_following) {
                await this.unfollowUser(user.id);
            } else {
                await this.followUser(user.id);
            }
            await this.loadUsers();
        },
        showUnfollowOption(user) {
            if (user.is_following) {
                user.showUnfollow = true;
            }
        },
        hideUnfollowOption(user) {
            user.showUnfollow = false;
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
    max-height: 100%; /* Para permitir rolagem */
    overflow-y: auto;
}
.user-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.user-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
}
.user-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-bottom: 5px;
    object-fit: cover;
}
.error {
    color: red;
    font-weight: bold;
    margin-bottom: 20px;
}
.no-users {
    color: grey;
    font-weight: bold;
    margin-bottom: 20px;
}
button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(232, 232, 232);
    cursor: pointer;
    font-size: 8px;
    padding: 5px 0;
    width: 40px;
    height: 20px;
    border: 1px solid #000;
}

button.following {
    background-color: rgb(86, 156, 255);
}

button.following:hover {
    background-color: rgb(255, 90, 90);
}

button:disabled {
    background-color: rgb(229, 255, 113);
    cursor: not-allowed;
}
</style>
