<template>
    <div class="user-profile">
        <div class="profile-img-container" @click="triggerFileUpload">
            <img
                v-if="user?.profile_image_url"
                :src="user.profile_image_url"
                alt="Profile Image"
                class="profile-img"
            />
            <div v-else class="placeholder-img">
                <span>Adicionar Imagem</span>
            </div>
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
                    <button @click="confirmEditBio" :disabled="isSaving">Confirmar</button>
                    <button @click="cancelEditBio">Cancelar</button>
                </div>
            </div>
            <button v-if="!isEditingBio" @click="editBio" :disabled="isSaving">
                Editar Biografia
            </button>
        </div>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>

        <button class="logout-button" @click="handleLogout">Sair</button>
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
        ...mapState({
            user: (state) => state.user,
        }),
    },
    methods: {
        ...mapActions(['updateProfileImage', 'updateBio', 'fetchUserProfile', 'logout']),
        
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        async uploadImage(event) {
            const file = event.target.files[0];
            if (file && file.size <= 2 * 1024 * 1024) {
                const formData = new FormData();
                formData.append('profile_image', file);
                this.isSaving = true;
                this.clearMessages();
                try {
                    await this.updateProfileImage(formData);
                    this.successMessage = 'Imagem de perfil atualizada com sucesso!';
                    await this.fetchUserProfile();
                } catch (error) {
                    this.errorMessage = 'Erro ao atualizar a imagem. Tente novamente.';
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
                this.errorMessage = 'A biografia não pode ter mais de 300 caracteres.';
                return;
            }
            this.isSaving = true;
            this.clearMessages();
            try {
                await this.updateBio({ bio: this.newBio });
                this.successMessage = 'Biografia atualizada com sucesso!';
                this.isEditingBio = false;
                await this.fetchUserProfile();
            } catch (error) {
                this.errorMessage = 'Erro ao atualizar biografia. Tente novamente.';
            } finally {
                this.isSaving = false;
            }
        },
        cancelEditBio() {
            this.isEditingBio = false;
            this.newBio = this.user?.bio || '';
        },
        async handleLogout() {
            await this.logout();
            this.$router.push('/login');
        },
        clearMessages() {
            this.errorMessage = null;
            this.successMessage = null;
        }
    },
    async created() {
        if (!this.user) {
            try {
                await this.fetchUserProfile();
            } catch (error) {
                this.errorMessage = 'Erro ao carregar perfil do usuário. Tente novamente.';
            }
        }
    }
};
</script>

<style scoped>
.user-profile {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 20px;
}

.profile-img-container {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
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

.placeholder-img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #ddd;
    color: #666;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
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
    padding: 5px 10px; 
    cursor: pointer;
    font-size: 12px;
    width: 100px;
}

.error {
    color: red;
    margin-top: 10px;
}

.success {
    color: green;
    margin-top: 10px;
}

.logout-button {
    margin-top: auto;
    cursor: pointer;
    background-color: #2b2b2b;
    color: white;
    margin-bottom: 30px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 12px;
    width: 100px;
}

.logout-button:hover {
    background-color: #950000;
}
</style>
