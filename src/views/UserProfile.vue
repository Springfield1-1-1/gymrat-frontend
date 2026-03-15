NEW_FILE_CODE
<template>
  <div class="profile-page">
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
          <h1 class="page-title">👤 个人中心</h1>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="profile-container">
        <!-- 左侧头像区域 -->
        <div class="profile-sidebar">
          <div class="avatar-card">
            <div class="avatar-section">
              <el-avatar
                  :size="120"
                  :src="profileForm.avatarUrl || defaultAvatar"
                  class="user-avatar"
              >
                {{ getAvatarText() }}
              </el-avatar>
              <el-button
                  type="primary"
                  size="small"
                  class="upload-avatar-btn"
                  @click="showAvatarUpload = true"
              >
                <el-icon><Camera /></el-icon>
                更换头像
              </el-button>
            </div>

            <div class="username-section">
              <div class="username-display">
                <el-icon><User /></el-icon>
                <span class="username-text">{{ profileForm.username }}</span>
              </div>
              <el-button
                  type="primary"
                  link
                  size="small"
                  @click="showUsernameDialog = true"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </div>

            <div class="user-id">
              ID: {{ profileForm.userId }}
            </div>
          </div>
        </div>

        <!-- 右侧信息编辑区域 -->
        <div class="profile-main">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">个人信息</span>
                <el-button
                    type="primary"
                    @click="saveProfile"
                    :loading="saving"
                >
                  <el-icon><Check /></el-icon>
                  保存修改
                </el-button>
              </div>
            </template>

            <el-form
                :model="profileForm"
                label-width="100px"
                label-position="left"
                class="profile-form"
            >
              <el-row :gutter="20">
                <!-- 性别 -->
                <el-col :xs="24" :sm="12">
                  <el-form-item label="性别">
                    <el-radio-group v-model="profileForm.gender">
                      <el-radio :value="0">未知</el-radio>
                      <el-radio :value="1">男</el-radio>
                      <el-radio :value="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <!-- 生日 -->
                <el-col :xs="24" :sm="12">
                  <el-form-item label="生日">
                    <el-date-picker
                        v-model="profileForm.birthday"
                        type="date"
                        placeholder="选择生日"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        style="width: 100%"
                    />
                  </el-form-item>
                </el-col>

                <!-- 身高 -->
                <el-col :xs="24" :sm="12">
                  <el-form-item label="身高 (cm)">
                    <el-input-number
                        v-model="profileForm.height"
                        :min="50"
                        :max="250"
                        :step="1"
                        controls-position="right"
                        style="width: 100%"
                    />
                  </el-form-item>
                </el-col>

                <!-- 体重 -->
                <el-col :xs="24" :sm="12">
                  <el-form-item label="体重 (kg)">
                    <el-input-number
                        v-model="profileForm.weight"
                        :min="20"
                        :max="300"
                        :step="0.1"
                        :precision="1"
                        controls-position="right"
                        style="width: 100%"
                    />
                  </el-form-item>
                </el-col>

                <!-- 健身目标 -->
                <el-col :xs="24" :sm="24">
                  <el-form-item label="健身目标">
                    <el-select
                        v-model="profileForm.fitnessGoal"
                        placeholder="请选择健身目标"
                        allow-create
                        filterable
                        style="width: 100%"
                    >
                      <el-option label="增肌" value="增肌" />
                      <el-option label="减脂" value="减脂" />
                      <el-option label="塑形" value="塑形" />
                      <el-option label="保持健康" value="保持健康" />
                      <el-option label="提高体能" value="提高体能" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- 个人简介 -->
                <el-col :xs="24" :sm="24">
                  <el-form-item label="个人简介">
                    <el-input
                        v-model="profileForm.bio"
                        type="textarea"
                        :rows="4"
                        placeholder="介绍一下自己吧~（最多 200 字）"
                        maxlength="200"
                        show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>

          <!-- 统计卡片 -->
          <div class="stats-grid">
            <el-card class="stat-card">
              <div class="stat-icon bmi">
                <el-icon><DataLine /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ calculateBMI }}</div>
                <div class="stat-label">BMI 指数</div>
              </div>
            </el-card>

            <el-card class="stat-card">
              <div class="stat-icon goal">
                <el-icon><Flag /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ profileForm.fitnessGoal || '未设置' }}</div>
                <div class="stat-label">健身目标</div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传头像对话框 -->
    <el-dialog
        v-model="showAvatarUpload"
        title="上传头像"
        width="500px"
    >
      <div class="upload-section">
        <el-upload
            ref="avatarUploader"
            class="avatar-uploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            :before-upload="beforeAvatarUpload"
            accept="image/*"
        >
          <img
              v-if="avatarPreviewUrl"
              :src="avatarPreviewUrl"
              class="avatar-preview"
          >
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <p class="upload-tip">支持 jpg、jpeg、png、gif 格式，大小不超过 10MB</p>
      </div>
      <template #footer>
        <el-button @click="showAvatarUpload = false">取消</el-button>
        <el-button type="primary" @click="uploadAvatar" :loading="uploading">
          上传
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改用户名对话框 -->
    <el-dialog
        v-model="showUsernameDialog"
        title="修改用户名"
        width="400px"
    >
      <el-form :model="usernameForm" label-width="80px">
        <el-form-item label="新用户名" required>
          <el-input
              v-model="usernameForm.username"
              placeholder="请输入新用户名（3-50 个字符）"
              clearable
              maxlength="50"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUsernameDialog = false">取消</el-button>
        <el-button type="primary" @click="updateUsername" :loading="updatingUsername">
          确定
        </el-button>
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
  User,
  Edit,
  Camera,
  Plus,
  Check,
  HomeFilled,
  DataLine,
  Flag
} from '@element-plus/icons-vue'
import request from '@/api/request'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserProfile',
  components: {
    ArrowLeft,
    User,
    Edit,
    Camera,
    Plus,
    Check,
    HomeFilled,
    DataLine,
    Flag
  },
  data() {
    return {
      profileForm: {
        userId: '',
        username: '',
        avatarUrl: '',
        gender: 0,
        birthday: '',
        height: null,
        weight: null,
        fitnessGoal: '',
        bio: ''
      },
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      showAvatarUpload: false,
      showUsernameDialog: false,
      avatarFile: null,
      avatarPreviewUrl: '',
      uploading: false,
      updatingUsername: false,
      saving: false,
      usernameForm: {
        username: ''
      }
    }
  },
  computed: {
    calculateBMI() {
      if (this.profileForm.height && this.profileForm.weight) {
        const heightInMeters = this.profileForm.height / 100
        const bmi = this.profileForm.weight / (heightInMeters * heightInMeters)
        return bmi.toFixed(1)
      }
      return '-'
    }
  },
  mounted() {
    this.loadProfile()
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    },

    // 获取头像显示文字
    getAvatarText() {
      if (this.profileForm.username) {
        return this.profileForm.username.charAt(0).toUpperCase()
      }
      return 'U'
    },

    // 加载个人信息
    async loadProfile() {
      try {
        const response = await request.get('/user/profile')

        if (response && response.code === 200) {
          this.profileForm = {
            userId: response.data.userId || '',
            username: response.data.username || '',
            avatarUrl: response.data.avatarUrl || '',
            gender: response.data.gender !== undefined ? response.data.gender : 0,
            birthday: response.data.birthday || '',
            height: response.data.height || null,
            weight: response.data.weight || null,
            fitnessGoal: response.data.fitnessGoal || '',
            bio: response.data.bio || ''
          }

          // 同步到 localStorage
          this.updateLocalStorage()
        } else {
          ElMessage.warning('获取个人信息失败')
        }
      } catch (error) {
        console.error('加载个人信息失败:', error)
        ElMessage.error('加载失败，请重试')
      }
    },

    // 更新 localStorage 中的用户信息
    updateLocalStorage() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          Object.assign(user, {
            username: this.profileForm.username,
            avatarUrl: this.profileForm.avatarUrl
          })
          localStorage.setItem('user', JSON.stringify(user))
        } catch (error) {
          console.error('更新 localStorage 失败:', error)
        }
      }
    },

    // 保存个人信息
    async saveProfile() {
      // 验证数据
      if (this.profileForm.height && (this.profileForm.height < 50 || this.profileForm.height > 250)) {
        ElMessage.warning('身高必须在 50-250cm 之间')
        return
      }

      if (this.profileForm.weight && (this.profileForm.weight < 20 || this.profileForm.weight > 300)) {
        ElMessage.warning('体重必须在 20-300kg 之间')
        return
      }

      if (this.profileForm.fitnessGoal && this.profileForm.fitnessGoal.length > 50) {
        ElMessage.warning('健身目标最多 50 个字符')
        return
      }

      if (this.profileForm.bio && this.profileForm.bio.length > 200) {
        ElMessage.warning('个人简介最多 200 个字符')
        return
      }

      this.saving = true

      try {
        const payload = {
          gender: this.profileForm.gender,
          birthday: this.profileForm.birthday,
          height: this.profileForm.height,
          weight: this.profileForm.weight,
          fitnessGoal: this.profileForm.fitnessGoal,
          bio: this.profileForm.bio
        }

        const response = await request.put('/user/profile', payload)

        if (response && response.code === 200) {
          ElMessage.success('保存成功')
          this.updateLocalStorage()
        } else {
          throw new Error('保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败，请重试')
      } finally {
        this.saving = false
      }
    },

    // 修改用户名
    async updateUsername() {
      if (!this.usernameForm.username || this.usernameForm.username.trim().length < 3) {
        ElMessage.warning('用户名长度至少 3 个字符')
        return
      }

      if (this.usernameForm.username.length > 50) {
        ElMessage.warning('用户名长度最多 50 个字符')
        return
      }

      this.updatingUsername = true

      try {
        const response = await request.put('/user/username', {
          username: this.usernameForm.username.trim()
        })

        if (response && response.code === 200) {
          ElMessage.success('用户名修改成功')
          this.profileForm.username = this.usernameForm.username.trim()
          this.updateLocalStorage()
          this.showUsernameDialog = false
          this.usernameForm.username = ''
        } else {
          throw new Error(response.message || '修改失败')
        }
      } catch (error) {
        console.error('修改用户名失败:', error)
        // 错误信息已在 request.js 中处理
      } finally {
        this.updatingUsername = false
      }
    },

    // 文件改变时触发
    handleFileChange(file) {
      this.avatarFile = file.raw
      this.avatarPreviewUrl = URL.createObjectURL(file.raw)
    },

    // 上传前验证
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isImage) {
        ElMessage.error('只能上传图片文件！')
        return false
      }

      if (!isLt10M) {
        ElMessage.error('图片大小不能超过 10MB!')
        return false
      }

      return true
    },

    // 上传头像
    async uploadAvatar() {
      if (!this.avatarFile) {
        ElMessage.warning('请选择要上传的图片')
        return
      }

      this.uploading = true

      try {
        const formData = new FormData()
        formData.append('file', this.avatarFile)

        const response = await request.post('/user/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response && response.code === 200) {
          this.profileForm.avatarUrl = response.data
          this.updateLocalStorage()
          ElMessage.success('头像上传成功')
          this.showAvatarUpload = false
          this.avatarFile = null
          this.avatarPreviewUrl = ''
        } else {
          throw new Error('上传失败')
        }
      } catch (error) {
        console.error('上传头像失败:', error)
        // 错误信息已在 request.js 中处理
      } finally {
        this.uploading = false
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
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

.profile-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.profile-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.avatar-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.avatar-section {
  margin-bottom: 20px;
}

.user-avatar {
  border: 4px solid #e5e7eb;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  border-color: #3b82f6;
}

.upload-avatar-btn {
  margin-top: 15px;
}

.username-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  padding: 15px;
  background: #f9fafb;
  border-radius: 8px;
}

.username-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.username-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-id {
  color: #9ca3af;
  font-size: 14px;
  margin-top: 10px;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.profile-form {
  margin-top: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
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
}

.stat-icon.bmi {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.goal {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.upload-section {
  text-align: center;
  padding: 20px;
}

.avatar-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  display: inline-block;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 48px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  margin-top: 15px;
  color: #9ca3af;
  font-size: 13px;
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

@media (max-width: 968px) {
  .profile-container {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    position: static;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nav-left h1 {
    font-size: 20px;
  }

  .avatar-card {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
