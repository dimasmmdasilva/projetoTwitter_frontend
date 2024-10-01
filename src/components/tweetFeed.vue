<template>
    <div class="tweet-feed">
        <TweetItem v-for="tweet in tweets" :key="tweet.id" :tweet="tweet" />
    </div>
</template>

<script>
import TweetItem from './tweetItem.vue';

export default {
    components: {
        TweetItem,
    },
    data() {
        return {
            tweets: [
                {
                    id: 1,
                    username: 'User1',
                    content: 'Este é um tweet de exemplo',
                    date: '2024-01-01',
                },
                {
                    id: 2,
                    username: 'User2',
                    content: 'Outro exemplo de tweet',
                    date: '2024-01-02',
                },
            ],
        };
    },
};
</script>

<style scoped>
.tweet-feed {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}
</style>
