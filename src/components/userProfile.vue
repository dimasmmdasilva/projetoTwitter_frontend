<template>
        <NotificationAlert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />
        <v-card 
        class="fill-height d-flex flex-column align-center" 
        elevation="3" 
        style="background-color: #BBDEFB;"
        >
            <v-avatar size="120" class="mb-4 mt-6" @click="triggerFileUpload" color="#90CAF9">
                <img
                    v-if="user?.profile_image_url"
                    :src="user.profile_image_url"
                    alt="Imagem de perfil"
                />
                <v-icon v-else size="60">mdi-account</v-icon>
            </v-avatar>
            <input type="file" ref="fileInput" class="d-none" @change="uploadImage" accept="image/*"/>
            <v-card-title class="text-center text-h6 font-weight-bold">
                {{ user?.username || 'Usuário não encontrado' }}
            </v-card-title>
            <v-card-subtitle class="text-center text-caption mb-3">
                {{ user?.followers_count || 0 }} seguidores
            </v-card-subtitle>
            <v-card-text>
                <p v-if="!isEditingBio" class="text-caption text-center font-italic">
                    "{{ user?.bio || 'Escreva sobre você' }}"
                </p>
                <v-textarea
                    v-if="isEditingBio"
                    v-model="newBio"
                    label="Biografia"
                    variant="solo"
                    counter="300"
                    auto-grow="false"
                    style="height: 200px; max-height: 200px; min-height: 100px; resize:none ; overflow-y: hidden;"
                ></v-textarea>
                <v-btn
                    v-if="!isEditingBio"
                    variant="outlined"
                    color="primary"
                    class="mt-2"
                    @click="editBio"
                    :disabled="isSaving"
                    size="small"
                    block
                >
                    Editar Biografia
                </v-btn>
                <div v-if="isEditingBio" class="d-flex justify-space-between mt-2">
                    <v-btn color="#90CAF9" @click="confirmEditBio" :loading="isSaving" size="small">
                        Confirmar
                    </v-btn>
                    <v-btn color="#EF9A9A" @click="cancelEditBio" size="small">
                        Cancelar
                    </v-btn>
                </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mt-auto">
                <v-btn color="#FFEBEE" @click="handleLogout" size="small" style="background-color: #E53935;">
                    Sair
                </v-btn>
            </v-card-actions>
        </v-card>
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
        ...mapActions([
            'updateProfileImage',
            'updateBio',
            'fetchUserProfile',
            'logout',
        ]),
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
                    await this.fetchUserProfile();
                    this.setNotification({
                        message: 'Imagem de perfil atualizada com sucesso!',
                        type: 'success',
                    });
                } catch (error) {
                    console.error('Erro ao atualizar a imagem de perfil:', error);
                    this.setNotification({
                        message: 'Erro ao atualizar a imagem. Tente novamente.',
                        type: 'error',
                    });
                } finally {
                    this.isSaving = false;
                }
            } else {
                this.setNotification({
                    message: 'O arquivo deve ser menor que 2MB.',
                    type: 'error',
                });
            }
        },
        editBio() {
            this.isEditingBio = true;
            this.newBio = this.user?.bio || '';
        },
        async confirmEditBio() {
            if (this.newBio.length > 300) {
                this.setNotification({
                    message: 'A biografia não pode ter mais de 300 caracteres.',
                    type: 'error',
                });
                return;
            }
            this.isSaving = true;
            this.clearNotification();

            try {
                await this.updateBio({ bio: this.newBio });
                this.setNotification({
                    message: 'Biografia atualizada com sucesso!',
                    type: 'success',
                });
                this.isEditingBio = false;
                await this.fetchUserProfile();
            } catch (error) {
                this.setNotification({
                    message: 'Erro ao atualizar biografia. Tente novamente.',
                    type: 'error',
                });
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
    },
    async created() {
        if (!this.user) {
            try {
                await this.fetchUserProfile();
            } catch (error) {
                this.setNotification({
                    message: 'Erro ao carregar perfil do usuário. Tente novamente.',
                    type: 'error',
                });
            }
        }
    },
};
</script>
