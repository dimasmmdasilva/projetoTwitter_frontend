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
                    <button @click="confirmEditBio" :disabled="isSaving">
                        Confirmar
                    </button>
                    <button @click="cancelEditBio">Cancelar</button>
                </div>
            </div>
            <button v-if="!isEditingBio" @click="editBio" :disabled="isSaving">
                Editar Biografia
            </button>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
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
            isSaving: false, // Controle de estado durante o salvamento
            errorMessage: null,
            successMessage: null,
        };
    },
    methods: {
        editProfileImage() {
            this.$refs.fileInput.click(); // Abre a seleção de arquivo para upload
        },
        async uploadImage(event) {
            const file = event.target.files[0]; // Obtém o arquivo selecionado

            if (file && file.size <= 2 * 1024 * 1024) {
                // Limite de 2MB
                const formData = new FormData();
                formData.append('profile_image', file); // Adiciona o arquivo ao FormData

                this.isSaving = true;
                this.errorMessage = null;
                this.successMessage = null;

                try {
                    const response = await api.patch(
                        '/api/users/me/',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data', // Configura o cabeçalho para multipart/form-data
                            },
                        },
                    );
                    this.profileImage = response.data.profile_image; // Atualiza a imagem de perfil
                    this.successMessage =
                        'Imagem de perfil atualizada com sucesso!';
                } catch (error) {
                    this.errorMessage =
                        'Erro ao fazer upload da imagem. Tente novamente mais tarde.';
                    console.error('Erro ao fazer upload da imagem.', error); // Mensagem de erro
                } finally {
                    this.isSaving = false;
                }
            } else {
                this.errorMessage =
                    'O arquivo de imagem deve ser menor que 2MB.';
            }
        },
        editBio() {
            this.isEditingBio = true;
            this.newBio = this.bio;
        },
        async confirmEditBio() {
            if (this.newBio.length > 300) {
                this.errorMessage =
                    'A biografia não pode ter mais de 300 caracteres.';
                return;
            }

            this.isSaving = true;
            this.errorMessage = null;
            this.successMessage = null;

            try {
                const response = await api.patch('/api/users/me/', {
                    bio: this.newBio,
                });
                this.bio = response.data.bio;
                this.successMessage = 'Biografia atualizada com sucesso!';
                this.isEditingBio = false;
            } catch (error) {
                this.errorMessage =
                    'Erro ao atualizar biografia. Tente novamente mais tarde.';
                console.error('Erro ao atualizar biografia.', error); // Mensagem de erro
            } finally {
                this.isSaving = false;
            }
        },
        cancelEditBio() {
            this.isEditingBio = false;
            this.newBio = this.bio;
        },
    },
    async mounted() {
        this.errorMessage = null;

        try {
            const response = await api.get('/api/users/me/');
            if (response.data) {
                this.username =
                    response.data.username || 'Usuário não encontrado';
                this.bio = response.data.bio || 'Escreva sobre você';
                this.profileImage = response.data.profile_image;
                this.followersCount = response.data.followers_count || 0;
            } else {
                this.errorMessage = 'Erro ao carregar perfil.';
                console.error(
                    'Dados do usuário não encontrados na resposta da API',
                );
            }
        } catch (error) {
            this.errorMessage =
                'Erro ao carregar perfil. Tente novamente mais tarde.';
            console.error('Erro ao carregar perfil.', error); // Mensagem de erro
        }
    },
};
</script>

<style scoped>
.user-profile {
    text-align: center;
}
.profile-img-container {
    cursor: pointer;
}
.profile-img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
}
.hidden {
    display: none;
}
textarea {
    width: 100%;
    height: 100px;
    margin-top: 10px;
    resize: none;
}
.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
button {
    margin-top: 10px;
}
.error {
    color: red;
    margin-top: 10px;
}
.success {
    color: green;
    margin-top: 10px;
}
</style>
