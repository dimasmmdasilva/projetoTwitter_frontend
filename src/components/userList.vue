<template>
    <v-card
        class="fill-height pa-4 d-flex flex-column align-center"
        width="100%"
        elevation="3"
        style="background-color: #BBDEFB;"
    >
        <v-card-text class="w-100">
            <v-alert
                v-if="errorMessage"
                type="error"
                class="mb-2"
                prominent
                dense
            >
                {{ errorMessage }}
            </v-alert>
            <v-list v-else-if="filteredUsers.length" class="w-100">
                <v-list-item v-for="user in filteredUsers" :key="user.id">
                    <v-avatar size="40" class="mr-3">
                        <img :src="user.profile_image_url" alt="Profile" />
                    </v-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                            {{ user.username }}
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-btn
                        :color="user.is_following ? 'red' : 'primary'"
                        size="small"
                        @click="toggleFollow(user)"
                        depressed
                    >
                        {{ user.is_following ? 'Deixar de seguir' : 'Seguir' }}
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>



<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
    name: 'UserList',
    computed: {
        ...mapState({
            isLoading: (state) => state.isLoading,
            errorMessage: (state) => state.errorMessage,
        }),
        ...mapGetters(['getUsers', 'getUser']),

        filteredUsers() {
            return this.getUsers.filter((user) => user.id !== this.getUser.id);
        },
    },
    async mounted() {
        try {
            await this.loadUsers();
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            this.$store.commit(
                'setErrorMessage',
                'Erro ao carregar a lista de usuários.',
            );
        }
    },
    methods: {
        ...mapActions(['loadUsers', 'followUser', 'unfollowUser']),

        async toggleFollow(user) {
            if (user.is_following) {
                await this.unfollowUser(user.id);
            } else {
                await this.followUser(user.id);
            }
            await this.loadUsers();
        },
    },
};
</script>
