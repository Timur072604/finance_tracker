<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#" @click.prevent="goToHome">Финансовый трекер</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item" v-if="!isAuthenticated">
                    <router-link to="/login" class="nav-link">Войти</router-link>
                </li>
                <li class="nav-item" v-else>
                    <router-link to="/profile" class="nav-link">{{ username }}</router-link>
                </li>
                <li class="nav-item" v-if="isAuthenticated">
                    <button class="btn btn-link nav-link" @click="handleLogout">Выйти</button>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Navbar',
    computed: {
        ...mapState(['isAuthenticated', 'username'])
    },
    methods: {
        ...mapActions(['logout']),
        goToHome() {
            this.$router.push('/');
        },
        handleLogout() {
            this.logout();
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.navbar {
    padding: 0.5rem 3rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.navbar-brand {
    font-weight: bold;
    color: #007bff !important;
    font-size: 1.5rem;
}
.navbar-toggler {
    border: none;
}
.navbar-nav .nav-item {
    margin: 0 0rem;
}
.nav-link {
    color: #333 !important;
    font-weight: 500;
}
.nav-link:hover {
    color: #007bff !important;
}
.btn-link {
    color: #333 !important;
    font-weight: 500;
}
.btn-link:hover {
    color: #007bff !important;
}
.navbar-nav .nav-item .btn-link:focus {
    outline: none;
    box-shadow: none;
}
</style>
