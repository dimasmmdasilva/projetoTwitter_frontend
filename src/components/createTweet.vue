<template>
    <div class="create-tweet">
        <textarea
            v-model="tweetContent"
            placeholder="What's happening?"
            maxlength="280"
            rows="3"
        ></textarea>
        <button
            @click="postTweet"
            :disabled="isPosting || !tweetContent.trim()"
        >
            {{ isPosting ? 'Posting...' : 'Tweet' }}
        </button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script>
import api from '@/services/axiosConfig';

export default {
    name: 'CreateTweet',
    data() {
        return {
            tweetContent: '',
            isPosting: false, // Controle de estado de postagem
            errorMessage: null, // Mensagem de erro
        };
    },
    methods: {
        async postTweet() {
            // Impede o envio se o conteúdo estiver vazio
            if (!this.tweetContent.trim()) {
                this.errorMessage = 'Tweet content cannot be empty.';
                return;
            }

            this.isPosting = true;
            this.errorMessage = null;

            try {
                // Faz a requisição POST para a API de tweets
                const response = await api.post('/tweets/', {
                    content: this.tweetContent.trim(),
                });

                // Limpa o campo após o envio bem-sucedido
                this.tweetContent = '';

                // Atualiza o feed de tweets (comunicação com o componente pai)
                this.$emit('tweet-posted', response.data);
            } catch (error) {
                // Tratamento de erro
                if (error.response) {
                    this.errorMessage =
                        error.response.data?.detail ||
                        'Failed to post the tweet. Please try again.';
                } else {
                    this.errorMessage =
                        'Failed to post the tweet. Please check your internet connection.';
                }
            } finally {
                this.isPosting = false;
            }
        },
    },
};
</script>

<style scoped>
.create-tweet {
    margin-bottom: 20px;
}
textarea {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    resize: none;
}
button {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #1da1f2;
    color: white;
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
