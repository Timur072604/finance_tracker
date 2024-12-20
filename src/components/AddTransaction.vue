<template>
    <div class="add-transaction-container">
        <form @submit.prevent="handleAddTransaction">
            <div class="form-group">
                <label for="transactionDate">Дата транзакции:</label>
                <input class="form-control" type="date" id="transactionDate" v-model="transactionDate">
            </div>
            <div class="form-group">
                <label for="transactionTitle">Название транзакции:</label>
                <input class="form-control" type="text" id="transactionTitle" v-model="transactionTitle">
            </div>
            <div class="form-group">
                <label for="amount">Сумма:</label>
                <input class="form-control" type="text" id="amount" v-model="amount">
            </div>
            <div class="form-group">
                <label for="transactionType">Тип транзакции:</label>
                <select class="form-control" id="transactionType" v-model="transactionType">
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                </select>
            </div>
            <div class="form-group">
                <label for="transactionCategory">Категория:</label>
                <select class="form-control" id="transactionCategory" v-model="transactionCategory">
                    <option value="">Без категории</option>
                    <option v-for="category in categories" :key="category.name" :value="category.name">{{ category.name }}</option>
                </select>
            </div>
            <button class="btn btn-primary form-control">Добавить транзакцию</button>
        </form>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'AddTransaction',
    data() {
        return {
            transactionDate: '',
            transactionTitle: '',
            amount: '',
            transactionType: 'income',
            transactionCategory: ''
        };
    },
    computed: {
        ...mapState(['budgetData', 'username']),
        categories() {
            return this.budgetData.categories.filter(category => category.userId === this.username);
        }
    },
    methods: {
        ...mapActions(['addTransaction']),
        handleAddTransaction() {
            if (this.transactionTitle.trim() === '' || isNaN(this.amount) || this.amount <= 0 || this.transactionDate === '') {
                this.showNotification('Пожалуйста, введите корректную транзакцию.', 'error');
                return;
            }

            const transaction = {
                date: new Date(this.transactionDate).toISOString().split('T')[0],
                title: this.transactionTitle.trim(),
                amount: parseFloat(this.amount),
                type: this.transactionType,
                category: this.transactionCategory,
                userId: this.username
            };

            this.addTransaction(transaction);

            this.transactionDate = '';
            this.transactionTitle = '';
            this.amount = '';
            this.transactionType = 'income';
            this.transactionCategory = '';

            this.showNotification('Транзакция успешно добавлена.', 'success');

            this.$store.dispatch('updateCharts');
        }
    },
    inject: ['showNotification']
};
</script>

<style scoped>
</style>
