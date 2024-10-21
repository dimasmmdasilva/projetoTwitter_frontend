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
        <p v-if="isLoading && tweets.length === 0">Loading tweets...</p>
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
            tweets: [], // Armazena os tweets
            newTweetContent: '', // Armazena o conteúdo do novo tweet
            isLoading: false, // Controle de carregamento
            errorMessage: null, // Mensagem de erro
        };
    },
    async mounted() {
        this.fetchTweets(); // Carregar os tweets ao montar o componente
    },
    methods: {
        async fetchTweets() {
            this.isLoading = true; // Inicia o estado de carregamento
            this.errorMessage = null; // Limpa mensagens de erro

            try {
                const response = await api.get('/tweets/followers/'); // Requisição para obter tweets
                this.tweets = response.data;
            } catch (error) {
                if (error.response) {
                    this.errorMessage = 'Erro ao carregar os tweets: ' + (error.response.data?.detail || 'Tente novamente mais tarde.');
                } else {
                    this.errorMessage = 'Erro de conexão. Verifique sua internet.';
                }
            } finally {
                this.isLoading = false; // Finaliza o estado de carregamento
            }
        },
        async createTweet() {
            if (!this.newTweetContent) return;

            this.isLoading = true; // Inicia o estado de carregamento
            this.errorMessage = null; // Limpa mensagens de erro

            try {
                const response = await api.post('/tweets/', { content: this.newTweetContent }); // Requisição para criar tweet
                this.tweets.unshift(response.data); // Adiciona o novo tweet ao início da lista
                this.newTweetContent = ''; // Limpa o campo de criação de tweet
            } catch (error) {
                if (error.response) {
                    this.errorMessage = 'Erro ao postar o tweet: ' + (error.response.data?.detail || 'Tente novamente mais tarde.');
                } else {
                    this.errorMessage = 'Erro de conexão. Verifique sua internet.';
                }
            } finally {
                this.isLoading = false; // Finaliza o estado de carregamento
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
