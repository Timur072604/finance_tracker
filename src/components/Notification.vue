<template>
    <transition name="fade">
        <div v-if="message" class="notification" :class="type">
            {{ message }}
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Notification',
    data() {
        return {
            message: '',
            type: ''
        };
    },
    methods: {
        showNotification(message, type) {
            this.message = message;
            this.type = type;
            setTimeout(() => {
                this.message = '';
                this.type = '';
            }, 2000);
        }
    }
};
</script>

<style scoped>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    border-radius: 5px;
    color: white;
    z-index: 10000;
    opacity: 1;
}
.notification.error {
    background-color: red;
}
.notification.success {
    background-color: green;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
