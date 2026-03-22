<template>
  <div class="dashboard-content">
    <!-- 数据卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" @click="goToUsers">
          <div class="stat-icon user">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overviewData.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" @click="goToEquipment">
          <div class="stat-icon equipment">
            <el-icon><Tools /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overviewData.totalEquipment }}</div>
            <div class="stat-label">器械数量</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" @click="goToStores">
          <div class="stat-icon store">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overviewData.totalStores }}</div>
            <div class="stat-label">合作门店</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" @click="goToCoaches">
          <div class="stat-icon coach">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ overviewData.totalCoaches }}</div>
            <div class="stat-label">认证教练</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  User,
  UserFilled,
  Tools,
  Location
} from '@element-plus/icons-vue'

export default {
  name: 'AdminDashboard',
  components: {
    User,
    UserFilled,
    Tools,
    Location
  },
  data() {
    return {
      overviewData: {
        totalUsers: 0,
        totalEquipment: 0,
        totalStores: 0,
        totalCoaches: 0
      }
    }
  },
  mounted() {
    this.fetchOverviewData()
  },
  methods: {
    async fetchOverviewData() {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch('/api/admin/data-overview', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (result.code === 200) {
          this.overviewData = result.data
        }
      } catch (error) {
        console.error('Error fetching overview data:', error)
      }
    },
    goToUsers() {
      this.$router.push('/admin/users')
    },
    goToEquipment() {
      this.$router.push('/admin/equipment')
    },
    goToStores() {
      this.$router.push('/admin/stores')
    },
    goToCoaches() {
      this.$router.push('/admin/users')
    }
  }
}
</script>

<style scoped>
.dashboard-content {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  margin-right: 15px;
}

.stat-icon.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.equipment {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.store {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.coach {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}
</style>
