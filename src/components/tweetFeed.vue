<template>
    <div class="tweet-feed">
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

        <TweetItem v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="isLoading && tweets.length === 0">Carregando tweets...</p>
    </div>
</template>

<script>
import TweetItem from './tweetItem.vue';
import { mapActions, mapState } from 'vuex';

export default {
    name: 'TweetFeed',
    components: {
        TweetItem,
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
            errorMessage: (state) => state.errorMessage,
        }),
    },
    async mounted() {
        try {
            await this.fetchTweets();
        } catch (error) {
            this.$store.commit('setErrorMessage', 'Erro ao carregar tweets.');
        }
    },
    methods: {
        ...mapActions(['fetchTweets', 'createTweet']),
        
        async handleCreateTweet() {
            if (!this.newTweetContent) return;

            try {
                await this.createTweet({ content: this.newTweetContent });
                this.newTweetContent = '';
            } catch (error) {
                this.$store.commit('setErrorMessage', 'Erro ao criar tweet.');
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
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}
textarea {
    width: 60%;
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
.error {
    color: red;
    margin-top: 10px;
}
</style>
