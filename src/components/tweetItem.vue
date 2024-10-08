<template>
    <div class="tweet-item">
        <h3>{{ tweet.author.username }}</h3>
        <!-- Usando o nome do autor do tweet -->
        <p>{{ tweet.content }}</p>
        <small>{{ formatDate(tweet.created_at) }}</small>
        <!-- Formatando a data de criação do tweet -->
    </div>
</template>

<script>
export default {
    props: ['tweet'],
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
    },
};
</script>

<style scoped>
.tweet-item {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}
</style>
