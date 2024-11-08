<template>
    <div v-if="message" :class="['notification', type]" @click="closeNotification">
        {{ message }}
    </div>
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
            default: 'success',
        },
    },
    methods: {
        closeNotification() {
            this.$emit('close');
        },
    },
    watch: {
        message() {
            if (this.message) {
                setTimeout(() => {
                    this.closeNotification();
                }, 5000);
            }
        },
    },
};
</script>

<style scoped>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
.notification.success {
    background-color: #65afff;
}
.notification.error {
    background-color: #ff675c;
}
</style>
