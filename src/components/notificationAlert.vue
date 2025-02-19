<template>
    <v-snackbar
        v-model="show"
        :color="type === 'error' ? 'red' : 'blue'"
        :timeout="5000"
        location="bottom center"
        class="text-center"
    >
        <div class="w-100 d-flex justify-center align-center">
            {{ message }}
        </div>
    </v-snackbar>
</template>


<script>
export default {
    props: {
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "success",
        },
    },
    data() {
        return {
            show: false,
        };
    },
    watch: {
        message: {
            immediate: true,
            handler(newMessage) {
                if (newMessage) {
                    this.show = true;
                    setTimeout(() => {
                        this.closeNotification();
                    }, 5000);
                }
            },
        },
    },
    methods: {
        closeNotification() {
            this.show = false;
            this.$emit("close");
        },
    },
};
</script>
