<template>
  <div class="dashboard-content">
    <!-- 数据卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon user">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">1,234</div>
            <div class="stat-label">总用户数</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon equipment">
            <el-icon><Tools /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">567</div>
            <div class="stat-label">器械数量</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon store">
            <el-icon><Location /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">89</div>
            <div class="stat-label">合作门店</div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-icon coach">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">234</div>
            <div class="stat-label">认证教练</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="quick-actions">
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="8">
          <el-button
              type="primary"
              size="large"
              @click="$router.push('/admin/users')"
              style="width: 100%"
          >
            <el-icon><User /></el-icon>
            用户管理
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-button
              type="success"
              size="large"
              @click="$router.push('/admin/equipment')"
              style="width: 100%"
          >
            <el-icon><Tools /></el-icon>
            器械管理
          </el-button>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-button
              type="warning"
              size="large"
              @click="$router.push('/admin/stores')"
              style="width: 100%"
          >
            <el-icon><Location /></el-icon>
            门店管理
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 待办事项 -->
    <el-card class="todo-list">
      <template #header>
        <div class="card-header">
          <span>待办事项</span>
          <el-badge :value="3" class="badge" />
        </div>
      </template>
      <el-empty description="暂无待办事项" />
    </el-card>
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

.quick-actions {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-list {
  margin-top: 20px;
}

.badge {
  margin-left: 10px;
}
</style>
