<template>
  <div class="calorie-calculator-page">
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
          <h1 class="page-title">🔥 热量需求计算器</h1>
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
    </div>

    <!-- 主要内容区域 -->
    <el-main class="main-content">
      <div class="calculator-container">
        <p class="page-desc">科学计算你的每日热量需求，制定合理的饮食计划</p>

        <!-- 输入表单 -->
        <el-card class="form-card">
          <el-form :model="formData" label-width="100px" size="large">
            <el-row :gutter="30">
              <el-col :xs="24" :md="12">
                <el-form-item label="性别">
                  <el-radio-group v-model="formData.gender" class="gender-group">
                    <el-radio-button label="male">男</el-radio-button>
                    <el-radio-button label="female">女</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :md="12">
                <el-form-item label="年龄">
                  <el-input-number
                      v-model="formData.age"
                      :min="1"
                      :max="120"
                      placeholder="请输入年龄"
                      style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :md="12">
                <el-form-item label="身高 (cm)">
                  <el-input-number
                      v-model="formData.height"
                      :min="50"
                      :max="250"
                      placeholder="请输入身高"
                      style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :md="12">
                <el-form-item label="体重 (kg)">
                  <el-input-number
                      v-model="formData.weight"
                      :min="20"
                      :max="300"
                      placeholder="请输入体重"
                      style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="每日运动量">
                  <el-select v-model="formData.activityLevel" placeholder="请选择每日运动量" style="width: 100%">
                    <el-option label="久坐（几乎不运动）" value="sedentary" />
                    <el-option label="少量步行（轻度活动）" value="light" />
                    <el-option label="适量运动（每周 1-2 天）" value="moderate" />
                    <el-option label="健身（每周 3-5 天）" value="active" />
                    <el-option label="极高强度健身（每周 6-7 天）" value="very_active" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-button type="primary" size="large" @click="calculateCalories" class="calculate-btn">
                开始计算
              </el-button>
              <el-button size="large" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 计算结果 -->
        <el-card v-if="showResult" class="result-card">
          <h3 class="result-title">📊 计算结果</h3>

          <el-row :gutter="20">
            <!-- BMI 结果 -->
            <el-col :xs="24" :md="8">
              <div class="result-item bmi-result">
                <div class="result-label">BMI 指数</div>
                <div class="result-value">{{ result.bmi.toFixed(1) }}</div>
                <div class="result-status" :class="getBmiClass(result.bmiCategory)">
                  {{ result.bmiCategory }}
                </div>
                <div class="result-suggestion">
                  {{ result.suggestion }}
                </div>
              </div>
            </el-col>

            <!-- 热量需求 -->
            <el-col :xs="24" :md="16">
              <div class="calorie-results">
                <el-row :gutter="15">
                  <el-col :xs="24" :sm="8">
                    <div class="calorie-item maintain">
                      <el-icon size="24"><Food /></el-icon>
                      <div class="calorie-label">维持体重</div>
                      <div class="calorie-value">{{ result.maintainCalories }} 卡</div>
                      <div class="calorie-desc">保持当前体重所需热量</div>
                    </div>
                  </el-col>

                  <el-col :xs="24" :sm="8">
                    <div class="calorie-item bulk">
                      <el-icon size="24"><Plus /></el-icon>
                      <div class="calorie-label">增肌</div>
                      <div class="calorie-value">{{ result.bulkCalories }} 卡</div>
                      <div class="calorie-desc">建议每日增加 300-500 卡</div>
                    </div>
                  </el-col>

                  <el-col :xs="24" :sm="8">
                    <div class="calorie-item cut">
                      <el-icon size="24"><Minus /></el-icon>
                      <div class="calorie-label">减脂</div>
                      <div class="calorie-value">{{ result.cutCalories }} 卡</div>
                      <div class="calorie-desc">建议每日减少 300-500 卡</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>

          <!-- 详细建议 -->
          <div class="detailed-suggestions">
            <h4>💡 科学建议</h4>
            <el-alert
                :title="getDetailedSuggestion()"
                type="info"
                show-icon
                :closable="false"
            />
          </div>
          <div class="result-actions">
            <el-button type="primary" @click="resetForm">
              重新计算
              <el-icon><Refresh /></el-icon>
            </el-button>
            <el-button @click="goToHome">
              返回首页
              <el-icon><Back /></el-icon>
            </el-button>
          </div>
        </el-card>
      </div>
    </el-main>
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
  SwitchButton,
  Food,
  Plus,
  Minus,
  Refresh,
  Back,
  ArrowLeft,
  HomeFilled
} from '@element-plus/icons-vue'

