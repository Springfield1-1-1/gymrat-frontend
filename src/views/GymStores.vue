<template>
  <div class="gym-stores-page">
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
          <h1 class="page-title">🏙️ 周边门店及教练</h1>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <el-input
            v-model="searchCity"
            placeholder="请输入城市名称（如：厦门）"
            clearable
            style="width: 300px"
            @keyup.enter="loadStores"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="loadStores">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>

      <!-- 门店列表 -->
      <div class="stores-container">
        <div
            v-for="store in stores"
            :key="store.id"
            class="store-card"
            @click="showStoreDetail(store.id)"
        >
          <div class="store-image-wrapper">
            <img :src="store.storeImage" :alt="store.storeName" class="store-image" />
          </div>
          <div class="store-info">
            <h3 class="store-name">{{ store.storeName }}</h3>
            <div class="store-detail">
              <el-icon><Location /></el-icon>
              <span>{{ store.city }} - {{ store.address }}</span>
            </div>
            <div class="store-detail">
              <el-icon><Phone /></el-icon>
              <span>{{ store.phone }}</span>
            </div>
            <div class="coaches-preview" v-if="store.coaches && store.coaches.length > 0">
              <span class="coaches-label">金牌教练：</span>
              <span class="coach-name" v-for="(coach, index) in store.coaches.slice(0, 3)" :key="coach.id">
                {{ coach.coachName }}{{ index < Math.min(store.coaches.length, 3) - 1 ? '、' : '' }}
              </span>
              <span class="more-coaches" v-if="store.coaches.length > 3">等{{ store.coaches.length }}位教练</span>
            </div>
          </div>
          <div class="view-detail-btn">
            <el-button type="primary" size="small">查看详情</el-button>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="stores.length === 0" description="暂无门店数据" />
      </div>
    </div>

    <!-- 门店详情对话框 -->
    <el-dialog
        v-model="detailVisible"
        title="门店详情"
        width="800px"
        :close-on-click-modal="false"
    >
      <div class="store-detail-content" v-if="currentStore">
        <div class="detail-header">
          <img :src="currentStore.storeImage" :alt="currentStore.storeName" class="detail-image" />
          <div class="detail-info">
            <h2 class="detail-title">{{ currentStore.storeName }}</h2>
            <div class="detail-item">
              <el-icon><Location /></el-icon>
              <span>{{ currentStore.city }} - {{ currentStore.address }}</span>
            </div>
            <div class="detail-item">
              <el-icon><Phone /></el-icon>
              <span>{{ currentStore.phone }}</span>
            </div>
          </div>
        </div>

        <!-- 教练团队 -->
        <div class="coaches-section" v-if="currentStore.coaches && currentStore.coaches.length > 0">
          <h3 class="section-title">💪 金牌教练团队</h3>
          <div class="coaches-grid">
            <div
                v-for="coach in currentStore.coaches"
                :key="coach.id"
                class="coach-card"
            >
              <img :src="coach.coachAvatar" :alt="coach.coachName" class="coach-avatar" />
              <div class="coach-info">
                <h4 class="coach-name">{{ coach.coachName }}</h4>
                <p class="coach-specialty">{{ coach.specialty }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 没有教练的提示 -->
        <el-empty v-else description="暂无教练信息" />
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 右下角浮动按钮 -->
    <div class="floating-actions">
      <el-tooltip content="返回首页" placement="left">
        <el-button circle type="success" size="large" @click="goToHome">
          <el-icon><HomeFilled /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import {
  ArrowLeft,
  Search,
  Location,
  Phone,
  HomeFilled
} from '@element-plus/icons-vue'
import request from '@/api/request'

export default {
  name: 'GymStores',
  components: {
    ArrowLeft,
    Search,
    Location,
    Phone,
    HomeFilled
  },
  data() {
    return {
      stores: [],
      searchCity: '',
      detailVisible: false,
      currentStore: null,
      loading: false
    }
  },
  mounted() {
    this.loadStores()
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    },

    // 加载门店列表
    async loadStores() {
      this.loading = true

      try {
        const params = {}
        if (this.searchCity) {
          params.city = this.searchCity
        }

        const response = await request.get('/gym-stores', { params })

        if (response && response.code === 200) {
          this.stores = response.data || []
        } else {
          this.$message.warning('暂无门店数据')
          this.stores = []
        }
      } catch (error) {
        console.error('加载门店列表失败:', error)
        this.$message.error('加载失败，请重试')
        this.stores = []
      } finally {
        this.loading = false
      }
    },

    // 查看门店详情
    async showStoreDetail(storeId) {
      try {
        const response = await request.get(`/gym-stores/${storeId}`)

        if (response && response.code === 200) {
          this.currentStore = response.data
          this.detailVisible = true
        } else {
          this.$message.error(response.message || '获取详情失败')
        }
      } catch (error) {
        console.error('加载门店详情失败:', error)
        this.$message.error('加载失败，请重试')
      }
    }
  }
}
</script>

<style scoped>
.gym-stores-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #c0d2ea 0%, #e2c4c3 100%);
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.nav-container {
  max-width: 1200px;
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

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 30px 20px;
}

.search-section {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

.stores-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.store-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.store-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.store-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.store-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.store-card:hover .store-image {
  transform: scale(1.05);
}

.store-info {
  padding: 20px;
}

.store-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 15px 0;
}

.store-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.store-detail .el-icon {
  color: #3b82f6;
}

.coaches-preview {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
  font-size: 13px;
}

.coaches-label {
  color: #f59e0b;
  font-weight: 600;
}

.coach-name {
  color: #374151;
}

.more-coaches {
  color: #9ca3af;
  font-size: 12px;
}

.view-detail-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

/* 详情对话框样式 */
.store-detail-content {
  padding: 10px;
}

.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e5e7eb;
}

.detail-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.detail-info {
  flex: 1;
}

.detail-title {
  font-size: 22px;
  color: #1f2937;
  margin: 0 0 15px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 10px;
}

.detail-item .el-icon {
  color: #3b82f6;
}

.coaches-section {
  margin-top: 20px;
}

.section-title {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.coaches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.coach-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
  transition: all 0.3s ease;
}

.coach-card:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.coach-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.coach-info {
  flex: 1;
}

.coach-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 5px 0;
}

.coach-specialty {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.floating-actions {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
}

.floating-actions .el-button {
  width: 56px;
  height: 56px;
  font-size: 1.3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.floating-actions .el-button:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .stores-container {
    grid-template-columns: 1fr;
  }

  .search-section {
    flex-direction: column;
    align-items: center;
  }

  .search-section .el-input {
    width: 100% !important;
  }

  .detail-header {
    flex-direction: column;
  }

  .detail-image {
    width: 100%;
    height: 200px;
  }

  .coaches-grid {
    grid-template-columns: 1fr;
  }
}
</style>
