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
import TweetItem from './tweetItem.vue'; // Importação do componente TweetItem
import api from '@/services/axiosConfig'; // Importação do Axios configurado

export default {
    name: 'TweetFeed',
    components: {
        TweetItem, // Registro do componente TweetItem
    },
    data() {
        return {
            tweets: [], // Tweets carregados da API
            newTweetContent: '', // Conteúdo do novo tweet
            isLoading: false, // Controle de carregamento
            errorMessage: null, // Mensagem de erro
        };
    },
    async mounted() {
        this.fetchTweets(); // Carrega os tweets ao montar o componente
    },
    methods: {
        async fetchTweets() {
            this.isLoading = true;
            this.errorMessage = null;
            try {
                const response = await api.get('/tweets/followers/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                this.tweets = response.data; // Armazena os tweets carregados
            } catch (error) {
                this.errorMessage = 'Failed to load tweets.';
            } finally {
                this.isLoading = false;
            }
        },
        async createTweet() {
            // Função para criar um novo tweet
            if (!this.newTweetContent) return;
            this.isLoading = true;
            this.errorMessage = null;
            try {
                const response = await api.post(
                    '/tweets/',
                    { content: this.newTweetContent },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    },
                );
                this.tweets.unshift(response.data); // Adiciona o novo tweet ao topo do feed
                this.newTweetContent = ''; // Limpa o campo de texto
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
