<template>
  <div class="equipment-guide-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-container">
        <div class="nav-left">
          <el-button
              type="primary"
              class="back-home-btn"
              @click="goToHome"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回首页
          </el-button>
          <h1 class="page-title">⚙️器械分类及教学</h1>
        </div>
        <div class="nav-right">
          <el-input
              v-model="searchKeyword"
              placeholder="在当前器械分类下搜索名称..."
              class="search-input"
              clearable
              @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 安全提示 -->
    <div class="safety-tip">
      <div class="tip-container">
        <el-icon class="tip-icon"><Warning /></el-icon>
        <span class="tip-text">尝试新器械时从小重量开始，谨防受伤！</span>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <div class="sidebar-sticky">
          <h3 class="sidebar-title">器械分类</h3>
          <ul class="category-list">
            <li
                v-for="category in categories"
                :key="category.id"
                :class="{ active: activeCategory === category.categoryCode }"
                @click="selectCategory(category.categoryCode)"
            >
              <div class="category-item">
                <div class="category-icon">
                  <el-icon>
                    <component :is="category.icon" />
                  </el-icon>
                </div>
                <span class="category-name">{{ category.categoryName }}</span>
                <span class="equipment-count">{{ category.equipmentCount }}个器械</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧器械列表 -->
      <div class="equipment-list">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>

        <!-- 空状态 -->
        <div v-else-if="equipmentList.length === 0 && !loading" class="empty-state">
          <el-empty description="暂无器械数据" />
        </div>

        <!-- 器械卡片列表 -->
        <div v-else class="equipment-grid">
          <div
              v-for="equipment in equipmentList"
              :key="equipment.id"
              class="equipment-card"
          >
            <div class="equipment-image">
              <img
                  :src="equipment.imageUrl || defaultImage"
                  :alt="equipment.name"
                  loading="lazy"
              >
            </div>

            <div class="equipment-info">
              <h3 class="equipment-name">{{ equipment.name }}</h3>

              <div class="equipment-meta">
                <div class="meta-item">
                  <el-icon><Location /></el-icon>
                  <span class="meta-label">目标肌群：</span>
                  <span class="meta-value">{{ equipment.targetMuscles }}</span>
                </div>
              </div>

              <div class="equipment-usage">
                <h4 class="usage-title">使用方法</h4>
                <div class="usage-content">
                  {{ equipment.usageDescription }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-container">
          <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 返回首页浮动按钮 -->
    <div class="floating-back-btn" @click="goToHome">
      <el-tooltip content="返回首页" placement="left">
        <el-button circle type="success" size="large">
          <el-icon><HomeFilled /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, Search, Warning, HomeFilled,
  Location, Guide
} from '@element-plus/icons-vue'
import request from '@/api/request'

const router = useRouter()

// 分类数据
const categories = ref([])

// 器械列表数据
const equipmentList = ref([])

// 响应式数据
const activeCategory = ref('back-shoulder')
const searchKeyword = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 默认图片
const defaultImage = 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=400&h=300&fit=crop'

// 方法
const goToHome = () => {
  router.push('/')
}

const selectCategory = (categoryId) => {
  activeCategory.value = categoryId
  currentPage.value = 1
  fetchEquipmentData()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchEquipmentData()
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.categoryName : '未知分类'
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchEquipmentData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchEquipmentData()
}

// 获取分类数据
const fetchCategories = async () => {
  try {
    const response = await request.get('/equipment/categories')
    if (response && response.code === 200) {
      categories.value = response.data || []
      // 获取每个分类的器械数量
      for (let category of categories.value) {
        const countResponse = await request.get('/equipment/count', {
          params: { categoryId: category.id }
        })
        if (countResponse && countResponse.code === 200) {
          category.equipmentCount = countResponse.data || 0
        }
      }
    }
  } catch (error) {
    console.error('获取分类数据失败:', error)
  }
}

