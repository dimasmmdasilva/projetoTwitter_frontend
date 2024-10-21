<template>
    <div class="tweet-item">
        <h3>{{ tweet.author.username }}</h3>
        <p>{{ tweet.content }}</p>
        <small>{{ formatDate(tweet.created_at) }}</small>
        <button @click="likeTweet">{{ isLiked ? 'Unlike' : 'Like' }}</button>
        <p>Likes: {{ likesCount }}</p>
    </div>
</template>

<script>
export default {
    props: ['tweet'],
    data() {
        return {
            isLiked: this.tweet.is_liked_by_user, // Cria uma variável local para armazenar o estado de like
            likesCount: this.tweet.likes_count // Armazena a contagem de likes localmente
        };
    },
    methods: {
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
        async likeTweet() {
            try {
                if (this.isLiked) {
                    // Descurtir o tweet
                    await this.$emit('unlike', this.tweet.id);
                    this.likesCount--; // Atualiza a contagem de likes localmente
                } else {
                    // Curtir o tweet
                    await this.$emit('like', this.tweet.id);
                    this.likesCount++; // Atualiza a contagem de likes localmente
                }
                this.isLiked = !this.isLiked; // Alterna o estado de curtida
            } catch (error) {
                console.error('Erro ao curtir/descurtir o tweet:', error);
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
</style>
