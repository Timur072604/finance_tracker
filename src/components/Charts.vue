<template>
  <div class="charts-section">
    <div class="charts-container">
      <div class="chart-controls">
        <div class="chart-controls-row">
          <div class="chart-type-selector">
            <label for="chartType">Тип диаграммы:</label>
            <select class="form-control" id="chartType" v-model="chartType" @change="updateCharts">
              <option value="line">Линейная</option>
            </select>
          </div>
          <div class="transaction-type-selector">
            <label for="transactionTypeSelector">Тип транзакции:</label>
            <select class="form-control" id="transactionTypeSelector" v-model="transactionType" @change="updateCharts">
              <option value="">Все</option>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </div>
        </div>
        <div class="chart-controls-row">
          <div class="month-selector">
            <label for="monthSelector">Месяц:</label>
            <select class="form-control" id="monthSelector" v-model="month" @change="updateCharts">
              <option v-for="(monthName, index) in monthNames" :key="index" :value="index">{{ monthName }}</option>
            </select>
          </div>
          <div class="category-selector">
            <label for="categorySelector">Категория:</label>
            <select class="form-control" id="categorySelector" v-model="category" @change="updateCharts">
              <option value="">Все категории</option>
              <option v-for="category in categories" :key="category.name" :value="category.name">{{ category.name }}</option>
            </select>
          </div>
        </div>
      </div>
      <canvas id="transactionsChart" width="300" height="150"></canvas>
    </div>
    <div class="charts-container">
      <div class="chart-controls">
        <div class="chart-controls-row">
          <div class="chart-type-selector">
            <label for="chartType2">Тип диаграммы:</label>
            <select class="form-control" id="chartType2" v-model="chartType2" @change="updateCharts2">
              <option value="pie">Круговая</option>
              <option value="bar">Столбчатая</option>
            </select>
          </div>
          <div class="transaction-type-selector">
            <label for="transactionTypeSelector2">Тип транзакции:</label>
            <select class="form-control" id="transactionTypeSelector2" v-model="transactionType2" @change="updateCharts2">
              <option value="">Все</option>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </div>
        </div>
        <div class="chart-controls-row">
          <div class="month-selector">
            <label for="monthSelector2">Месяц:</label>
            <select class="form-control" id="monthSelector2" v-model="month2" @change="updateCharts2">
              <option v-for="(monthName, index) in monthNames" :key="index" :value="index">{{ monthName }}</option>
            </select>
          </div>
          <div class="category-selector">
            <label for="categorySelector2">Категория:</label>
            <select class="form-control" id="categorySelector2" v-model="category2" @change="updateCharts2">
              <option value="">Все категории</option>
              <option v-for="category in categories" :key="category.name" :value="category.name">{{ category.name }}</option>
            </select>
          </div>
        </div>
      </div>
      <canvas id="transactionsChart2" width="300" height="150"></canvas>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Chart from 'chart.js/auto';

