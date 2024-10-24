<template>
    <div class="user-list">
        <h3>Usuários Sugeridos</h3>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-else-if="users.length === 0" class="no-users">
            Não existem usuários.
        </div>
        <div v-else>
            <div v-for="user in users" :key="user.id" class="user-item">
                <img :src="user.profile_image" alt="Profile" class="user-img" />
                <div>
                    <p>{{ user.username }}</p>
                    <button
                        @click="followUser(user.id)"
                        :disabled="user.isFollowing || isLoading"
                    >
                        {{ user.isFollowing ? 'Seguindo' : 'Seguir' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'UserList',
    computed: {
        ...mapState(['users', 'isLoading', 'errorMessage']),
    },
    async mounted() {
        // Carregar lista de usuários ao montar o componente
        await this.loadUsers();
    },
    methods: {
        ...mapActions(['loadUsers', 'followUser']),
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
button:disabled {
    background-color: grey;
    cursor: not-allowed;
}
</style>
