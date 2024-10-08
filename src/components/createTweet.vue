<template>
    <div class="create-tweet">
        <textarea
            v-model="tweetContent"
            placeholder="What's happening?"
            maxlength="280"
            rows="3"
        ></textarea>
        <button @click="postTweet" :disabled="isPosting || tweetContent === ''">
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
            isPosting: false,
            errorMessage: null,
        };
    },
    methods: {
        async postTweet() {
            this.isPosting = true;
            this.errorMessage = null;

            try {
                // Faz a requisição POST para a API de tweets
                await api.post(
                    '/tweets/',
                    {
                        content: this.tweetContent,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    },
                );

                // Limpa o campo após o envio
                this.tweetContent = '';

                // Atualiza o feed de tweets (comunicação com o componente pai)
                this.$emit('tweet-posted');
            } catch (error) {
                this.errorMessage = 'Failed to post the tweet.';
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
.error {
    color: red;
    margin-top: 10px;
}
</style>
