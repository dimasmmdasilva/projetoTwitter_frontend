<template>
    <div class="create-tweet">
        <textarea
            v-model="tweetContent"
            placeholder="What's happening?"
            maxlength="280"
            rows="3"
        ></textarea>
        <button
            @click="postTweet"
            :disabled="isLoading || !tweetContent.trim()"
        >
            {{ isLoading ? 'Enviando...' : 'Tweet' }}
        </button>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'CreateTweet',
    data() {
        return {
            tweetContent: '', // Armazena o conteúdo do novo tweet
        };
    },
    computed: {
        ...mapState({
            isLoading: (state) => state.isLoading, // Controle de carregamento do Vuex
            errorMessage: (state) => state.errorMessage, // Mensagem de erro do Vuex
            successMessage: (state) => state.successMessage, // Mensagem de sucesso do Vuex
        }),
    },
    methods: {
        ...mapActions(['createTweet']),
        async postTweet() {
            if (!this.tweetContent.trim()) {
                // Impede o envio se o conteúdo estiver vazio
                this.$store.commit('setErrorMessage', 'Tweet content cannot be empty.');
                return;
            }

            try {
                // Chama a action para criar o tweet via Vuex
                await this.createTweet({ content: this.tweetContent.trim() });

                // Limpa o campo após o envio bem-sucedido
                this.tweetContent = '';
                this.$store.commit('setSuccessMessage', 'Tweet posted successfully!');
            } catch (error) {
                // Mensagem de erro já é gerenciada pelo Vuex
                console.error('Error posting tweet:', error);
            }
        },
    },
    watch: {
        // Limpa as mensagens de sucesso e erro após 3 segundos
        successMessage(newVal) {
            if (newVal) {
                setTimeout(() => {
                    this.$store.commit('setSuccessMessage', null);
                }, 3000);
            }
        },
        errorMessage(newVal) {
            if (newVal) {
                setTimeout(() => {
                    this.$store.commit('setErrorMessage', null);
                }, 3000);
            }
        },
    },
};
</script>

<style scoped>
.create-tweet {
    margin-bottom: 20px;
}
textarea {
    width: 70%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    resize: none;
}
button {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #1da1f2;
    color: white;
    border-radius: 8px;
    cursor: pointer;
}
button:disabled {
    background-color: #aaa;
}
.error {
    color: red;
    margin-top: 10px;
}
.success {
    color: green;
    margin-top: 10px;
}
</style>
