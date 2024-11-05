<template>
    <div class="user-list">
        <h3>Usuários Sugeridos</h3>
        <div v-if="localErrorMessage" class="error">{{ localErrorMessage }}</div>
        <div v-else-if="!filteredUsers || filteredUsers.length === 0" class="no-users">
            Não existem usuários.
        </div>
        <div v-else class="user-container">
            <div v-for="user in filteredUsers" :key="user.id" class="user-item">
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
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
    name: 'UserList',
    data() {
        return {
            localErrorMessage: null, // Mensagem de erro local
        };
    },
    computed: {
        ...mapState({
            isLoading: (state) => state.isLoading, // Estado de carregamento
        }),
        ...mapGetters(['getUsers', 'getUser']), // Usa os getters para obter usuários e usuário logado

        filteredUsers() {
            // Filtra os usuários, excluindo o próprio usuário logado
            return this.getUsers.filter(user => user.id !== this.getUser.id);
        },
    },
    async mounted() {
        try {
            await this.loadUsers(); // Carrega a lista de usuários ao montar o componente
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            this.localErrorMessage = 'Erro ao carregar a lista de usuários.';
        }
    },
    methods: {
        ...mapActions(['loadUsers', 'followUser']), // Ações Vuex para carregar usuários e seguir

        async handleFollow(userId) {
            try {
                await this.followUser(userId); // Chama Vuex para seguir o usuário
                await this.loadUsers(); // Atualiza a lista de usuários após seguir
            } catch (error) {
                console.error('Erro ao seguir usuário:', error);
                this.localErrorMessage = 'Não foi possível seguir o usuário.';
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
.user-container {
    display: flex; /* Disposição horizontal */
    flex-wrap: wrap; /* Permite que os usuários quebrem para a próxima linha */
    gap: 15px; /* Espaçamento entre os usuários */
}
.user-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 150px; /* Define uma largura para os itens de usuário */
    flex-direction: column; /* Disposição dos itens dentro de user-item em coluna */
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
button:disabled {
    background-color: grey;
    cursor: not-allowed;
}
</style>
