<template>
    <div id="app">
        <Notification ref="notification" />
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import Notification from './components/Notification.vue';

export default {
    name: 'App',
    components: {
        Notification
    },
    provide() {
        return {
            showNotification: this.showNotification
        };
    },
    methods: {
        showNotification(message, type) {
            this.$refs.notification.showNotification(message, type);
        }
    },
    created() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth) {
            this.$store.commit('setAuthentication', auth);
        }
    }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