export default {
  name: 'CalorieCalculator',
  components: {
    SwitchButton,
    Food,
    Plus,
    Minus,
    Refresh,
    Back,
    ArrowLeft,
    HomeFilled
  },
  data() {
    return {
      formData: {
        gender: 'male',
        age: 25,
        height: 175,
        weight: 70,
        activityLevel: ''
      },
      result: {
        bmi: 0,
        bmiCategory: '',
        suggestion: '',
        maintainCalories: 0,
        bulkCalories: 0,
        cutCalories: 0
      },
      showResult: false,
      userInfo: {},
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  mounted() {
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
    // 计算热量需求
    calculateCalories() {
      if (!this.formData.activityLevel) {
        this.$message.warning('请选择每日运动量')
        return
      }

      const { gender, age, height, weight, activityLevel } = this.formData

      // 计算 BMR (基础代谢率) - Mifflin-St Jeor 公式
      let bmr
      if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
      }

      // 根据活动量计算 TDEE (每日总能量消耗)
      const activityMultipliers = {
        sedentary: 1.2,      // 久坐
        light: 1.375,        // 少量步行
        moderate: 1.55,      // 适量运动
        active: 1.725,       // 健身
        very_active: 1.9     // 极高强度
      }

      const tdee = bmr * activityMultipliers[activityLevel]

      // 计算 BMI
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)

      // 判断 BMI区间
      let bmiCategory, suggestion
      if (bmi < 18.5) {
        bmiCategory = '偏瘦'
        suggestion = '您的体重偏轻，建议适当增加热量摄入，配合力量训练增加肌肉量。'
      } else if (bmi >= 18.5 && bmi < 24) {
        bmiCategory = '良好'
        suggestion = '您的体重在健康范围内，请继续保持良好的饮食和运动习惯！'
      } else if (bmi >= 24 && bmi < 28) {
        bmiCategory = '超重'
        suggestion = '您的体重略微超标，建议控制饮食热量，增加有氧运动。'
      } else {
        bmiCategory = '肥胖'
        suggestion = '您的体重超出健康范围，建议制定科学的减脂计划，必要时咨询专业人士。'
      }

      // 设置结果
      this.result = {
        bmi: bmi,
        bmiCategory: bmiCategory,
        suggestion: suggestion,
        maintainCalories: Math.round(tdee),
        bulkCalories: Math.round(tdee + 400),
        cutCalories: Math.round(tdee - 400)
      }

      this.showResult = true
      this.$message.success('计算完成！')
    },

    // 获取 BMI 样式类
    getBmiClass(category) {
      const classMap = {
        '偏瘦': 'bmi-poor',
        '良好': 'bmi-good',
        '超重': 'bmi-fair',
        '肥胖': 'bmi-bad'
      }
      return classMap[category] || ''
    },

    // 获取详细建议
    getDetailedSuggestion() {
      const { bmi, bmiCategory, maintainCalories } = this.result

      let baseSuggestion = ''

      switch(bmiCategory) {
        case '偏瘦':
          baseSuggestion = `您的 BMI 为${bmi.toFixed(1)}，属于偏瘦范围。`
          break
        case '良好':
          baseSuggestion = `您的 BMI 为${bmi.toFixed(1)}，处于健康范围。`
          break
        case '超重':
          baseSuggestion = `您的 BMI 为${bmi.toFixed(1)}，略微超重。`
          break
        case '肥胖':
          baseSuggestion = `您的 BMI 为${bmi.toFixed(1)}，属于肥胖范围。`
          break
      }

      return baseSuggestion + `建议每日摄入${maintainCalories}卡路里来维持当前体重。如需增肌，请增加 300-500 卡；如需减脂，请减少 300-500 卡。同时注意均衡营养，保证蛋白质、碳水化合物和脂肪的合理配比。`
    },

    // 重置表单
    resetForm() {
      this.formData = {
        gender: 'male',
        age: 25,
        height: 175,
        weight: 70,
        activityLevel: ''
      }
      this.showResult = false
      this.result = {
        bmi: 0,
        bmiCategory: '',
        suggestion: '',
        maintainCalories: 0,
        bulkCalories: 0,
        cutCalories: 0
      }
    },

    // 处理命令
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

    goToLogin() {
      this.$router.push('/login')
    },

    goToRegister() {
      this.$router.push('/register')
    },

    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.calorie-calculator-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #c0d2ea 0%, #e2c4c3 100%);
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

.user-section {
  display: flex;
  align-items: center;
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

/* 主要内容 */
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 20px;
}

.calculator-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-desc {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-bottom: 40px;
}

/* 表单卡片 */
.form-card {
  margin-bottom: 30px;
  border-radius: 12px;
}

.gender-group {
  width: 100%;
}

.calculate-btn {
  padding-left: 40px;
  padding-right: 40px;
}

/* 结果卡片 */
.result-card {
  border-radius: 12px;
  animation: fadeIn 0.5s ease;
}

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

.result-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

/* BMI 结果 */
.result-item {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  height: 100%;
}

.result-label {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 10px;
}

.result-value {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
}

.result-status {
  font-size: 20px;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.2);
}

.result-status.bmi-good {
  background: rgba(76, 201, 240, 0.9);
}

.result-status.bmi-fair {
  background: rgba(255, 195, 0, 0.9);
}

.result-status.bmi-poor {
  background: rgba(255, 107, 107, 0.9);
}

.result-status.bmi-bad {
  background: rgba(245, 97, 138, 0.9);
}

.result-suggestion {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.95;
}

/* 热量结果 */
.calorie-results {
  height: 100%;
}

.calorie-item {
  text-align: center;
  padding: 25px 15px;
  border-radius: 12px;
  height: 100%;
  transition: all 0.3s ease;
}

.calorie-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.calorie-item .el-icon {
  margin-bottom: 10px;
}

.calorie-item.maintain {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
}

.calorie-item.bulk {
  background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
  color: #333;
}

.calorie-item.cut {
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  color: #333;
}

.calorie-label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.calorie-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.calorie-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* 详细建议 */
.detailed-suggestions {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.detailed-suggestions h4 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}


.result-actions {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.result-actions .el-button {
  padding-left: 30px;
  padding-right: 30px;
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

/* 页脚 */
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

  .page-desc {
    font-size: 14px;
  }

  .result-value {
    font-size: 36px;
  }

  .calorie-value {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }
}
</style>
