<template>
    <div class="add-category-container">
        <form @submit.prevent="handleAddCategory">
            <div class="form-group">
                <label for="categoryName">Название категории:</label>
                <input class="form-control" type="text" id="categoryName" v-model="categoryName">
            </div>
            <button class="btn btn-primary form-control">Добавить категорию</button>
        </form>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  
  export default {
    name: 'AddCategory',
    data() {
        return {
            categoryName: ''
        };
    },
    methods: {
        ...mapActions(['addCategory']),
        handleAddCategory() {
            if (this.categoryName.trim() === '') {
                this.showNotification('Пожалуйста, введите название категории.', 'error');
                return;
            }
  
            if (!this.$store.state.budgetData.categories.some(category => category.name === this.categoryName && category.userId === this.$store.state.username)) {
                this.addCategory({ name: this.categoryName });
                this.categoryName = '';
                this.showNotification('Категория успешно добавлена.', 'success');
            } else {
                this.showNotification('Категория уже существует.', 'error');
            }
        }
    },
    inject: ['showNotification']
  };
  </script>
  
  <style scoped>
  </style>
  