<template>
    <div class="display-container">
        <div class="heading" style="display: flex; justify-content: space-around;">
            <div class="alert alert-success" role="alert">
                Общие доходы: <span>{{ totalIncome.toFixed(2) }}</span>
            </div>
            <div class="alert alert-danger" role="alert">
                Общие расходы: <span>{{ totalExpenses.toFixed(2) }}</span>
            </div>
            <div class="alert alert-primary" role="alert">
                Осталось бюджета: <span>{{ budgetLeft.toFixed(2) }}</span>
            </div>
        </div>
        <hr>
        <div class="table-container table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" @click="sortTable('id')" class="text-center">Номер <span><i :class="sortArrowClass('id')"></i></span></th>
                        <th scope="col" @click="sortTable('date')" class="text-center">Дата <span><i :class="sortArrowClass('date')"></i></span></th>
                        <th scope="col" @click="sortTable('title')" class="text-center">Название транзакции <span><i :class="sortArrowClass('title')"></i></span></th>
                        <th scope="col" @click="sortTable('amount')" class="text-center">Сумма <span><i :class="sortArrowClass('amount')"></i></span></th>
                        <th scope="col" @click="sortTable('type')" class="text-center">Тип <span><i :class="sortArrowClass('type')"></i></span></th>
                        <th scope="col" @click="sortTable('category')" class="text-center">Категория <span><i :class="sortArrowClass('category')"></i></span></th>
                        <th scope="col" class="text-center">Действие</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(transaction, index) in paginatedTransactions" :key="index">
                        <td class="text-center">{{ transaction.id }}</td>
                        <td class="text-center">{{ formatDate(transaction.date) }}</td>
                        <td class="text-center">{{ transaction.title }}</td>
                        <td class="text-center">{{ transaction.amount.toFixed(2) }}</td>
                        <td class="text-center">{{ transaction.type === 'expense' ? 'Расход' : 'Доход' }}</td>
                        <td class="text-center">{{ transaction.category || 'Без категории' }}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-primary action-button" @click="openEditModal(index)">Обновить</button>
                            <button class="btn btn-sm btn-danger action-button" @click="handleDeleteTransaction(transaction.id)">Удалить</button>
                        </td>
                    </tr>
                    <tr v-for="i in (8 - paginatedTransactions.length)" :key="'empty-' + i">
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                        <td class="text-center"></td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-primary action-button" disabled>Обновить</button>
                            <button class="btn btn-sm btn-danger action-button" disabled>Удалить</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination-container">
                <div class="pagination-buttons-wrapper">
                    <div class="pagination-buttons">
                        <button class="btn btn-primary" @click="firstPage">&laquo;</button>
                        <button class="btn btn-primary" @click="prevPage">&lsaquo;</button>
                        <span>{{ currentPage }}</span>
                        <button class="btn btn-primary" @click="nextPage">&rsaquo;</button>
                        <button class="btn btn-primary" @click="lastPage">&raquo;</button>
                    </div>
                </div>
                <div class="clear-all-container">
                    <button class="btn btn-danger" @click="clearAll">Очистить все</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'BudgetDisplay',
    computed: {
        ...mapState(['budgetData', 'currentPage', 'sortConfig', 'PAGE_SIZE', 'username']),
        ...mapGetters(['paginatedTransactions', 'totalPages']),
        totalIncome() {
            return this.budgetData.transactions
                .filter(transaction => transaction.userId === this.username && transaction.type === 'income')
                .reduce((sum, transaction) => sum + transaction.amount, 0);
        },
        totalExpenses() {
            return this.budgetData.transactions
                .filter(transaction => transaction.userId === this.username && transaction.type === 'expense')
                .reduce((sum, transaction) => sum + transaction.amount, 0);
        },
        budgetLeft() {
            return this.totalIncome - this.totalExpenses;
        },
        sortArrowClass() {
            return (key) => {
                if (this.sortConfig.key === key) {
                    return this.sortConfig.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
                }
                return 'fas fa-sort';
            };
        }
    },
    methods: {
        ...mapMutations(['setCurrentPage', 'setSortConfig']),
        ...mapActions(['fetchBudgetData', 'deleteTransaction']),
        openEditModal(index) {
            this.$store.commit('setEditTransactionIndex', index);
            $('#editTransactionModal').modal('show');
        },
        handleDeleteTransaction(id) {
            this.deleteTransaction(id);
            this.showNotification('Транзакция успешно удалена.', 'success');
        },
        sortTable(key) {
            let direction = this.sortConfig.key === key && this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
            this.setSortConfig({ key, direction });
            this.budgetData.transactions.sort((a, b) => {
                if (direction === 'asc') {
                    return a[key] > b[key] ? 1 : -1;
                } else {
                    return a[key] < b[key] ? 1 : -1;
                }
            });
        },
        firstPage() {
            this.setCurrentPage(1);
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.setCurrentPage(this.currentPage - 1);
            }
        },
        nextPage() {
            if (this.currentPage * this.PAGE_SIZE < this.budgetData.transactions.filter(transaction => transaction.userId === this.username).length) {
                this.setCurrentPage(this.currentPage + 1);
            }
        },
        lastPage() {
            this.setCurrentPage(this.totalPages);
        },
        clearAll() {
            this.$store.commit('clearAll');
            this.showNotification('Все данные успешно очищены.', 'success');
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString(); 
        }
    },
    inject: ['showNotification'],
    created() {
        this.fetchBudgetData();
    }
};
</script>

<style scoped>
.action-button {
    margin-right: 5px;
}

.action-button:last-child {
    margin-right: 0;
}

.text-center {
    text-align: center;
}
</style>