// 从后端获取器械数据
const fetchEquipmentData = async () => {
  loading.value = true
  try {
    const response = await request.get('/equipment/list', {
      params: {
        categoryCode: activeCategory.value,
        keyword: searchKeyword.value,
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })

    if (response && response.code === 200) {
      equipmentList.value = response.data.records || []
      total.value = response.data.total || 0
    }
  } catch (error) {
    console.error('获取器械数据失败:', error)
    equipmentList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchEquipmentData()
})
</script>

<style scoped>
.equipment-guide-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* 顶部导航栏 */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-home-btn {
  font-size: 16px;
  color: #3b82f6;
  padding-left: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.back-home-btn:hover {
  color: #2563eb;
  background: transparent;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.search-input {
  width: 300px;
}

/* 安全提示 */
.safety-tip {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-bottom: 1px solid #fbbf24;
  padding: 12px 0;
}

.tip-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
}

.tip-icon {
  color: #d97706;
  font-size: 20px;
}

.tip-text {
  font-size: 16px;
  font-weight: 500;
  color: #92400e;
}

/* 主要内容区域 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

/* 侧边栏 */
.sidebar {
  position: sticky;
  top: 120px;
  height: fit-content;
}

.sidebar-sticky {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-list li:hover {
  transform: translateX(5px);
}

.category-list li.active .category-item {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  border-radius: 10px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.category-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
}

.category-list li.active .category-icon {
  background: rgba(255, 255, 255, 0.2);
}

.category-icon .el-icon {
  font-size: 20px;
  color: #3b82f6;
}

.category-list li.active .category-icon .el-icon {
  color: white;
}

.category-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.equipment-count {
  font-size: 14px;
  opacity: 0.8;
}

/* 器械列表 */
.equipment-list {
  min-height: 600px;
}

.loading-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 60px 30px;
  text-align: center;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.equipment-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.equipment-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.equipment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.equipment-card:hover .equipment-image img {
  transform: scale(1.05);
}

.equipment-info {
  padding: 25px;
}

.equipment-name {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 15px;
}

.equipment-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #4b5563;
}

.meta-item .el-icon {
  flex-shrink: 0;
  color: #3b82f6;
  margin-top: 2px;
}

.meta-label {
  font-weight: 500;
  min-width: 80px;
}

.meta-value {
  flex: 1;
  line-height: 1.5;
}

.usage-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 10px;
}

.usage-content {
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

/* 分页 */
.pagination-container {
  margin-top: 40px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
}

/* 返回首页浮动按钮 */
.floating-back-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 1000;
}

.floating-back-btn .el-button {
  width: 56px;
  height: 56px;
  font-size: 20px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.floating-back-btn .el-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
  }

  .sidebar-sticky {
    margin-bottom: 20px;
  }

  .category-list {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 10px;
  }

  .category-list li {
    flex-shrink: 0;
    margin-bottom: 0;
  }

  .equipment-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .nav-left {
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }

  .page-title {
    font-size: 20px;
    text-align: center;
  }

  .search-input {
    width: 100%;
  }

  .main-content {
    padding: 20px 15px;
  }

  .equipment-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .floating-back-btn {
    right: 20px;
    bottom: 20px;
  }

  .floating-back-btn .el-button {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .tip-text {
    font-size: 14px;
  }

  .equipment-name {
    font-size: 18px;
  }

  .equipment-info {
    padding: 20px;
  }

  .equipment-count {
    display: none;
  }
}

/* 滚动条美化 */
.category-list::-webkit-scrollbar {
  height: 6px;
}

.category-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.equipment-card {
  animation: fadeIn 0.3s ease-in-out;
}

.equipment-card:nth-child(1) { animation-delay: 0.05s; }
.equipment-card:nth-child(2) { animation-delay: 0.1s; }
.equipment-card:nth-child(3) { animation-delay: 0.15s; }
.equipment-card:nth-child(4) { animation-delay: 0.2s; }
.equipment-card:nth-child(5) { animation-delay: 0.25s; }
.equipment-card:nth-child(6) { animation-delay: 0.3s; }
</style>
