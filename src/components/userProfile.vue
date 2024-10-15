<template>
    <div class="user-profile">
        <div class="profile-img-container" @click="editProfileImage">
            <img
                :src="profileImage"
                alt="Profile Image"
                class="profile-img"
                v-if="profileImage"
            />
            <input
                type="file"
                ref="fileInput"
                class="hidden"
                @change="uploadImage"
                accept="image/*"
            />
        </div>
        <h2 v-if="username">{{ username }}</h2>
        <h2 v-else>Usuário não encontrado</h2>
        <p>{{ followersCount }} seguidores</p>
        <div>
            <p v-if="!isEditingBio">{{ bio || 'Escreva sobre você' }}</p>
            <div v-if="isEditingBio">
                <textarea v-model="newBio" maxlength="300"></textarea>
                <div class="buttons">
                    <button @click="confirmEditBio">Confirmar</button>
                    <button @click="cancelEditBio">Cancelar</button>
                </div>
            </div>
            <button v-if="!isEditingBio" @click="editBio">
                Editar Biografia
            </button>
        </div>
    </div>
</template>

<script>
import api from '@/services/axiosConfig';

export default {
    data() {
        return {
            profileImage: null,
            username: '',
            bio: '',
            newBio: '',
            isEditingBio: false,
            followersCount: 0,
        };
    },
    methods: {
        editProfileImage() {
            this.$refs.fileInput.click(); // Abre a seleção de arquivo para upload
        },
        async uploadImage(event) {
            const file = event.target.files[0]; // Obtém o arquivo selecionado
            if (file) {
                const formData = new FormData();
                formData.append('profile_image', file); // Adiciona o arquivo ao FormData

                try {
                    const response = await api.patch('/api/users/me/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data', // Configura o cabeçalho para multipart/form-data
                        },
                    });
                    this.profileImage = response.data.profile_image; // Atualiza a imagem de perfil
                } catch (error) {
                    console.error('Erro ao fazer upload da imagem.', error); // Mensagem de erro
                }
            }
        },
        editBio() {
            this.isEditingBio = true; // Ativa o modo de edição da biografia
            this.newBio = this.bio; // Carrega a biografia atual no campo de edição
        },
        async confirmEditBio() {
            if (this.newBio.length > 300) {
                console.error('Biografia excede o limite de 300 caracteres.'); // Validação de tamanho da biografia
                return;
            }

            try {
                const response = await api.patch('/api/users/me/', { bio: this.newBio }); // Atualiza a biografia
                this.bio = response.data.bio; // Atualiza a biografia no estado
                this.isEditingBio = false; // Desativa o modo de edição
            } catch (error) {
                console.error('Erro ao atualizar biografia.', error); // Mensagem de erro
            }
        },
        cancelEditBio() {
            this.isEditingBio = false; // Cancela a edição da biografia
        },
    },
    async mounted() {
        try {
            const response = await api.get('/api/users/me/'); // Obtém os dados do usuário autenticado

            if (response.data) {
                this.username = response.data.username || 'Usuário não encontrado'; // Atualiza o nome de usuário
                this.bio = response.data.bio || 'Escreva sobre você'; // Atualiza a biografia
                this.profileImage = response.data.profile_image; // Atualiza a imagem de perfil
                this.followersCount = response.data.followers_count || 0; // Atualiza a contagem de seguidores
            } else {
                console.error('Dados do usuário não encontrados na resposta da API');
            }
        } catch (error) {
            console.error('Erro ao carregar perfil.', error); // Mensagem de erro
        }
    },
};
</script>

<style scoped>
.user-profile {
    text-align: center; /* Centraliza o conteúdo */
}
.profile-img-container {
    cursor: pointer; /* Cursor de ponteiro ao passar o mouse sobre a imagem */
}
.profile-img {
    border-radius: 50%; /* Torna a imagem redonda */
    width: 100px; /* Largura da imagem */
    height: 100px; /* Altura da imagem */
    object-fit: cover; /* Cobre a área da imagem */
}
.hidden {
    display: none; /* Oculta o input de arquivo */
}
textarea {
    width: 100%; /* Largura total do textarea */
    height: 100px; /* Altura do textarea */
    margin-top: 10px; /* Margem superior */
    resize: none; /* Impede redimensionamento */
}
.buttons {
    display: flex; /* Usar flexbox para os botões */
    justify-content: space-between; /* Espaço entre os botões */
    margin-top: 10px; /* Margem superior */
}
button {
    margin-top: 10px; /* Margem superior dos botões */
}
</style>
