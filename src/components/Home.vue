<template>
    <div>
        <Navbar />
        <div class="budget-container">
            <div class="top-section">
                <div class="forms-container">
                    <AddCategory />
                    <AddTransaction />
                </div>
                <BudgetDisplay />
            </div>
            <Charts />
            <EditTransactionModal />
        </div>
    </div>
  </template>
  
  <script>
  import Navbar from './Navbar.vue';
  import AddCategory from './AddCategory.vue';
  import AddTransaction from './AddTransaction.vue';
  import BudgetDisplay from './BudgetDisplay.vue';
  import Charts from './Charts.vue';
  import EditTransactionModal from './EditTransactionModal.vue';
  
  export default {
    name: 'Home',
    components: {
        Navbar,
        AddCategory,
        AddTransaction,
        BudgetDisplay,
        Charts,
        EditTransactionModal
    }
  };
  </script>
  
  <style scoped>
  </style>