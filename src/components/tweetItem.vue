<template>
    <div class="tweet-item">
        <div class="tweet-header">
            <h3>{{ tweet.author }}</h3> <!-- Exibe o nome do autor diretamente -->
            <small>{{ formatDate(tweet.created_at) }}</small> <!-- Exibe a data formatada -->
            <button v-if="isAuthor" @click="handleDeleteTweet" class="delete-btn" title="Deletar Tweet">
                🗑️ 
            </button>
        </div>
        <p>{{ tweet.content }}</p>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: ['tweet'],
    computed: {
        ...mapGetters(['getUser']),
        isAuthor() {
            return this.tweet.author === this.getUser.username;
        },
    },
    methods: {
        ...mapActions(['deleteTweet']),
        formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(date).toLocaleDateString(undefined, options);
        },
        async handleDeleteTweet() {
            if (confirm('seu tweet será excluído...')) {
                try {
                    // Chama a action deleteTweet passando o ID do tweet
                    await this.deleteTweet({ tweetId: this.tweet.id });
                    // Emite um evento para informar o componente pai sobre a exclusão
                    this.$emit('tweet-deleted', this.tweet.id);
                } catch (error) {
                    console.error('Erro ao excluir o tweet:', error);
                }
            }
        },
    },
};
</script>


<style scoped>
.tweet-item {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.tweet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.delete-btn {
    background: transparent;
    border: none;
    font-size: 1rem;
    color: red;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
}

.delete-btn:hover {
    color: darkred;
}
</style>
