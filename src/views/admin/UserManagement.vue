<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>👥 用户管理</h2>
        </div>
      </template>

      <el-empty description="用户管理功能正在开发中，敬请期待" :image-size="200" />

      <div class="feature-preview">
        <h3>即将上线的功能：</h3>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><User /></el-icon>
              <p>查看用户列表</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><Edit /></el-icon>
              <p>编辑用户信息</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><Delete /></el-icon>
              <p>删除违规用户</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { User, Edit, Delete } from '@element-plus/icons-vue'

export default {
  name: 'UserManagement',
  components: {
    User,
    Edit,
    Delete
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.feature-preview {
  margin-top: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.feature-preview h3 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 30px;
  text-align: center;
}

.feature-item {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-item .el-icon {
  font-size: 40px;
  color: #3b82f6;
  margin-bottom: 10px;
}

.feature-item p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}
</style>
