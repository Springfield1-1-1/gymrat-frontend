<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>登录</h2>
          <p>欢迎使用健身达人系统</p>
        </div>
      </template>

      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="form.rememberMe">
            记住我
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="register-link">
          <el-link type="primary" @click="goToRegister">
            没有账号？立即注册
          </el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { User, Lock } from '@element-plus/icons-vue'
import request from '@/api/request'

export default {
  name: 'LoginPage',
  components: {
    User,
    Lock
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
        rememberMe: false
      },
      loading: false
    }
  },
  mounted() {
    console.log('Login page loaded')
    // 检查是否已登录
    const token = localStorage.getItem('token')
    if (token) {
      this.$router.push('/')
    }
  },
  methods: {
    async handleLogin() {
      if (!this.form.username.trim()) {
        this.$message.warning('请输入用户名')
        return
      }

      if (!this.form.password.trim()) {
        this.$message.warning('请输入密码')
        return
      }

      this.loading = true

      try {
        console.log('Login request:', {
          username: this.form.username,
          password: '***',
          rememberMe: this.form.rememberMe
        })

        // 使用 request 发送请求
        const response = await request.post('/user/login', this.form)
        console.log('Login response:', response)

        if (response.code === 200) {
          // 保存 token 和用户信息
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data))

          this.$message.success('登录成功')

          // 跳转到首页
          setTimeout(() => {
            this.$router.push('/')
          }, 500)
        } else {
          this.$message.error(response.message || '登录失败')
        }

      } catch (error) {
        console.error('Login error:', error)
        // request.js 已经处理了错误提示，这里不需要再显示
      } finally {
        this.loading = false
      }
    },

    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #333;
}

.card-header p {
  margin: 10px 0 0;
  color: #666;
  font-size: 14px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}
</style>
