<template>
    <div class="container">
        <div class="sidebar">
            <UserProfile />
        </div>
        <div class="main-content">
            <TweetFeed />
        </div>
    </div>
</template>

<script>
import UserProfile from '@/components/userProfile.vue';
import TweetFeed from '@/components/tweetFeed.vue';

export default {
    name: 'UserDashboard',
    components: {
        UserProfile,
        TweetFeed,
    },
};
</script>

<style>
.container {
    display: flex;
    height: 100vh;
}
.sidebar {
    width: 30%;
    background-color: #f5f5f5;
    padding: 20px;
}
.main-content {
    width: 70%;
    padding: 20px;
}
</style>
