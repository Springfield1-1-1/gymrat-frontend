<template>
  <div class="fitness-plan-page">
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
          <h1 class="page-title">📋 健身计划制定</h1>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="plan-container">
        <div class="plan-header">
          <h2 class="plan-title">我的训练计划</h2>
          <p class="plan-desc">（不必强求五分化训练，若时间紧张也可采用三分化或四分化）</p>
        </div>

        <!-- 五天计划 -->
        <div class="week-plan">
          <!-- Day 1 -->
          <div class="day-column">
            <div class="day-header day1">
              <h3>Day 1</h3>
            </div>
            <div class="day-content">
              <div class="exercise-list">
                <div
                    v-for="(exercise, index) in planData.day1"
                    :key="exercise.id"
                    class="exercise-item"
                >
                  <div class="exercise-order">{{ index + 1 }}</div>
                  <div class="exercise-info">
                    <div class="exercise-name">{{ exercise.name }}</div>
                    <div class="exercise-detail">
                      <span class="exercise-sets-reps">{{ exercise.sets }}×{{ exercise.reps }}</span>
                      <span class="exercise-weight" v-if="exercise.weight > 0">{{ exercise.weight }}kg</span>
                    </div>
                  </div>
                  <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="removeExercise('day1', exercise.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-button
                  class="add-exercise-btn"
                  @click="showAddExerciseDialog('day1')"
              >
                <el-icon><Plus /></el-icon>
                添加动作
              </el-button>
            </div>
          </div>

          <!-- Day 2 -->
          <div class="day-column">
            <div class="day-header day2">
              <h3>Day 2</h3>
            </div>
            <div class="day-content">
              <div class="exercise-list">
                <div
                    v-for="(exercise, index) in planData.day2"
                    :key="exercise.id"
                    class="exercise-item"
                >
                  <div class="exercise-order">{{ index + 1 }}</div>
                  <div class="exercise-info">
                    <div class="exercise-name">{{ exercise.name }}</div>
                    <div class="exercise-detail">
                      <span class="exercise-sets-reps">{{ exercise.sets }}×{{ exercise.reps }}</span>
                      <span class="exercise-weight" v-if="exercise.weight > 0">{{ exercise.weight }}kg</span>
                    </div>
                  </div>
                  <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="removeExercise('day2', exercise.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-button
                  class="add-exercise-btn"
                  @click="showAddExerciseDialog('day2')"
              >
                <el-icon><Plus /></el-icon>
                添加动作
              </el-button>
            </div>
          </div>

          <!-- Day 3 -->
          <div class="day-column">
            <div class="day-header day3">
              <h3>Day 3</h3>
            </div>
            <div class="day-content">
              <div class="exercise-list">
                <div
                    v-for="(exercise, index) in planData.day3"
                    :key="exercise.id"
                    class="exercise-item"
                >
                  <div class="exercise-order">{{ index + 1 }}</div>
                  <div class="exercise-info">
                    <div class="exercise-name">{{ exercise.name }}</div>
                    <div class="exercise-detail">
                      <span class="exercise-sets-reps">{{ exercise.sets }}×{{ exercise.reps }}</span>
                      <span class="exercise-weight" v-if="exercise.weight > 0">{{ exercise.weight }}kg</span>
                    </div>
                  </div>
                  <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="removeExercise('day3', exercise.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-button
                  class="add-exercise-btn"
                  @click="showAddExerciseDialog('day3')"
              >
                <el-icon><Plus /></el-icon>
                添加动作
              </el-button>
            </div>
          </div>

          <!-- Day 4 -->
          <div class="day-column">
            <div class="day-header day4">
              <h3>Day 4</h3>
            </div>
            <div class="day-content">
              <div class="exercise-list">
                <div
                    v-for="(exercise, index) in planData.day4"
                    :key="exercise.id"
                    class="exercise-item"
                >
                  <div class="exercise-order">{{ index + 1 }}</div>
                  <div class="exercise-info">
                    <div class="exercise-name">{{ exercise.name }}</div>
                    <div class="exercise-detail">
                      <span class="exercise-sets-reps">{{ exercise.sets }}×{{ exercise.reps }}</span>
                      <span class="exercise-weight" v-if="exercise.weight > 0">{{ exercise.weight }}kg</span>
                    </div>
                  </div>
                  <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="removeExercise('day4', exercise.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-button
                  class="add-exercise-btn"
                  @click="showAddExerciseDialog('day4')"
              >
                <el-icon><Plus /></el-icon>
                添加动作
              </el-button>
            </div>
          </div>

          <!-- Day 5 -->
          <div class="day-column">
            <div class="day-header day5">
              <h3>Day 5</h3>
            </div>
            <div class="day-content">
              <div class="exercise-list">
                <div
                    v-for="(exercise, index) in planData.day5"
                    :key="exercise.id"
                    class="exercise-item"
                >
                  <div class="exercise-order">{{ index + 1 }}</div>
                  <div class="exercise-info">
                    <div class="exercise-name">{{ exercise.name }}</div>
                    <div class="exercise-detail">
                      <span class="exercise-sets-reps">{{ exercise.sets }}×{{ exercise.reps }}</span>
                      <span class="exercise-weight" v-if="exercise.weight > 0">{{ exercise.weight }}kg</span>
                    </div>
                  </div>
                  <el-button
                      type="danger"
                      size="small"
                      circle
                      @click="removeExercise('day5', exercise.id)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-button
                  class="add-exercise-btn"
                  @click="showAddExerciseDialog('day5')"
              >
                <el-icon><Plus /></el-icon>
                添加动作
              </el-button>
            </div>
          </div>
        </div>

        <!-- 保存按钮 -->
        <div class="save-section">
          <el-button
              type="primary"
              size="large"
              @click="savePlan"
              :loading="saving"
          >
            <el-icon><Check /></el-icon>
            保存训练计划
          </el-button>
          <el-button size="large" @click="resetPlan">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 添加动作对话框 -->
    <el-dialog
        v-model="dialogVisible"
        title="添加训练动作"
        width="500px"
    >
      <el-form :model="newExercise" label-width="80px">
        <el-form-item label="动作名称" required>
          <el-input
              v-model="newExercise.name"
              placeholder="例如：高位下拉、卧推..."
              clearable
          />
        </el-form-item>
        <el-form-item label="组数" required>
          <el-input-number
              v-model="newExercise.sets"
              :min="1"
              :max="10"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="每组次数">
          <el-input-number
              v-model="newExercise.reps"
              :min="1"
              :max="100"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="重量 (kg)">
          <el-input-number
              v-model="newExercise.weight"
              :min="0"
              :max="200"
              style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddExercise">确定</el-button>
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
  Plus,
  Delete,
  Check,
  Refresh,
  HomeFilled
} from '@element-plus/icons-vue'
import request from '@/api/request'

