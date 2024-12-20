<template>
    <div class="modal fade" id="editTransactionModal" tabindex="-1" aria-labelledby="editTransactionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editTransactionModalLabel">Редактировать транзакцию</h5>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateTransaction">
                        <div class="form-group">
                            <label for="editTransactionDate">Дата транзакции:</label>
                            <input class="form-control" type="date" id="editTransactionDate" v-model="transactionDate">
                        </div>
                        <div class="form-group">
                            <label for="editTransactionTitle">Название транзакции:</label>
                            <input class="form-control" type="text" id="editTransactionTitle" v-model="transactionTitle">
                        </div>
                        <div class="form-group">
                            <label for="editAmount">Сумма:</label>
                            <input class="form-control" type="text" id="editAmount" v-model="amount">
                        </div>
                        <div class="form-group">
                            <label for="editTransactionType">Тип транзакции:</label>
                            <select class="form-control" id="editTransactionType" v-model="transactionType">
                                <option value="income">Доход</option>
                                <option value="expense">Расход</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editTransactionCategory">Категория:</label>
                            <select class="form-control" id="editTransactionCategory" v-model="transactionCategory">
                                <option value="">Без категории</option>
                                <option v-for="category in categories" :key="category.name" :value="category.name">{{ category.name }}</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                    <button type="submit" class="btn btn-primary" @click="updateTransaction">Обновить транзакцию</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'EditTransactionModal',
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
        ...mapState(['budgetData', 'editTransactionIndex', 'username']),
        categories() {
            return this.budgetData.categories.filter(category => category.userId === this.username);
        }
    },
    methods: {
        ...mapActions(['editTransaction']),
        updateTransaction() {
            if (this.transactionTitle.trim() === '' || isNaN(this.amount) || this.amount <= 0 || this.transactionDate === '') {
                this.showNotification('Пожалуйста, введите корректную транзакцию.', 'error');
                return;
            }

            const transaction = {
                id: this.budgetData.transactions[this.editTransactionIndex].id,
                date: this.transactionDate,
                title: this.transactionTitle.trim(),
                amount: parseFloat(this.amount),
                type: this.transactionType,
                category: this.transactionCategory,
                userId: this.username
            };

            this.editTransaction({ index: this.editTransactionIndex, transaction });
            $('#editTransactionModal').modal('hide');
            this.showNotification('Транзакция успешно обновлена.', 'success');
        }
    },
    watch: {
        editTransactionIndex(newIndex) {
            const transaction = this.budgetData.transactions[newIndex];
            this.transactionDate = transaction.date;
            this.transactionTitle = transaction.title;
            this.amount = transaction.amount;
            this.transactionType = transaction.type;
            this.transactionCategory = transaction.category;
        }
    },
    inject: ['showNotification']
};
</script>

<style scoped>
.modal-dialog {
    max-width: 400px;
    margin: 1.75rem auto;
}
.modal-content {
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px;
    border: none;
}
.modal-header {
    border-bottom: none;
    padding: 1rem 1.5rem;
    background-color: #f0f0f0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.modal-body {
    padding: 1.5rem;
    background-color: #f9f9f9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.modal-footer {
    border-top: none;
    padding: 1rem 1.5rem;
    background-color: #f9f9f9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    justify-content: flex-end;
}
.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}
.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}
.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
}
.btn-secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;
}
</style>
