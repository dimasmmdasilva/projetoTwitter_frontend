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
                        @click="handleFollow(user.id)"
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
            users: (state) => state.users, // Lista de usuários carregada no Vuex
            isLoading: (state) => state.isLoading, // Estado de carregamento
            errorMessage: (state) => state.errorMessage, // Mensagens de erro
        }),
    },
    async mounted() {
        try {
            await this.loadUsers(); // Carrega a lista de usuários ao montar o componente
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            this.$store.commit('setErrorMessage', 'Erro ao carregar a lista de usuários.');
        }
    },
    methods: {
        ...mapActions(['loadUsers', 'followUser']), // Ações Vuex para carregar usuários e seguir

        async handleFollow(userId) {
            try {
                await this.followUser(userId); // Chamada Vuex para seguir o usuário
                await this.loadUsers(); // Atualiza a lista de usuários após seguir
            } catch (error) {
                console.error('Erro ao seguir usuário:', error);
                this.$store.commit('setErrorMessage', 'Não foi possível seguir o usuário.');
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
