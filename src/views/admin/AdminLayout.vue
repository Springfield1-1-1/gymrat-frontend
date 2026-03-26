<template>
  <div class="admin-layout">
    <!-- 顶部导航栏（固定） -->
    <div class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="admin-title">🛡️ 管理后台</h1>
        </div>
        <div class="header-right">
          <el-button type="primary" link @click="goToHome">
            <el-icon><HomeFilled /></el-icon>
            返回前台
          </el-button>
          <el-divider direction="vertical" />
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userInfo.avatarUrl || defaultAvatar">
                {{ userInfo.username?.charAt(0).toUpperCase() }}
              </el-avatar>
              <span class="username">{{ userInfo.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="admin-main">
      <!-- 侧边栏（固定） -->
      <div class="admin-sidebar">
        <el-menu
            :default-active="activeMenu"
            class="sidebar-menu"
            background-color="#001529"
            text-color="#rgba(255,255,255,0.65)"
            active-text-color="#fff"
            router
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><Odometer /></el-icon>
            <span>数据概览</span>
          </el-menu-item>

          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>

          <el-menu-item index="/admin/equipment">
            <el-icon><Tools /></el-icon>
            <span>器械管理</span>
          </el-menu-item>

          <el-menu-item index="/admin/stores">
            <el-icon><Location /></el-icon>
            <span>门店管理</span>
          </el-menu-item>

          <el-menu-item index="/customer-service">
            <el-icon><Headset /></el-icon>
            <span>客服工作平台</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 内容区域（动态切换） -->
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import {
  HomeFilled,
  SwitchButton,
  Odometer,
  User,
  Tools,
  Location
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'AdminLayout',
  components: {
    HomeFilled,
    SwitchButton,
    Odometer,
    User,
    Tools,
    Location
  },
  data() {
    return {
      userInfo: {},
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      activeMenu: '/admin/dashboard'
    }
  },
  mounted() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        this.userInfo = JSON.parse(userStr)
        if (this.userInfo.role !== 'admin') {
          this.$message.error('无权访问管理后台')
          this.$router.push('/')
        }
      } catch (error) {
        this.$message.error('用户信息解析失败')
        this.$router.push('/')
      }
    } else {
      this.$router.push('/login')
    }

    this.activeMenu = this.$route.path
  },
  watch: {
    '$route'(to) {
      this.activeMenu = to.path
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    },
    handleCommand(command) {
      if (command === 'profile') {
        this.$router.push('/profile')
      } else if (command === 'logout') {
        this.logout()
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$message.success('已退出登录')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.admin-header {
  background: #001529;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
}

.admin-title {
  font-size: 20px;
  color: white;
  margin: 0;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-right .el-button {
  color: white;
}

.header-right .el-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
}

.username {
  font-size: 14px;
}

.admin-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.admin-sidebar {
  width: 240px;
  background: #001529;
  flex-shrink: 0;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.65);
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-menu-item.is-active {
  background: #1890ff !important;
  color: white !important;
}

.admin-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 64px;
  }

  .sidebar-menu span:not(.el-icon) {
    display: none;
  }
}
</style>
