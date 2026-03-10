<template>
  <div class="register-page">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <h2>注册</h2>
          <p>创建你的健身达人账号</p>
        </div>
      </template>

      <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          @submit.prevent="handleRegister"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
              v-model="form.username"
              placeholder="请输入用户名（3-20位字母、数字、下划线）"
              size="large"
              clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
          <div class="form-tips">
            <p>用户名只能包含字母、数字和下划线</p>
          </div>
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item prop="phone">
          <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
              clearable
              maxlength="11"
          >
            <template #prefix>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
          <div class="form-tips">
            <p>请输入11位有效的中国大陆手机号</p>
          </div>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码（6-20位，包含大小写字母和数字）"
              size="large"
              show-password
              clearable
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
          <div class="form-tips">
            <p>密码必须包含至少一个大写字母、一个小写字母和一个数字</p>
          </div>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item prop="confirmPassword">
          <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              show-password
              clearable
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 协议提示 -->
        <div class="agreement-notice">
          <p>
            注册即表示您已阅读并同意
            <el-link type="primary" @click="showAgreement">《用户协议》</el-link>
            和
            <el-link type="primary" @click="showPrivacy">《隐私政策》</el-link>
          </p>
        </div>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleRegister"
              style="width: 100%"
          >
            注册
          </el-button>
        </el-form-item>

        <!-- 登录链接 -->
        <div class="login-link">
          <el-link type="primary" @click="goToLogin">
            ← 已有账号？立即登录
          </el-link>
        </div>
      </el-form>
    </el-card>

    <!-- 用户协议弹窗 -->
    <el-dialog
        v-model="agreementDialogVisible"
        title="用户协议"
        width="80%"
        :close-on-click-modal="false"
    >
      <div class="agreement-content" v-html="agreementHtml"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="closeAgreementDialog">
            我已阅读
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 隐私政策弹窗 -->
    <el-dialog
        v-model="privacyDialogVisible"
        title="隐私政策"
        width="80%"
        :close-on-click-modal="false"
    >
      <div class="privacy-content" v-html="privacyHtml"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="closePrivacyDialog">
            我已阅读
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { User, Lock, Iphone } from '@element-plus/icons-vue'
import { marked } from 'marked'
import request from '@/api/request'

// 导入协议文件
import agreementContent from '@/assets/agreement.md?raw'
import privacyContent from '@/assets/privacy.md?raw'

export default {
  name: 'RegisterPage',
  components: {
    User,
    Lock,
    Iphone
  },
  data() {
    // 用户名验证规则
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 3 || value.length > 20) {
        callback(new Error('用户名长度3-20位'))
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        callback(new Error('用户名只能包含字母、数字和下划线'))
      } else {
        callback()
      }
    }

    // 手机号验证规则
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }

    // 密码验证规则
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度6-20位'))
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/.test(value)) {
        callback(new Error('密码必须包含大小写字母和数字'))
      } else {
        callback()
      }
    }

    // 确认密码验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      form: {
        username: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false,
      formRef: null,
      agreementDialogVisible: false,
      privacyDialogVisible: false,
      agreementHtml: '',
      privacyHtml: ''
    }
  },
  mounted() {
    console.log('Register page loaded')
    // 解析 markdown 为 HTML
    this.agreementHtml = marked.parse(agreementContent)
    this.privacyHtml = marked.parse(privacyContent)
  },
  methods: {
    async handleRegister() {
      // 验证表单
      try {
        await this.$refs.formRef.validate()
      } catch (error) {
        console.log('表单验证失败:', error)
        return
      }

      this.loading = true

      try {
        console.log('Register request:', {
          username: this.form.username,
          phone: this.form.phone,
          password: '***' // 不显示真实密码
        })

        // 发送注册请求
        const response = await request.post('/user/register', {
          username: this.form.username,
          phone: this.form.phone,
          password: this.form.password
        })

        console.log('Register response:', response)

        if (response.code === 200) {
          this.$message.success('注册成功！请登录')

          // 延迟跳转到登录页
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        } else {
          this.$message.error(response.message || '注册失败')
        }

      } catch (error) {
        console.error('Register error:', error)
        // request.js 已经处理了错误提示
      } finally {
        this.loading = false
      }
    },

    goToLogin() {
      this.$router.push('/login')
    },

    showAgreement() {
      this.agreementDialogVisible = true
    },

    showPrivacy() {
      this.privacyDialogVisible = true
    },

    // 关闭用户协议弹窗
    closeAgreementDialog() {
      this.agreementDialogVisible = false
    },

    // 关闭隐私政策弹窗
    closePrivacyDialog() {
      this.privacyDialogVisible = false
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 450px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.card-header p {
  margin: 10px 0 0;
  color: #666;
  font-size: 14px;
}

.form-tips {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.form-tips p {
  margin: 0;
}

/* 协议提示样式 */
.agreement-notice {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.agreement-notice p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.agreement-notice .el-link {
  font-size: 14px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-link .el-link {
  font-size: 14px;
}

/* 协议内容样式 */
.agreement-content,
.privacy-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  line-height: 1.6;
}

/* Markdown 样式 */
.agreement-content h1,
.privacy-content h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.agreement-content h2,
.privacy-content h2 {
  color: #666;
  margin: 15px 0 10px;
  font-size: 18px;
}

.agreement-content p,
.privacy-content p {
  color: #666;
  margin: 8px 0;
  font-size: 14px;
}

.agreement-content strong,
.privacy-content strong {
  color: #333;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-card {
    width: 100%;
    max-width: 400px;
  }

  .agreement-content,
  .privacy-content {
    max-height: 300px;
  }

  .agreement-notice {
    padding: 12px;
    font-size: 13px;
  }
}
</style>
