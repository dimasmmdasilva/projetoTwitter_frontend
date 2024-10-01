<template>
    <div class="tweet-item">
        <h3>{{ tweet.username }}</h3>
        <p>{{ tweet.content }}</p>
        <small>{{ tweet.date }}</small>
    </div>
</template>

<script>
export default {
    props: ['tweet'],
};
</script>

<style scoped>
.tweet-item {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}
</style>
