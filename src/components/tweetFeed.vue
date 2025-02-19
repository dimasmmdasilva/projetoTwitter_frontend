<template>
    <v-container class="d-flex flex-column align-center">
        <NotificationAlert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />

        <v-card width="100%" max-width="800px" elevation="3" class="pa-4">
            <v-card-title class="text-center text-h6 font-weight-bold">
                Novo Tweet
            </v-card-title>

            <v-card-text>
                <v-textarea
                    v-model="newTweetContent"
                    label="Escreva suas ideias..."
                    variant="outlined"
                    auto-grow="false"
                    rows="3"
                    counter="280"
                ></v-textarea>

                <v-btn
                    color="primary"
                    :disabled="isLoading || !newTweetContent"
                    class="mt-2"
                    style="width: 30%;"
                    @click="handleCreateTweet"
                >
                    {{ isLoading ? 'Enviando...' : 'Tweetar' }}
                </v-btn>
            </v-card-text>
        </v-card>

        <v-divider class="my-4"></v-divider>

        <v-list width="100%" max-width="600px">
            <TweetItem v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />
        </v-list>

        <p v-if="isLoading && tweets.length === 0" class="text-center mt-4">
            Carregando tweets...
        </p>
    </v-container>
</template>


<script>
import TweetItem from './tweetItem.vue';
import NotificationAlert from '@/components/notificationAlert.vue';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
    name: 'TweetFeed',
    components: {
        TweetItem,
        NotificationAlert,
    },
    data() {
        return {
            newTweetContent: '',
        };
    },
    computed: {
        ...mapState({
            tweets: (state) => state.tweets,
            isLoading: (state) => state.isLoading,
            notificationMessage: (state) => state.notificationMessage,
            notificationType: (state) => state.notificationType,
        }),
    },
    async mounted() {
        try {
            await this.fetchTweets();
        } catch (error) {
            this.setNotification({
                message: 'Erro ao carregar tweets.',
                type: 'error',
            });
        }
    },
    methods: {
        ...mapActions(['fetchTweets', 'createTweet']),
        ...mapMutations(['setNotification', 'clearNotification']),

        async handleCreateTweet() {
            if (!this.newTweetContent.trim()) return;

            this.clearNotification();

            try {
                await this.createTweet({ content: this.newTweetContent.trim() });
                this.newTweetContent = '';
                this.setNotification({
                    message: 'Tweet criado com sucesso!',
                    type: 'success',
                });
            } catch (error) {
                this.setNotification({
                    message: 'Erro ao criar tweet.',
                    type: 'error',
                });
            }
        },
    },
};
</script>