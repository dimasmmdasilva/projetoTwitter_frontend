<template>
    <div class="user-profile">
        <notification-alert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />

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

        <div class="bio-container">
            <p v-if="!isEditingBio" class="bio-text">{{ user?.bio || 'Escreva sobre você' }}</p>
            <div v-if="isEditingBio">
                <textarea v-model="newBio" maxlength="300"></textarea>
                <div class="buttons">
                    <button @click="confirmEditBio" :disabled="isSaving">Confirmar</button>
                    <button @click="cancelEditBio">Cancelar</button>
                </div>
            </div>
            <button v-if="!isEditingBio" @click="editBio" :disabled="isSaving">
                Biografia
            </button>
        </div>

        <button class="logout-button" @click="handleLogout">Sair</button>
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import NotificationAlert from '@/components/notificationAlert.vue';

export default {
    components: {
        NotificationAlert,
    },
    data() {
        return {
            newBio: '',
            isEditingBio: false,
            isSaving: false,
        };
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
            notificationMessage: (state) => state.notificationMessage,
            notificationType: (state) => state.notificationType,
        }),
    },
    methods: {
        ...mapActions(['updateProfileImage', 'updateBio', 'fetchUserProfile', 'logout']),
        ...mapMutations(['setNotification', 'clearNotification']),

        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        async uploadImage(event) {
            const file = event.target.files[0];
            if (file && file.size <= 2 * 1024 * 1024) {
                const formData = new FormData();
                formData.append('profile_image', file);
                this.isSaving = true;
                this.clearNotification();

                try {
                    await this.updateProfileImage(formData);
                    await this.fetchUserProfile();  // Atualiza o perfil do usuário para exibir a nova imagem
                    this.setNotification({ message: 'Imagem de perfil atualizada com sucesso!', type: 'success' });
                } catch (error) {
                    console.error("Erro ao atualizar a imagem de perfil:", error);
                    this.setNotification({ message: 'Erro ao atualizar a imagem. Tente novamente.', type: 'error' });
                } finally {
                    this.isSaving = false;
                }
            } else {
                this.setNotification({ message: 'O arquivo deve ser menor que 2MB.', type: 'error' });
            }
        },
        editBio() {
            this.isEditingBio = true;
            this.newBio = this.user?.bio || '';
        },
        async confirmEditBio() {
            if (this.newBio.length > 300) {
                this.setNotification({ message: 'A biografia não pode ter mais de 300 caracteres.', type: 'error' });
                return;
            }
            this.isSaving = true;
            this.clearNotification();

            try {
                await this.updateBio({ bio: this.newBio });
                this.setNotification({ message: 'Biografia atualizada com sucesso!', type: 'success' });
                this.isEditingBio = false;
                await this.fetchUserProfile();
            } catch (error) {
                this.setNotification({ message: 'Erro ao atualizar biografia. Tente novamente.', type: 'error' });
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
        }
    },
    async created() {
        if (!this.user) {
            try {
                await this.fetchUserProfile();
            } catch (error) {
                this.setNotification({ message: 'Erro ao carregar perfil do usuário. Tente novamente.', type: 'error' });
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
    height: 100vh; /* Garante que ocupe a altura total da coluna */
    padding: 20px;
    box-sizing: border-box; /* Garante que padding não adicione overflow */
}

.profile-img-container {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.profile-img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
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

.bio-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    margin-top: 20px;
}

.logout-button {
    margin-top: auto;
    cursor: pointer;
    background-color: #2b2b2b;
    color: white;
    margin-bottom: 30px; /* Distância de 30px do limite inferior */
    padding: 5px 10px;
    font-size: 10px;
    width: 100px;
    align-self: center;
}

.logout-button:hover {
    background-color: #cc0000;
}
</style>
