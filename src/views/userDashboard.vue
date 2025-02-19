<template>
    <v-container fluid class="fill-height pa-0 ma-0" style="height: 100vh; overflow: hidden;">
        <NotificationAlert
            v-if="notificationMessage"
            :message="notificationMessage"
            :type="notificationType"
            @close="clearNotification"
        />
        <v-row class="fill-height d-flex justify-center no-gutters">
            <v-col cols="12" md="3" lg="3" class="pa-1">
                <v-sheet class="fill-height" color="white">
                    <UserProfile :userProfile="user" />
                </v-sheet>
            </v-col>
            <v-col cols="12" md="7" lg="7" class="pa-1">
                <v-sheet class="fill-height" color="white" elevation="3">
                    <TweetFeed />
                </v-sheet>
            </v-col>
            <v-col cols="12" md="2" lg="2" class="pa-1">
                <v-sheet class="fill-height" color="white">
                    <UserList />
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import UserProfile from '@/components/userProfile.vue';
import TweetFeed from '@/components/tweetFeed.vue';
import UserList from '@/components/userList.vue';
import NotificationAlert from '@/components/notificationAlert.vue';
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
    name: 'UserDashboard',
    components: {
        UserProfile,
        TweetFeed,
        UserList,
        NotificationAlert,
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
            isLoading: (state) => state.isLoading,
            isAuthenticated: (state) => state.isAuthenticated,
            notificationMessage: (state) => state.notificationMessage,
            notificationType: (state) => state.notificationType,
        }),
    },
    watch: {
        isAuthenticated(isAuth) {
            if (isAuth) {
                this.loadUserProfile();
            } else {
                this.$router.push('/login');
            }
        },
    },
    methods: {
        ...mapActions(['fetchUserProfile', 'logout']),
        ...mapMutations(['clearNotification', 'setNotification']),

        async loadUserProfile() {
            try {
                await this.fetchUserProfile();
                this.setNotification({
                    message: 'Perfil do usuário carregado com sucesso.',
                    type: 'success',
                });
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
                this.setNotification({
                    message: 'Erro ao carregar perfil. Faça login novamente.',
                    type: 'error',
                });
                await this.handleLogout();
            }
        },

        async handleLogout() {
            await this.logout();
            this.$router.push('/login');
        },
    },
};
</script>
