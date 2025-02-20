<template>
    <v-card elevation="3" class="pa-4" style="background-color: #BBDEFB;">
        <NotificationAlert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />

        <v-textarea
            v-model="tweetContent"
            label="Escreva suas ideias..."
            variant="solo"
            counter="280"
            auto-grow
            rows="3"
            class="mt-2"
        ></v-textarea>

        <v-btn
            block
            color="primary"
            class="mt-2"
            @click="handleCreateTweet"
            :loading="isPosting"
            :disabled="isLoading || !tweetContent.trim()"
        >
            {{ isPosting ? 'Enviando...' : isLoading ? 'Aguarde...' : 'Tweet' }}
        </v-btn>
    </v-card>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import NotificationAlert from '@/components/notificationAlert.vue';

export default {
    name: 'CreateTweet',
    components: {
        NotificationAlert,
    },
    data() {
        return {
            tweetContent: '', // Armazena o conteúdo do novo tweet
            isPosting: false, // Controle para mostrar a mensagem "Enviando..."
        };
    },
    computed: {
        ...mapState({
            isLoading: (state) => state.isLoading, // Controle de carregamento do Vuex
            notificationMessage: (state) => state.notificationMessage, // Mensagem de notificação do Vuex
            notificationType: (state) => state.notificationType, // Tipo de notificação do Vuex
        }),
    },
    methods: {
        ...mapActions(['createTweet']),
        ...mapMutations(['setNotification', 'clearNotification']),

        async handleCreateTweet() {
            this.clearNotification(); // Limpa notificações anteriores

            if (!this.tweetContent.trim()) {
                // Impede o envio se o conteúdo estiver vazio
                this.setNotification({
                    message: 'O conteúdo do tweet não pode estar vazio.',
                    type: 'error',
                });
                return;
            }

            // Mostra "Enviando..." no botão e espera 3 segundos antes de enviar o tweet
            this.isPosting = true;

            // Aguardar 3 segundos antes de chamar postTweet
            setTimeout(() => {
                this.isPosting = false;
                this.postTweet(); // Chama o método de postagem após o atraso
            }, 3000);
        },

        async postTweet() {
            try {
                // Chama a action para criar o tweet via Vuex
                await this.createTweet({ content: this.tweetContent.trim() });

                // Limpa o campo após o envio bem-sucedido
                this.tweetContent = '';
                this.setNotification({
                    message: 'Tweet postado com sucesso!',
                    type: 'success',
                });
            } catch (error) {
                this.setNotification({
                    message: 'Erro ao postar tweet. Tente novamente.',
                    type: 'error',
                });
                console.error('Erro ao postar tweet:', error);
            }
        },
    },
};
</script>