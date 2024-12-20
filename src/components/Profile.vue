<template>
    <div>
        <Navbar />
        <div class="auth-container">
            <div class="budget-container">
                <h2 class="auth-title">Профиль пользователя</h2>
                <form @submit.prevent="updateProfile">
                    <div class="form-group">
                        <label for="username">Имя пользователя:</label>
                        <input class="form-control" type="text" id="username" v-model="newUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Почта:</label>
                        <input class="form-control" type="email" id="email" v-model="newEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="newPassword">Новый пароль:</label>
                        <div class="input-group">
                            <input class="form-control" :type="showNewPassword ? 'text' : 'password'" id="newPassword" v-model="newPassword">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" @click="toggleNewPasswordVisibility">
                                    <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Подтвердите новый пароль:</label>
                        <div class="input-group">
                            <input class="form-control" :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" @click="toggleConfirmPasswordVisibility">
                                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="button-container">
                        <button type="submit" class="btn btn-primary">Обновить профиль</button>
                        <button type="button" class="btn btn-danger" @click="openDeleteProfileModal">Удалить профиль</button>
                    </div>
                </form>
            </div>
        </div>
        <DeleteProfileModal />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Navbar from './Navbar.vue';
import DeleteProfileModal from './DeleteProfileModal.vue';

export default {
    name: 'Profile',
    components: {
        Navbar,
        DeleteProfileModal
    },
    data() {
        return {
            newUsername: this.$store.state.username || '',
            newEmail: this.$store.state.email || '',
            newPassword: '',
            confirmPassword: '',
            showNewPassword: false,
            showConfirmPassword: false
        };
    },
    computed: {
        ...mapState(['username', 'email'])
    },
    methods: {
        ...mapActions(['logout', 'updateUser', 'deleteProfile']),
        handleLogout() {
            this.logout();
            this.showNotification('Вы успешно вышли из системы.', 'success');
            this.$router.push('/login');
        },
        toggleNewPasswordVisibility() {
            this.showNewPassword = !this.showNewPassword;
        },
        toggleConfirmPasswordVisibility() {
            this.showConfirmPassword = !this.showConfirmPassword;
        },
        updateProfile() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

            if (!emailPattern.test(this.newEmail)) {
                this.showNotification('Неверный формат почты.', 'error');
                return;
            }

            if (this.newPassword && !passwordPattern.test(this.newPassword)) {
                this.showNotification('Пароль должен содержать минимум 8 символов, включая буквы, цифры и специальные символы.', 'error');
                return;
            }

            if (this.newPassword !== this.confirmPassword) {
                this.showNotification('Пароли не совпадают.', 'error');
                return;
            }

            this.updateUser({
                username: this.newUsername,
                email: this.newEmail,
                newPassword: this.newPassword || null
            });
            this.showNotification('Профиль успешно обновлен.', 'success');
        },
        openDeleteProfileModal() {
            $('#deleteProfileModal').modal('show');
        },
        confirmDeleteProfile() {
            this.deleteProfile();
            this.showNotification('Ваш профиль успешно удален.', 'success');
            this.$router.push('/login');
            $('#deleteProfileModal').modal('hide');
        }
    },
    inject: ['showNotification']
};
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
}
.budget-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px;
    width: 100%;
    max-width: 400px;
}
.auth-title {
    background-color: #f0f0f0;
    padding: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-top: -20px;
    margin-left: -20px;
    margin-right: -20px;
    font-size: 1.2em;
}
.input-group {
    display: flex;
    align-items: center;
}
.input-group-append {
    margin-left: -1px;
}
.btn-outline-secondary {
    border-color: #ced4da;
    background-color: #fff;
    color: #495057;
}
.btn-outline-secondary:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
}
.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.button-container .btn:not(:last-child) {
    margin-right: 10px;
}
</style>
