<template>
    <div class="user-profile">
        <img :src="profileImage" alt="Profile Image" class="profile-img" />
        <h2>{{ username }}</h2>
        <p>{{ bio }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profileImage: 'https://via.placeholder.com/150',
            username: 'User Name',
            bio: 'Biografia curta do usuário.',
        };
    },
};
</script>

<style scoped>
.user-profile {
    text-align: center;
}
.profile-img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
}
</style>