export default {
  name: 'FitnessPlan',
  components: {
    ArrowLeft,
    Plus,
    Delete,
    Check,
    Refresh,
    HomeFilled
  },
  data() {
    return {
      planData: {
        day1: [],
        day2: [],
        day3: [],
        day4: [],
        day5: []
      },
      dialogVisible: false,
      currentDay: '',
      newExercise: {
        name: '',
        sets: 3,
        reps: '',
        weight: 0
      },
      saving: false,
      userInfo: {},
      userId: ''
    }
  },
  mounted() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        this.userInfo = JSON.parse(userStr)
        this.userId = this.userInfo.id || this.userInfo.userId || this.userInfo.uid || ''

        if (!this.userId) {
          this.$message.warning('用户信息不完整，请重新登录')
          this.$router.push('/login')
          return
        }

        setTimeout(() => {
          this.loadPlan()
        }, 100)

      } catch (error) {
        this.$message.error('用户信息解析失败，请重新登录')
        this.$router.push('/login')
      }
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    },

    showAddExerciseDialog(day) {
      this.currentDay = day
      this.newExercise = {
        name: '',
        sets: 4,
        reps: '12',
        weight: 20
      }
      this.dialogVisible = true
    },

    confirmAddExercise() {
      if (!this.newExercise.name) {
        this.$message.warning('请输入动作名称')
        return
      }

      const exercise = {
        id: Date.now(),
        name: this.newExercise.name,
        sets: this.newExercise.sets,
        reps: this.newExercise.reps || '-',
        weight: this.newExercise.weight,
        order: this.planData[this.currentDay].length + 1
      }

      this.planData[this.currentDay].push(exercise)
      this.dialogVisible = false
      this.$message.success('动作已添加')
    },

    removeExercise(day, exerciseId) {
      this.planData[day] = this.planData[day].filter(e => e.id !== exerciseId)
      this.planData[day].forEach((exercise, index) => {
        exercise.order = index + 1
      })
    },

    async loadPlan() {
      if (!this.userId) {
        return
      }

      try {
        const response = await request.get('/fitness-plan/current', {
          params: { userId: this.userId }
        })

        if (response && response.code === 200) {
          if (response.data && response.data.planData) {
            const loadedPlan = response.data.planData
            this.planData = {
              day1: loadedPlan.day1 || [],
              day2: loadedPlan.day2 || [],
              day3: loadedPlan.day3 || [],
              day4: loadedPlan.day4 || [],
              day5: loadedPlan.day5 || []
            }
          } else {
            this.planData = {
              day1: [],
              day2: [],
              day3: [],
              day4: [],
              day5: []
            }
          }
        }
      } catch (error) {
        console.error('加载失败:', error)
      }
    },

    async savePlan() {
      if (!this.userId) {
        this.$message.warning('请先登录')
        this.$router.push('/login')
        return
      }

      let hasData = false
      Object.values(this.planData).forEach(day => {
        if (day.length > 0) hasData = true
      })

      if (!hasData) {
        this.$message.warning('请至少添加一个训练动作')
        return
      }

      this.saving = true

      try {
        const payload = {
          userId: this.userId.toString(),
          planData: {
            day1: this.planData.day1.map(e => ({
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight,
              order: e.order
            })),
            day2: this.planData.day2.map(e => ({
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight,
              order: e.order
            })),
            day3: this.planData.day3.map(e => ({
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight,
              order: e.order
            })),
            day4: this.planData.day4.map(e => ({
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight,
              order: e.order
            })),
            day5: this.planData.day5.map(e => ({
              name: e.name,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight,
              order: e.order
            }))
          }
        }

        const response = await request.post('/fitness-plan/save', payload)

        if (response && response.code === 200) {
          this.$message.success('训练计划保存成功！')
        } else {
          throw new Error('保存失败')
        }
      } catch (error) {
        this.$message.error('保存失败，请重试')
      } finally {
        this.saving = false
      }
    },

    resetPlan() {
      this.$confirm('确定要清空所有动作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.planData = {
          day1: [],
          day2: [],
          day3: [],
          day4: [],
          day5: []
        }
        this.$message.success('已清空')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.fitness-plan-page {
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

.main-content {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 30px 20px;
}

.plan-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.plan-header {
  text-align: center;
  margin-bottom: 30px;
}

.plan-title {
  font-size: 28px;
  color: #1f2937;
  margin-bottom: 10px;
}

.plan-desc {
  color: #6b7280;
  font-size: 16px;
}

.week-plan {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.day-column {
  background: #dbf5d1;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.day-column:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.day-header {
  padding: 15px;
  text-align: center;
  color: #333;
  font-weight: 600;
}

.day-header h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #1f2937;
}

.day-label {
  font-size: 13px;
  opacity: 0.9;
}

.day1 .day-header {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.day2 .day-header {
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
}

.day3 .day-header {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.day4 .day-header {
  background: linear-gradient(135deg, #fccb90 0%, #d57eeb 100%);
}

.day5 .day-header {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%);
}

.day-content {
  padding: 15px;
  min-height: 400px;
}

.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exercise-item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.exercise-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.exercise-order {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.exercise-info {
  flex: 1;
  min-width: 0;
}

.exercise-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.exercise-detail {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.exercise-sets-reps {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 12px;
}

.exercise-weight {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 12px;
}

.add-exercise-btn {
  width: 100%;
  margin-top: 10px;
  border-style: dashed;
}

.save-section {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.save-section .el-button {
  margin: 0 10px;
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

@media (max-width: 1200px) {
  .week-plan {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .week-plan {
    grid-template-columns: repeat(2, 1fr);
  }

  .day-content {
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .week-plan {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 20px;
  }

  .plan-title {
    font-size: 22px;
  }
}
</style>
