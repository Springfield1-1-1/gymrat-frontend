<template>
  <div class="store-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>🏪 门店管理</h2>
        </div>
      </template>

      <el-empty description="门店管理功能正在开发中，敬请期待" :image-size="200" />

      <div class="feature-preview">
        <h3>即将上线的功能：</h3>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><Shop /></el-icon>
              <p>添加新门店</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><Edit /></el-icon>
              <p>编辑门店信息</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><Delete /></el-icon>
              <p>删除门店数据</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><User /></el-icon>
              <p>管理教练团队</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><Location /></el-icon>
              <p>门店位置管理</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="feature-item">
              <el-icon><DataAnalysis /></el-icon>
              <p>门店数据统计</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Shop, Edit, Delete, User, Location, DataAnalysis } from '@element-plus/icons-vue'

export default {
  name: 'StoreManagement',
  components: {
    Shop,
    Edit,
    Delete,
    User,
    Location,
    DataAnalysis
  }
}
</script>

<style scoped>
.store-management {
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
  margin-bottom: 20px;
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
