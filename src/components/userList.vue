<template>
    <div class="user-list">
        <h3>Usuários Sugeridos</h3>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-else-if="!users || users.length === 0" class="no-users">
            Não existem usuários.
        </div>
        <div v-else>
            <div v-for="user in users" :key="user.id" class="user-item">
                <img :src="user.profile_image_url" alt="Profile" class="user-img" />
                <div>
                    <p>{{ user.username }}</p>
                    <button
                        @click="followUser(user.id)"
                        :disabled="user.is_following || isLoading"
                    >
                        {{ user.is_following ? 'Seguindo' : 'Seguir' }}
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
        ...mapState({
            users: (state) => state.users,
            isLoading: (state) => state.isLoading,
            errorMessage: (state) => state.errorMessage,
        }),
    },
    async mounted() {
        try {
            await this.loadUsers(); // Carrega a lista de usuários ao montar o componente
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    },
    methods: {
        ...mapActions(['loadUsers', 'followUser']),
        async followUser(userId) {
            try {
                await this.$store.dispatch('followUser', userId);
            } catch (error) {
                console.error('Erro ao seguir usuário:', error);
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
