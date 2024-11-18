<template>
    <div class="tweet-feed">
        <notification-alert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />

        <div class="create-tweet">
            <textarea
                v-model="newTweetContent"
                placeholder="escreva suas ideias..."
                rows="3"
            ></textarea>
            <button
                @click="handleCreateTweet"
                :disabled="isLoading || !newTweetContent"
            >
                {{ isLoading ? '...' : 'tweetar' }}
            </button>
        </div>

        <TweetItem v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />

        <p v-if="isLoading && tweets.length === 0">Carregando tweets...</p>
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
.tweet-feed {
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 8px;
    min-height: 100%;
}
.create-tweet {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}
textarea {
    width: 60%;
    padding: 20px;
    border-radius: 8px;
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
</style>
