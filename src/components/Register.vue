<template>
    <div class="auth-container">
        <div class="budget-container">
            <h2 class="auth-title">Регистрация</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="username">Имя пользователя:</label>
                    <input class="form-control" type="text" id="username" v-model="username" required>
                </div>
                <div class="form-group">
                    <label for="email">Почта:</label>
                    <input class="form-control" type="email" id="email" v-model="email" required>
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
                <div class="form-group">
                    <label for="confirmPassword">Подтвердите пароль:</label>
                    <div class="input-group">
                        <input class="form-control" :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" required>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" @click="toggleConfirmPasswordVisibility">
                                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
            </form>
            <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'Register',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false
        };
    },
    methods: {
        ...mapActions(['register', 'login']),
        async handleRegister() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

            if (!emailPattern.test(this.email)) {
                this.showNotification('Неверный формат почты.', 'error');
                return;
            }

            if (!passwordPattern.test(this.password)) {
                this.showNotification('Пароль должен содержать минимум 8 символов, включая буквы, цифры и специальные символы.', 'error');
                return;
            }

            if (this.password !== this.confirmPassword) {
                this.showNotification('Пароли не совпадают.', 'error');
                return;
            }

            try {
                await this.register({ username: this.username, email: this.email, password: this.password });
                await this.login({ username: this.username, password: this.password });
                this.showNotification('Вы успешно зарегистрировались и вошли в систему.', 'success');
                this.$router.push('/');
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    this.showNotification('Пользователь с таким именем или почтой уже существует.', 'error');
                } else {
                    this.showNotification('Произошла ошибка при регистрации.', 'error');
                }
            }
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        toggleConfirmPasswordVisibility() {
            this.showConfirmPassword = !this.showConfirmPassword;
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
