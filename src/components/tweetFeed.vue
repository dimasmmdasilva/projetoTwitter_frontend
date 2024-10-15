<template>
    <div class="tweet-feed">
        <!-- Formulário de criação de tweet -->
        <div class="create-tweet">
            <textarea
                v-model="newTweetContent"
                placeholder="What's happening?"
                rows="3"
            ></textarea>
            <button
                @click="createTweet"
                :disabled="isLoading || !newTweetContent"
            >
                {{ isLoading ? 'Posting...' : 'Tweet' }}
            </button>
        </div>

        <!-- Exibe a lista de tweets -->
        <TweetItem v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />

        <!-- Mensagens de erro e carregamento -->
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="isLoading && !newTweetContent">Loading tweets...</p>
    </div>
</template>

<script>
import TweetItem from './tweetItem.vue'; 
import api from '@/services/axiosConfig'; 

export default {
    name: 'TweetFeed',
    components: {
        TweetItem,
    },
    data() {
        return {
            tweets: [],
            newTweetContent: '',
            isLoading: false,
            errorMessage: null,
        };
    },
    async mounted() {
        this.fetchTweets();
    },
    methods: {
        async fetchTweets() {
            this.isLoading = true;
            this.errorMessage = null;
            try {
                const response = await api.get('/tweets/followers/');
                this.tweets = response.data;
            } catch (error) {
                this.errorMessage = 'Failed to load tweets.';
            } finally {
                this.isLoading = false;
            }
        },
        async createTweet() {
            if (!this.newTweetContent) return;
            this.isLoading = true;
            this.errorMessage = null;
            try {
                const response = await api.post('/tweets/', { content: this.newTweetContent });
                this.tweets.unshift(response.data);
                this.newTweetContent = '';
            } catch (error) {
                this.errorMessage = 'Failed to post tweet.';
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.tweet-feed {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}
.create-tweet {
    margin-bottom: 20px;
}
textarea {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
}
button {
    background-color: #1da1f2;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
}
button:disabled {
    background-color: #aaa;
}
.error {
    color: red;
    margin-top: 10px;
}
</style>
