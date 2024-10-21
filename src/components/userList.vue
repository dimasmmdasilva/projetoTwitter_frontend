<template>
    <div class="user-list">
        <h3>Usuários Sugeridos</h3>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <div v-else-if="users.length === 0" class="no-users">Não existem usuários.</div>
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
import api from '@/services/axiosConfig';

export default {
    name: 'UserList',
    data() {
        return {
            users: [],
            errorMessage: null,
            isLoading: false,  // Adiciona estado de carregamento
        };
    },
    async mounted() {
        await this.loadUsers(); // Carregar lista de usuários ao montar o componente
    },
    methods: {
        async loadUsers() {
            try {
                // Atualiza o caminho para buscar os usuários sugeridos corretamente
                const response = await api.get('users/suggested_users/');
                this.users = response.data;
            } catch (error) {
                this.errorMessage = 'Falha ao carregar usuários.';
                console.error('Erro ao carregar usuários:', error); // Log de erro
            }
        },
        async followUser(userId) {
            this.isLoading = true;  // Ativa estado de carregamento durante a ação
            try {
                await api.post(`users/${userId}/follow_user/`, {});  // Envia requisição de seguir usuário
                // Atualiza o status de "isFollowing" do usuário após sucesso
                this.users = this.users.map((user) => {
                    if (user.id === userId) {
                        user.isFollowing = true;
                    }
                    return user;
                });
            } catch (error) {
                this.errorMessage = 'Falha ao seguir o usuário.';
                console.error('Erro ao seguir usuário:', error);  // Log de erro
            } finally {
                this.isLoading = false;  // Desativa estado de carregamento
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
    object-fit: cover;  /* Ajusta a imagem para cobrir o espaço sem distorção */
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
    background-color: grey;  /* Indica quando o botão está desabilitado */
    cursor: not-allowed;
}
</style>
