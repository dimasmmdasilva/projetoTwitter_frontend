<template>
    <v-card class="mb-3 pa-3" elevation="2" max-width="600">
        <v-card-title class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
                <v-avatar color="primary" size="40">
                    <v-icon v-if="!tweet.author_image">mdi-account</v-icon>
                    <img v-else :src="tweet.author_image" alt="Avatar do autor">
                </v-avatar>
                <div class="ml-3">
                    <h3 class="text-subtitle-1 font-weight-bold">{{ tweet.author }}</h3>
                    <small class="text-caption text-grey-darken-1">{{ formatDate(tweet.created_at) }}</small>
                </div>
            </div>

            <v-btn 
                v-if="isAuthor"
                icon
                color="red"
                @click="handleDeleteTweet"
                size="small"
            >
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-card-title>

        <v-card-text class="text-body-1">
            {{ tweet.content }}
        </v-card-text>
    </v-card>
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
