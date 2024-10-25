<template>
    
    <div class="columns">
            <div class="column is-one-fifth">
                <aside class="menu sticky">
            <p class="menu-label">
                General
            </p>
            <ul class="menu-list">
                <li><router-link to="/admin/dashboard" class="navbar-item"><a class="is-active">Dashboard</a></router-link></li>
                <li><router-link to="/admin/sale" class="navbar-item"><a>Sale</a></router-link></li>
                 
            </ul>
            <p class="menu-label">
                Administration
            </p>
            <ul class="menu-list">
                <li><router-link to="/admin/categories" class="navbar-item"><a>Categories</a></router-link></li>
                <li><router-link to="/admin/brands" class="navbar-item"><a>Brands</a></router-link></li>
                <li><router-link to="/admin/products" class="navbar-item"><a>Products</a></router-link></li>
            </ul>
            
        </aside>
        </div>
        <div class="column">
          <div class="dashboard-container">
    <div class="chart-container">
      <canvas ref="productChart"></canvas>
      <p class="chart-info">Ce graphe represente la quantité des produits achetés</p>
    </div>

    <div class="dashboard-info">
      <div class="info-item">
        <h2 class="info-title">Number of Categories</h2>
        <div class="info-value info-value-orders">{{ totalOrders }}</div>
        <p class="info-description">nombre total de catégories</p>
      </div>
      <div class="info-item">
        <h2 class="info-title">Total Products purchased </h2>
        <div class="info-value info-value-products">{{ totalProducts }}</div>
        <p class="info-description">Nombre total de produits achetés</p>
      </div>
       <div class="info-item">
        <h2 class="info-title">Total Products in stock </h2>
        <div class="info-value info-value-totproducts">{{ totalproductsdata }}</div>
        <p class="info-description">Nombre total de produits en stock</p>
      </div>
      <div class="info-item">
        <h2 class="info-title">Registered Users Count</h2>
        <div class="info-value info-value-users">{{ registeredUsersCount }}</div>
        <p class="info-description">Nombre total d'utilisateurs inscrits</p>
      </div>
    </div>

    <div class="chart-container">
      <canvas ref="commandChart"></canvas>
      <p class="chart-info">Ce graphe represente le nombre de commandes par catégorie.</p>
    </div>
  </div>
        </div>
    </div>
        

</template>

<script>
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

export default {
  name: 'Dashboard',
  components: {
    Bar,
    Doughnut
  },

  data() {
    return {
      productChartData: {
        labels: [],
        datasets: [
          {
            label: 'Product Quantity',
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      commandChartData: {
        labels: [],
        datasets: [
          {
            label: 'Commands per Category',
            backgroundColor: ['#f87979', '#8eb3ff', '#ffcc5f'],
            data: []
          }
        ]
      },
      totalOrders: null,
      totalProducts: null,
      registeredUsersCount: null,
      totalproductsdata:null,
      categoryCounts: []
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('/api/v1/Dashboard/')
        .then(response => {
          const labels = response.data.labels;
          const data = response.data.data;
          this.productChartData.labels = labels;
          this.productChartData.datasets[0].data = data;
          this.renderProductChart();
        })
        .catch(error => {
          console.log("API request failed:", error);
        });

      axios.get('/api/v1/Dashboard2/') // Number of categories
        .then(response => {
          console.log(response.data);
          this.totalOrders = response.data.count;
        })
        .catch(error => {
          console.log("API request failed:", error);
        });

      axios.get('/api/v1/Dasboard/total-products/') // Total products
        .then(response => {
          this.totalProducts = response.data.total_quantity;
        })
        .catch(error => {
          console.log("API request failed:", error);
        });

      axios.get('/api/v1/Dashboard/userscount/')
        .then(response => {
          this.registeredUsersCount = response.data;
        })
        .catch(error => {
          console.log("API request failed:", error);
        });
    axios.get('/api/v1/totalproducts/')
  .then(response => {
    this.totalproductsdata = response.data.total_quantity;
  })
  .catch(error => {
    console.log("API request failed:", error);
  });


      axios.get('/api/v1/Dasboard/category-counts/')
        .then(response => {
          this.categoryCounts = response.data;
          this.commandChartData.labels = response.data.map(item => item.category);
          this.commandChartData.datasets[0].data = response.data.map(item => item.count);
          this.renderCommandChart();
        })
        .catch(error => {
          console.log("API request failed:", error);
        });
    },
    renderProductChart() {
      this.$refs.productChart.height = 500;
      this.$refs.productChart.width = 500;
      new ChartJS(this.$refs.productChart.getContext('2d'), {
        type: 'bar',
        data: this.productChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              display: true,
              title: {
                display: true,
                text: 'Product Quantity'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Product'
              }
            }
          }
        }
      });
    },
    renderCommandChart() {
      this.$refs.commandChart.height = 500;
      this.$refs.commandChart.width = 500;
      new ChartJS(this.$refs.commandChart.getContext('2d'), {
        type: 'doughnut',
        data: this.commandChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.chart-container {
  width: 500px;
  height: 500px;
}

.dashboard-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  text-align: center;
}

.info-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.info-value {
  display: inline-block;
  padding: 10px 20px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  border-radius: 5px;
  text-align: center;
  width: 200px;
}

.info-value-orders {
  background-color: #f87979;
}

.info-value-products {
  background-color: #8eb3ff;
}

.info-value-users {
  background-color: #f5d95d;
}

.info-value-totproducts{
  background-color:#bef574;
}

.chart-info {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}
</style>
