<template>
    <div class="tweet-feed">
        <notification-alert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />

        <!-- Seção de criação de tweet fixa no topo -->
        <div class="create-tweet">
            <textarea
                v-model="newTweetContent"
                placeholder="Escreva suas ideias..."
                rows="3"
            ></textarea>
            <button
                @click="handleCreateTweet"
                :disabled="isLoading || !newTweetContent"
            >
                {{ isLoading ? '...' : 'Postar' }}
            </button>
        </div>

        <!-- Lista de tweets com rolagem independente -->
        <div class="tweet-list">
            <TweetItem v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />
            <p v-if="isLoading && tweets.length === 0">Carregando tweets...</p>
        </div>
    </div>
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
            this.setNotification({ message: 'Erro ao carregar tweets.', type: 'error' });
        }
    },
    methods: {
        ...mapActions(['fetchTweets', 'createTweet']),
        ...mapMutations(['setNotification', 'clearNotification']),
        
        async handleCreateTweet() {
            if (!this.newTweetContent) return;

            this.clearNotification();

            try {
                await this.createTweet({ content: this.newTweetContent });
                this.newTweetContent = '';
                this.setNotification({ message: 'Tweet criado com sucesso!', type: 'success' });
            } catch (error) {
                this.setNotification({ message: 'Erro ao criar tweet.', type: 'error' });
            }
        },
    },
};
</script>

<style scoped>
/* Configuração da altura total e rolagem interna */
.tweet-feed {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
}

.create-tweet {
    padding: 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #ddd;
    position: sticky;
    top: 0;
    z-index: 1;
}

textarea {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    resize: none;
}

button {
    background-color: #1da1f2;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    width: 100px;
    margin-top: 10px;
}

button:disabled {
    background-color: #aaa;
}

.tweet-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}
</style>
