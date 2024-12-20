<template>
    <div class="auth-container">
        <div class="budget-container">
            <h2 class="auth-title">Вход</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">Имя пользователя:</label>
                    <input class="form-control" type="text" id="username" v-model="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Пароль:</label>
                    <div class="input-group">
                        <input class="form-control" :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
                                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Войти</button>
            </form>
            <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            showPassword: false
        };
    },
    methods: {
        ...mapActions(['login']),
        async handleLogin() {
            try {
                await this.login({ username: this.username, password: this.password });
                this.showNotification('Вы успешно вошли в систему.', 'success');
                this.$router.push('/');
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.showNotification('Неверное имя пользователя или пароль.', 'error');
                } else {
                    this.showNotification('Произошла ошибка при входе в систему.', 'error');
                }
            }
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        }
    },
    inject: ['showNotification']
};
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85vh;
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
</style>
