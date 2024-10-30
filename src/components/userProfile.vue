<template>
    <div class="user-profile">
        <div class="profile-img-container" @click="triggerFileUpload">
            <img
                :src="user?.profile_image"
                alt="Profile Image"
                class="profile-img"
                v-if="user?.profile_image"
            />
            <input
                type="file"
                ref="fileInput"
                class="hidden"
                @change="uploadImage"
                accept="image/*"
            />
        </div>
        <h2 v-if="user?.username">{{ user.username }}</h2>
        <h2 v-else>Usuário não encontrado</h2>
        <p>{{ user?.followers_count || 0 }} seguidores</p>

        <div>
            <p v-if="!isEditingBio">{{ user?.bio || 'Escreva sobre você' }}</p>
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
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            newBio: '',
            isEditingBio: false,
            isSaving: false,
            errorMessage: null,
            successMessage: null,
        };
    },
    computed: {
        ...mapState(['user']),
    },
    methods: {
        ...mapActions(['updateProfileImage', 'updateBio']),

        triggerFileUpload() {
            this.$refs.fileInput.click(); // Abre o seletor de arquivo
        },

        async uploadImage(event) {
            const file = event.target.files[0];

            if (file && file.size <= 2 * 1024 * 1024) {
                const formData = new FormData();
                formData.append('profile_image', file);

                this.isSaving = true;
                this.errorMessage = null;
                this.successMessage = null;

                try {
                    await this.updateProfileImage(formData);
                    this.successMessage =
                        'Imagem de perfil atualizada com sucesso!';
                } catch {
                    this.errorMessage =
                        'Erro ao atualizar a imagem. Tente novamente.';
                } finally {
                    this.isSaving = false;
                }
            } else {
                this.errorMessage = 'O arquivo deve ser menor que 2MB.';
            }
        },

        editBio() {
            this.isEditingBio = true;
            this.newBio = this.user?.bio || '';
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
                await this.updateBio({ bio: this.newBio });
                this.successMessage = 'Biografia atualizada com sucesso!';
                this.isEditingBio = false;
            } catch {
                this.errorMessage =
                    'Erro ao atualizar biografia. Tente novamente.';
            } finally {
                this.isSaving = false;
            }
        },

        cancelEditBio() {
            this.isEditingBio = false;
            this.newBio = this.user?.bio || '';
        },
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
