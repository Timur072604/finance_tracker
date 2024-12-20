import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    budgetData: {
      totalIncome: 0,
      totalExpenses: 0,
      budgetLeft: 0,
      transactions: [],
      categories: []
    },
    currentPage: 1,
    sortConfig: {
      key: null,
      direction: null
    },
    PAGE_SIZE: 8,
    editTransactionIndex: null,
    isAuthenticated: false,
    username: '',
    email: '',
    users: []
  },
  mutations: {
    setBudgetData(state, data) {
      state.budgetData = data;
    },
    setCurrentPage(state, page) {
      state.currentPage = page;
    },
    setSortConfig(state, config) {
      state.sortConfig = config;
    },
    addTransaction(state, transaction) {
      state.budgetData.transactions.push(transaction);
      if (transaction.type === 'expense') {
        state.budgetData.totalExpenses += transaction.amount;
        state.budgetData.budgetLeft -= transaction.amount;
      } else {
        state.budgetData.totalIncome += transaction.amount;
        state.budgetData.budgetLeft += transaction.amount;
      }
    },
    editTransaction(state, { index, transaction }) {
      const oldTransaction = state.budgetData.transactions[index];
      state.budgetData.transactions[index] = transaction;
      if (transaction.type === 'expense') {
        state.budgetData.totalExpenses += transaction.amount - oldTransaction.amount;
        state.budgetData.budgetLeft -= transaction.amount - oldTransaction.amount;
      } else {
        state.budgetData.totalIncome += transaction.amount - oldTransaction.amount;
        state.budgetData.budgetLeft += transaction.amount - oldTransaction.amount;
      }
    },
    deleteTransaction(state, id) {
      const index = state.budgetData.transactions.findIndex(transaction => transaction.id === id);
      const removedTransaction = state.budgetData.transactions.splice(index, 1)[0];
      if (removedTransaction.type === 'expense') {
        state.budgetData.totalExpenses -= removedTransaction.amount;
        state.budgetData.budgetLeft += removedTransaction.amount;
      } else {
        state.budgetData.totalIncome -= removedTransaction.amount;
        state.budgetData.budgetLeft -= removedTransaction.amount;
      }
    },
    addCategory(state, category) {
      state.budgetData.categories.push(category);
    },
    clearAll(state) {
      state.budgetData.transactions = [];
      state.budgetData.categories = [];
      state.budgetData.totalIncome = 0;
      state.budgetData.totalExpenses = 0;
      state.budgetData.budgetLeft = 0;
      state.currentPage = 1;
    },
    setEditTransactionIndex(state, index) {
      state.editTransactionIndex = index;
    },
    setAuthentication(state, { isAuthenticated, username, email }) {
      state.isAuthenticated = isAuthenticated;
      state.username = username;
      state.email = email;
      if (isAuthenticated) {
        localStorage.setItem('auth', JSON.stringify({ isAuthenticated, username, email }));
      } else {
        localStorage.removeItem('auth');
      }
    },
    addUser(state, user) {
      state.users.push(user);
    },
    updateUser(state, { username, email, newPassword }) {
      const userIndex = state.users.findIndex(user => user.username === state.username);
      if (userIndex !== -1) {
        const user = state.users[userIndex];
        user.username = username;
        user.email = email;
        if (newPassword) {
          user.password = newPassword;
        }
        state.username = username;
        state.email = email;
      } else {
        alert('Пользователь не найден.');
      }
    },
    deleteProfile(state) {
      state.users = state.users.filter(user => user.username !== state.username);
      state.isAuthenticated = false;
      state.username = '';
      state.email = '';
    }
  },
  actions: {
    async fetchBudgetData({ commit, state }) {
      const [categoriesResponse, transactionsResponse] = await Promise.all([
        axios.get(`http://localhost:3000/api/categories/${state.username}`),
        axios.get(`http://localhost:3000/api/transactions/${state.username}`)
      ]);
      const categories = categoriesResponse.data;
      const transactions = transactionsResponse.data;
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const budgetLeft = totalIncome - totalExpenses;
      commit('setBudgetData', { totalIncome, totalExpenses, budgetLeft, transactions, categories });
    },
    async addTransaction({ commit, state }, transaction) {
      const response = await axios.post('http://localhost:3000/api/transactions', { ...transaction, userId: state.username });
      commit('addTransaction', response.data);
    },
    async editTransaction({ commit, state }, { index, transaction }) {
      const response = await axios.put(`http://localhost:3000/api/transactions/${transaction.id}`, { ...transaction, userId: state.username });
      commit('editTransaction', { index, transaction: response.data });
    },
    async deleteTransaction({ commit }, id) {
      await axios.delete(`http://localhost:3000/api/transactions/${id}`);
      commit('deleteTransaction', id);
    },
    async addCategory({ commit, state }, category) {
      const response = await axios.post('http://localhost:3000/api/categories', { name: category.name, userId: state.username });
      commit('addCategory', response.data);
    },
    async register({ commit }, { username, email, password }) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

      if (!emailPattern.test(email)) {
        throw new Error('Неверный формат почты.');
      }

      if (!passwordPattern.test(password)) {
        throw new Error('Пароль должен содержать минимум 8 символов, включая буквы, цифры и специальные символы.');
      }

      const response = await axios.post('http://localhost:3000/api/register', { username, email, password });
      commit('addUser', response.data);
      commit('setAuthentication', { isAuthenticated: true, username, email });
    },
    async login({ commit }, { username, password }) {
      const response = await axios.post('http://localhost:3000/api/login', { username, password });
      commit('addUser', response.data);
      commit('setAuthentication', { isAuthenticated: true, username: response.data.username, email: response.data.email });
    },
    async logout({ commit }) {
      commit('setAuthentication', { isAuthenticated: false, username: '', email: '' });
    },
    async updateUser({ commit, state }, { username, email, newPassword }) {
      await axios.put(`http://localhost:3000/api/users/${state.username}`, { email, password: newPassword, newUsername: username });
      commit('updateUser', { username, email, newPassword });
    },
    async deleteProfile({ commit, state }) {
      await axios.delete(`http://localhost:3000/api/users/${state.username}`);
      commit('deleteProfile');
    }
  },
  getters: {
    paginatedTransactions(state) {
      const startIndex = (state.currentPage - 1) * state.PAGE_SIZE;
      const endIndex = startIndex + state.PAGE_SIZE;
      return state.budgetData.transactions.filter(transaction => transaction.userId === state.username).slice(startIndex, endIndex);
    },
    totalPages(state) {
      return Math.ceil(state.budgetData.transactions.filter(transaction => transaction.userId === state.username).length / state.PAGE_SIZE);
    }
  }
});

const auth = JSON.parse(localStorage.getItem('auth'));
if (auth) {
  store.commit('setAuthentication', auth);
}

export default store;
