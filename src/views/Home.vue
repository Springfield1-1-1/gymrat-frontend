<template>
  <div class="home-page">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>🏋️‍♂️ 健身达人</h1>
        </div>

        <div class="user-section">
          <div v-if="userInfo.username" class="user-info">
            <el-dropdown @command="handleCommand">
              <span class="user-dropdown">
                <el-avatar :size="36" :src="userInfo.avatarUrl || defaultAvatar">
                  {{ userInfo.username.charAt(0).toUpperCase() }}
                </el-avatar>
                <span class="username">{{ userInfo.username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-else class="auth-buttons">
            <el-button type="primary" @click="goToLogin">登录</el-button>
            <el-button @click="goToRegister">注册</el-button>
          </div>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区域 -->
    <el-main class="main-content">
      <!-- 欢迎横幅 -->
      <div class="welcome-section">
        <h2 class="welcome-title">欢迎来到健身达人</h2>
        <p class="welcome-desc">科学健身，健康生活，从这里开始</p>
      </div>

      <!-- 核心功能模块 -->
      <div class="core-features">
        <el-row :gutter="30">
          <!-- 健身入门指南 -->
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card
                class="feature-card"
                shadow="hover"
                @click="navigateTo('guide')"
            >
              <div class="feature-icon guide">
                <el-icon size="48"><Reading /></el-icon>
              </div>
              <h3 class="feature-title">健身入门指南</h3>
              <p class="feature-desc">从零开始学习健身基础知识，掌握科学训练方法</p>
              <div class="feature-tags">
                <el-tag size="small">基础知识</el-tag>
                <el-tag size="small" type="success">饮食指导</el-tag>
                <el-tag size="small" type="warning">新手建议</el-tag>
              </div>
              <el-button class="feature-btn" type="primary" text>
                开始学习 →
              </el-button>
            </el-card>
          </el-col>

          <!-- 器械分类及教学 -->
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card
                class="feature-card"
                shadow="hover"
                @click="navigateTo('equipment')"
            >
              <div class="feature-icon equipment">
                <el-icon size="48"><Tools /></el-icon>
              </div>
              <h3 class="feature-title">器械分类及教学</h3>
              <p class="feature-desc">了解各类健身器械，学习正确使用方法</p>
              <div class="feature-tags">
                <el-tag size="small">背肩器械</el-tag>
                <el-tag size="small" type="success">胸部器械</el-tag>
                <el-tag size="small" type="danger">臀腿器械</el-tag>
              </div>
              <el-button class="feature-btn" type="primary" text>
                查看器械 →
              </el-button>
            </el-card>
          </el-col>

          <!-- 热量需求计算器 -->
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card
                class="feature-card"
                shadow="hover"
                @click="navigateTo('calorie-calculator')"
            >
              <div class="feature-icon calorie">
                <el-icon size="48"><Food /></el-icon>
              </div>
              <h3 class="feature-title">热量需求计算器</h3>
              <p class="feature-desc">计算你的每日热量需求，科学规划饮食摄入</p>
              <div class="feature-tags">
                <el-tag size="small">基础代谢</el-tag>
                <el-tag size="small" type="success">热量计算</el-tag>
                <el-tag size="small" type="warning">营养配比</el-tag>
              </div>
              <el-button class="feature-btn" type="primary" text>
                开始计算 →
              </el-button>
            </el-card>
          </el-col>

          <!-- 健身计划制定 -->
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card
                class="feature-card"
                shadow="hover"
                @click="navigateTo('fitness-plan')"
            >
              <div class="feature-icon plan">
                <el-icon size="48"><Calendar /></el-icon>
              </div>
              <h3 class="feature-title">健身计划制定</h3>
              <p class="feature-desc">定制专属的健身训练计划，跟踪训练进度</p>
              <div class="feature-tags">
                <el-tag size="small">训练计划</el-tag>
                <el-tag size="small" type="success">动作指导</el-tag>
                <el-tag size="small" type="warning">进度跟踪</el-tag>
              </div>
              <el-button class="feature-btn" type="primary" text>
                制定计划 →
              </el-button>
            </el-card>
          </el-col>

          <!-- 周边门店以及教练介绍 -->
          <el-col :xs="24" :sm="12" :lg="8">
            <el-card
                class="feature-card"
                shadow="hover"
                @click="navigateTo('store')"
            >
              <div class="feature-icon store">
                <el-icon size="48"><Location /></el-icon>
              </div>
              <h3 class="feature-title">周边门店及教练</h3>
              <p class="feature-desc">查找附近的健身场所，预约专业教练指导</p>
              <div class="feature-tags">
                <el-tag size="small">附近门店</el-tag>
                <el-tag size="small" type="success">专业教练</el-tag>
                <el-tag size="small" type="warning">课程预约</el-tag>
              </div>
              <el-button class="feature-btn" type="primary" text>
                探索周边 →
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 用户状态提示 -->
      <div class="user-status" v-if="!userInfo.username">
        <el-alert
            title="登录后享受更多功能"
            type="info"
            show-icon
            :closable="false"
        >
          <template #default>
            <p>登录后可以保存你的健身计划、记录训练进度、预约教练等</p>
            <div class="alert-actions">
              <el-button type="primary" @click="goToLogin">立即登录</el-button>
              <el-button @click="goToRegister">注册账号</el-button>
            </div>
          </template>
        </el-alert>
      </div>
    </el-main>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <p class="copyright">© 2026 健身达人系统 | 科学健身，健康生活</p>
        <p class="contact">如有问题请联系：+86 18350232283</p>
      </div>
    </el-footer>
  </div>
</template>

<script>
import {
  Reading,
  Tools,
  Calendar,
  Location,
  SwitchButton,
  Food
} from '@element-plus/icons-vue'

export default {
  name: 'HomePage',
  components: {
    Reading,
    Tools,
    Calendar,
    Location,
    SwitchButton,
    Food
  },
  data() {
    return {
      userInfo: {},
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  mounted() {
    // 从 localStorage 获取用户信息
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        this.userInfo = JSON.parse(userStr)
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
  },
  methods: {
    // 导航到功能页面
    navigateTo(feature) {
      switch (feature) {
        case 'guide':
          this.$router.push('/guide')
          break
        case 'equipment':
          this.$router.push('/equipment')
          break
        case 'calorie-calculator':
          this.$router.push('/calorie-calculator')
          break
        case 'fitness-plan':
          this.$message.info('健身计划制定页面开发中...')
          // this.$router.push('/fitness-plan')
          break
        case 'store':
          this.$message.info('周边门店及教练页面开发中...')
          // this.$router.push('/store')
          break
      }
    },

    // 处理下拉菜单命令
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
      }
    },

    // 退出登录
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.userInfo = {}
      this.$message.success('已退出登录')
      this.$router.push('/login')
    },

    // 跳转到登录页
    goToLogin() {
      this.$router.push('/login')
    },

    // 跳转到注册页
    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 头部样式 */
.header {
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f5f5;
}

.username {
  font-weight: 500;
  color: #333;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

/* 主要内容样式 */
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 20px;
}

/* 欢迎区域 */
.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

.welcome-title {
  font-size: 36px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.welcome-desc {
  font-size: 18px;
  color: #666;
  margin: 0;
}

/* 核心功能卡片 */
.core-features {
  margin-bottom: 10px;
}

.feature-card {
  height: 94%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  margin-bottom: 60px;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important;
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.feature-icon.guide {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.feature-icon.equipment {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.feature-icon.calorie {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.feature-icon.plan {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.feature-icon.store {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.feature-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  min-height: 44px;
}

.feature-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.feature-btn {
  margin-top: 10px;
}

/* 用户状态提示 */
.user-status {
  margin-top: 40px;
}

.alert-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

/* 页脚样式 */
.footer {
  background: white;
  border-top: 1px solid #e8e8e8;
  padding: 30px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.copyright {
  color: #666;
  margin-bottom: 10px;
}

.contact {
  color: #999;
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 28px;
  }

  .welcome-desc {
    font-size: 16px;
  }

  .feature-card {
    margin-bottom: 20px;
  }

  .alert-actions {
    flex-direction: column;
    align-items: center;
  }

  .alert-actions .el-button {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 576px) {
  .welcome-title {
    font-size: 24px;
  }

  .welcome-desc {
    font-size: 14px;
  }

  .feature-title {
    font-size: 18px;
  }

  .feature-desc {
    font-size: 13px;
  }
}
</style>
