<template>
    <div class="tweet-item">
        <h3>{{ tweet.author.username }}</h3>
        <p>{{ tweet.content }}</p>
        <small>{{ formatDate(tweet.created_at) }}</small>

        <!-- Botão de Exclusão -->
        <div class="tweet-actions">
            <!-- Mostrar botão de exclusão apenas se o autor for o usuário autenticado -->
            <button v-if="isAuthor" @click="deleteTweet" class="delete-btn">
                Delete
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: ['tweet'],
    computed: {
        ...mapGetters(['getUser']),
        isAuthor() {
            // Verifica se o usuário autenticado é o autor do tweet
            return this.tweet.author.username === this.getUser.username;
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
        async deleteTweet() {
            // Confirmação antes de deletar o tweet
            if (confirm('Tem certeza de que deseja excluir este tweet?')) {
                try {
                    await this.deleteTweet(this.tweet.id); // Exclui o tweet via Vuex
                    this.$emit('tweet-deleted', this.tweet.id); // Emite evento para o componente pai
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

.tweet-actions {
    display: flex;
    align-items: center;
    margin-top: 5px;
}

.delete-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.delete-btn:hover {
    background-color: darkred;
}
</style>