export default {
  name: 'Charts',
  data() {
    return {
      chartType: 'line',
      transactionType: '',
      month: new Date().getMonth(),
      category: '',
      chartType2: 'pie',
      transactionType2: '',
      month2: new Date().getMonth(),
      category2: '',
      monthNames: [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ],
      categoryColors: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      categoryBorderColors: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ]
    };
  },
  computed: {
    ...mapState(['budgetData', 'username']),
    categories() {
      return this.budgetData.categories.filter(category => category.userId === this.username);
    }
  },
  methods: {
    updateCharts() {
      const ctx = document.getElementById('transactionsChart').getContext('2d');
      const filteredTransactions = this.budgetData.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transaction.userId === this.username &&
               transactionDate.getMonth() === this.month &&
               (this.category === '' || transaction.category === this.category) &&
               (this.transactionType === '' || transaction.type === this.transactionType);
      });

      const labels = [];
      const datasets = [];

      if (this.transactionType === '') {
        const incomeData = [];
        const expenseData = [];

        filteredTransactions.forEach(transaction => {
          const transactionDate = new Date(transaction.date);
          const dateLabel = transactionDate.toLocaleDateString();
          if (!labels.includes(dateLabel)) {
            labels.push(dateLabel);
          }
          if (transaction.type === 'income') {
            incomeData.push({ date: dateLabel, amount: transaction.amount });
          } else {
            expenseData.push({ date: dateLabel, amount: transaction.amount });
          }
        });

        const incomeDataset = labels.map(label => {
          const incomeTransaction = incomeData.find(data => data.date === label);
          return incomeTransaction ? incomeTransaction.amount : 0;
        });

        const expenseDataset = labels.map(label => {
          const expenseTransaction = expenseData.find(data => data.date === label);
          return expenseTransaction ? expenseTransaction.amount : 0;
        });

        datasets.push({
          label: 'Доходы',
          data: incomeDataset,
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
          fill: false
        });

        datasets.push({
          label: 'Расходы',
          data: expenseDataset,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false
        });
      } else {
        const categoryData = {};

        filteredTransactions.forEach(transaction => {
          const transactionDate = new Date(transaction.date);
          const dateLabel = transactionDate.toLocaleDateString();
          if (!labels.includes(dateLabel)) {
            labels.push(dateLabel);
          }
          if (!categoryData[transaction.category]) {
            categoryData[transaction.category] = [];
          }
          categoryData[transaction.category].push({ date: dateLabel, amount: transaction.amount });
        });

        Object.keys(categoryData).forEach((category, index) => {
          const categoryDataset = labels.map(label => {
            const categoryTransaction = categoryData[category].find(data => data.date === label);
            return categoryTransaction ? categoryTransaction.amount : 0;
          });

          datasets.push({
            label: category,
            data: categoryDataset,
            backgroundColor: this.categoryColors[index % this.categoryColors.length],
            borderColor: this.categoryBorderColors[index % this.categoryBorderColors.length],
            borderWidth: 1,
            fill: false
          });
        });
      }

      const data = {
        labels: labels,
        datasets: datasets
      };

      const config = {
        type: 'line',
        data: data,
        options: {
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      if (this.myChart) {
        this.myChart.destroy();
      }

      this.myChart = new Chart(ctx, config);
    },
    updateCharts2() {
      const ctx = document.getElementById('transactionsChart2').getContext('2d');
      const filteredTransactions = this.budgetData.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transaction.userId === this.username &&
               transactionDate.getMonth() === this.month2 &&
               (this.category2 === '' || transaction.category === this.category2) &&
               (this.transactionType2 === '' || transaction.type === this.transactionType2);
      });

      const labels = [];
      const data = [];
      const backgroundColors = [];
      const borderColors = [];

      if (this.transactionType2 === '') {
        const totalIncome = filteredTransactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalExpenses = filteredTransactions.filter(transaction => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0);

        labels.push('Доходы', 'Расходы');
        data.push(totalIncome, totalExpenses);
        backgroundColors.push('rgba(40, 167, 69, 0.2)', 'rgba(255, 99, 132, 0.2)');
        borderColors.push('rgba(40, 167, 69, 1)', 'rgba(255, 99, 132, 1)');
      } else {
        const categoryData = {};

        filteredTransactions.forEach(transaction => {
          if (!categoryData[transaction.category]) {
            categoryData[transaction.category] = 0;
          }
          categoryData[transaction.category] += transaction.amount;
        });

        Object.keys(categoryData).forEach((category, index) => {
          labels.push(category);
          data.push(categoryData[category]);
          backgroundColors.push(this.categoryColors[index % this.categoryColors.length]);
          borderColors.push(this.categoryBorderColors[index % this.categoryBorderColors.length]);
        });
      }

      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Транзакции',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      };

      const config = {
        type: this.chartType2,
        data: chartData,
        options: {
          plugins: {
            legend: {
              display: this.chartType2 === 'pie'
            },
            tooltip: {
              enabled: true
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      if (this.myChart2) {
        this.myChart2.destroy();
      }

      this.myChart2 = new Chart(ctx, config);
    },
    updateAllCharts() {
      this.updateCharts();
      this.updateCharts2();
    }
  },
  mounted() {
    this.updateAllCharts();
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.destroy();
    }
    if (this.myChart2) {
      this.myChart2.destroy();
    }
  },
  watch: {
    budgetData: {
      deep: true,
      handler() {
        this.updateAllCharts();
      }
    }
  }
};
</script>

<style scoped>
</style>
