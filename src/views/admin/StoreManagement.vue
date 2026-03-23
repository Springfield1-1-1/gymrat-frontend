<template>
  <div class="store-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>🏪 门店管理</h2>
          <div class="header-actions">
            <el-input
                v-model="searchKeyword"
                placeholder="搜索门店名称、地址或电话"
                style="width: 300px; margin-right: 10px;"
                clearable
                @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="openAddDialog">
              <el-icon><Shop /></el-icon>
              添加门店
            </el-button>
          </div>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>

      <!-- 空状态 -->
      <div v-else-if="storeList.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无门店数据" />
      </div>

      <!-- 门店列表 -->
      <div v-else class="store-list">
        <el-table
            :data="storeList"
            style="width: 100%"
            border
            stripe
            :row-key="row => row.id"
        >
          <el-table-column label="序号" width="80" align="center">
            <template #default="scope">
              {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="图片" width="150" align="center">
            <template #default="scope">
              <div v-if="scope.row.storeImage" class="list-image-wrapper">
                <img :src="scope.row.storeImage" :alt="scope.row.storeName" class="list-image">
              </div>
              <el-avatar v-else size="small">无图</el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="storeName" label="门店名称" min-width="150"></el-table-column>
          <el-table-column prop="city" label="城市" width="120"></el-table-column>
          <el-table-column prop="address" label="地址" min-width="200"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="scope">
              <el-tag :type="getStatusLabelType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" align="center">
            <template #default="scope">
              <el-button
                  size="small"
                  type="primary"
                  link
                  @click="openEditDialog(scope.row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  link
                  @click="handleDelete(scope.row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
              <el-button
                  size="small"
                  type="success"
                  link
                  @click="viewCoaches(scope.row)"
              >
                <el-icon><User /></el-icon>
                教练团队
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
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
    </el-card>

    <!-- 添加/编辑门店对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="60%"
        :before-close="handleClose"
        append-to-body
    >
      <el-form
          ref="storeFormRef"
          :model="storeForm"
          :rules="formRules"
          label-width="100px"
          status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门店名称" prop="storeName">
              <el-input
                  v-model="storeForm.storeName"
                  placeholder="请输入门店名称"
                  maxlength="50"
                  show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在城市" prop="city">
              <el-select
                  v-model="storeForm.city"
                  placeholder="请选择城市"
                  style="width: 100%;"
                  @change="onCityChange"
              >
                <el-option
                    v-for="city in cityList"
                    :key="city"
                    :label="city"
                    :value="city"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="18">
            <el-form-item label="详细地址" prop="address">
              <el-input
                  v-model="storeForm.address"
                  placeholder="请输入详细地址"
                  maxlength="100"
                  show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                  v-model="storeForm.phone"
                  placeholder="请输入联系电话"
                  maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="门店图片" prop="storeImage">
          <div class="image-upload-container">
            <el-upload
                action="/api/gym-stores/upload-image"
                :headers="{ 'Authorization': `Bearer ${token}` }"
                :show-file-list="false"
                :on-success="handleImageSuccess"
                :before-upload="beforeImageUpload"
                :on-error="handleImageError"
                :limit="1"
                accept=".jpg,.jpeg,.png,.gif"
                :auto-upload="true"
                ref="upload"
            >
              <div v-if="!storeForm.storeImage" class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <p>点击上传图片</p>
                <p class="tip">支持 JPG/PNG/GIF 格式，大小不超过 5MB</p>
              </div>
              <div v-else class="image-preview">
                <img :src="storeForm.storeImage" alt="预览" class="preview-img">
                <div class="image-actions">
                  <el-button circle size="small" @click.stop="removeImage">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="营业状态" prop="status">
          <el-switch
              v-model="storeForm.status"
              :active-value="1"
              :inactive-value="0"
              active-text="营业中"
              inactive-text="已关闭"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            {{ isEdit ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 教练管理对话框 -->
    <el-dialog
        v-model="coachDialogVisible"
        title="教练团队管理"
        width="70%"
        :before-close="handleCoachDialogClose"
        append-to-body
    >
      <div class="coach-management">
        <!-- 搜索和添加 -->
        <div class="coach-header">
          <el-input
              v-model="coachSearchKeyword"
              placeholder="搜索教练姓名或特长"
              style="width: 300px; margin-right: 10px;"
              clearable
              @input="handleCoachSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="openAddCoachDialog">
            <el-icon><DocumentAdd /></el-icon>
            添加教练
          </el-button>
        </div>

        <!-- 教练列表 -->
        <div v-if="coachLoading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>
        <div v-else-if="coachList.length === 0" class="empty-state">
          <el-empty description="暂无教练数据" />
        </div>
        <div v-else class="coach-list">
          <el-table
              :data="coachList"
              style="width: 100%"
              border
              stripe
              :row-key="row => row.id"
          >
            <el-table-column label="序号" width="80" align="center">
              <template #default="scope">
                {{ (coachCurrentPage - 1) * coachPageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="头像" width="120" align="center">
              <template #default="scope">
                <el-avatar
                    :size="60"
                    :src="scope.row.coachAvatar || defaultAvatar"
                    @error="true"
                >
                  {{ scope.row.coachName?.charAt(0).toUpperCase() }}
                </el-avatar>
              </template>
            </el-table-column>
            <el-table-column prop="coachName" label="教练姓名" min-width="120"></el-table-column>
            <el-table-column prop="specialty" label="专业特长" min-width="150"></el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="getCoachStatusType(scope.row.status)">
                  {{ getCoachStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template #default="scope">
                <el-button
                    size="small"
                    type="primary"
                    link
                    @click="openEditCoachDialog(scope.row)"
                >
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button
                    size="small"
                    type="danger"
                    link
                    @click="handleDeleteCoach(scope.row)"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
                v-model:current-page="coachCurrentPage"
                v-model:page-size="coachPageSize"
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="coachTotal"
                @size-change="handleCoachSizeChange"
                @current-change="handleCoachCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加/编辑教练对话框 -->
    <el-dialog
        v-model="addCoachDialogVisible"
        :title="isEditCoach ? '编辑教练' : '添加教练'"
        width="50%"
        :before-close="handleAddCoachDialogClose"
        append-to-body
    >
      <el-form
          ref="coachFormRef"
          :model="coachForm"
          :rules="coachFormRules"
          label-width="100px"
          status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教练姓名" prop="coachName">
              <el-input
                  v-model="coachForm.coachName"
                  placeholder="请输入教练姓名"
                  maxlength="50"
                  show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业特长" prop="specialty">
              <el-input
                  v-model="coachForm.specialty"
                  placeholder="请输入专业特长"
                  maxlength="100"
                  show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="教练头像" prop="coachAvatar">
          <div class="image-upload-container">
            <el-upload
                action="/api/coaches/upload-avatar"
                :headers="{ 'Authorization': `Bearer ${token}` }"
                :show-file-list="false"
                :on-success="handleCoachImageSuccess"
                :before-upload="beforeCoachImageUpload"
                :on-error="handleCoachImageError"
                :limit="1"
                accept=".jpg,.jpeg,.png,.gif"
                :auto-upload="true"
                ref="coachUpload"
            >
              <div v-if="!coachForm.coachAvatar" class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <p>点击上传头像</p>
                <p class="tip">支持 JPG/PNG/GIF 格式，大小不超过 5MB</p>
              </div>
              <div v-else class="image-preview">
                <img :src="coachForm.coachAvatar" alt="预览" class="preview-img">
                <div class="image-actions">
                  <el-button circle size="small" @click.stop="removeCoachImage">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="工作状态" prop="status">
          <el-switch
              v-model="coachForm.status"
              :active-value="1"
              :inactive-value="0"
              active-text="在职"
              inactive-text="离职"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleAddCoachDialogClose">取消</el-button>
          <el-button type="primary" @click="submitCoachForm" :loading="submitCoachLoading">
            {{ isEditCoach ? '更新' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Search,
  Shop,
  Edit,
  Delete,
  Plus,
  User,
  DocumentAdd
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import { get, post, del } from '@/api/request'

export default {
  name: 'StoreManagement',
  components: {
    Search,
    Shop,
    Edit,
    Delete,
    Plus,
    User,
    DocumentAdd
  },
  data() {
    return {
      // 门店相关数据
      storeList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchKeyword: '',

      // 门店对话框相关
      dialogVisible: false,
      isEdit: false,
      submitLoading: false,
      token: localStorage.getItem('token'),

      // 门店表单数据
      storeForm: {
        id: null,
        storeName: '',
        city: '',
        address: '',
        phone: '',
        storeImage: '',
        status: 1
      },

      // 城市列表
      cityList: ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉'],

      // 门店表单验证规则
      formRules: {
        storeName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请选择所在城市', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的手机号或座机号', trigger: 'blur' }
        ],
        storeImage: [
          { required: true, message: '请上传门店图片', trigger: 'change' }
        ]
      },

      // 教练管理相关数据
      coachDialogVisible: false,
      currentStoreId: null,
      currentStoreName: '',

      // 教练列表相关
      coachList: [],
      coachLoading: false,
      coachCurrentPage: 1,
      coachPageSize: 10,
      coachTotal: 0,
      coachSearchKeyword: '',

      // 添加/编辑教练对话框相关
      addCoachDialogVisible: false,
      isEditCoach: false,
      submitCoachLoading: false,

      // 教练表单数据
      coachForm: {
        id: null,
        storeId: null,
        coachName: '',
        coachAvatar: '',
        specialty: '',
        status: 1
      },

      // 教练表单验证规则
      coachFormRules: {
        coachName: [
          { required: true, message: '请输入教练姓名', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        specialty: [
          { required: true, message: '请输入专业特长', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        coachAvatar: [
          { required: true, message: '请上传教练头像', trigger: 'change' }
        ]
      },

      // 默认头像
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑门店' : '添加门店'
    }
  },
  created() {
    this.fetchStoreData()
  },
  methods: {
    // 获取状态标签类型
    getStatusLabelType(status) {
      console.log('=== 门店状态调试 ===')
      console.log('原始 status 值:', status)
      console.log('typeof status:', typeof status)
      console.log('status === 1:', status === 1)
      console.log('status == 1:', status == 1)
      console.log('Number(status):', Number(status))
      console.log('===================')

      const statusNum = parseInt(status, 10)
      return statusNum === 1 ? 'success' : 'info'
    },

    // 获取状态文本
    getStatusText(status) {
      const statusNum = parseInt(status, 10)
      return statusNum === 1 ? '营业中' : '已关闭'
    },

    // 获取教练状态类型
    getCoachStatusType(status) {
      const statusNum = parseInt(status, 10)
      return statusNum === 1 ? 'success' : 'info'
    },

    // 获取教练状态文本
    getCoachStatusText(status) {
      const statusNum = parseInt(status, 10)
      return statusNum === 1 ? '在职' : '离职'
    },

    // 获取门店列表数据
    async fetchStoreData() {
      this.loading = true
      try {
        const response = await get('/gym-stores/list', {
          keyword: this.searchKeyword,
          page: this.currentPage,
          pageSize: this.pageSize
        })

        if (response && response.code === 200) {
          console.log('=== 原始响应数据 ===')
          console.log('response.data:', response.data)
          console.log('response.data.records:', response.data.records)

          // 确保状态字段是数字类型
          this.storeList = (response.data.records || []).map(store => {
            const processedStore = {
              ...store,
              status: store.status !== undefined ? parseInt(store.status, 10) : 1
            }
            console.log('处理后的门店数据:', processedStore)
            return processedStore
          })
          this.total = response.data.total || 0

          // 调试信息
          console.log('=== 获取门店列表成功 ===')
          console.log('this.storeList:', this.storeList)
        } else {
          ElMessage.error(response?.message || '获取门店列表失败')
          this.storeList = []
          this.total = 0
        }
      } catch (error) {
        console.error('获取门店列表失败:', error)
        ElMessage.error('网络错误，请检查后端服务')
        this.storeList = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },

    // 打开添加门店对话框
    openAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.resetForm()
    },

    // 打开编辑门店对话框
    openEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.resetForm()
      this.storeForm = { ...row }
      console.log('编辑门店数据:', this.storeForm)
    },

    // 重置门店表单
    resetForm() {
      this.storeForm = {
        id: null,
        storeName: '',
        city: '',
        address: '',
        phone: '',
        storeImage: '',
        status: 1
      }
      if (this.$refs.storeFormRef) {
        this.$refs.storeFormRef.resetFields()
      }

      // 清除上传组件的状态
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
      })
    },

    // 处理关闭门店对话框
    handleClose() {
      this.dialogVisible = false
      this.resetForm()
    },

    // 搜索门店
    handleSearch() {
      this.currentPage = 1
      this.fetchStoreData()
    },

    // 分页大小改变
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchStoreData()
    },

    // 当前页改变
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchStoreData()
    },

    // 图片上传成功回调
    handleImageSuccess(response, uploadFile) {
      if (response && response.code === 200) {
        this.storeForm.storeImage = response.data
        ElMessage.success('图片上传成功')

        // 强制更新视图
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      } else {
        ElMessage.error(response?.message || '图片上传失败')
      }
    },

    // 图片上传前校验
    beforeImageUpload(file) {
      const isImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        ElMessage.error('上传图片只能是 JPG/JPEG/PNG/GIF 格式!')
      }
      if (!isLt5M) {
        ElMessage.error('上传图片大小不能超过 5MB!')
      }

      return isImage && isLt5M
    },

    // 图片上传错误
    handleImageError(err, file, fileList) {
      console.error('图片上传错误:', err)
      ElMessage.error('图片上传失败，请重试')
    },

    // 移除图片
    removeImage() {
      this.storeForm.storeImage = ''
      ElMessage.info('已移除图片')

      // 清除上传组件的状态
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
        this.$forceUpdate()
      })
    },

    // 提交门店表单
    submitForm() {
      this.$refs.storeFormRef.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            const response = await post('/gym-stores/save', this.storeForm)

            if (response && response.code === 200) {
              ElMessage.success(this.isEdit ? '更新成功' : '创建成功')
              this.handleClose()
              this.fetchStoreData()
            } else {
              ElMessage.error(response?.message || (this.isEdit ? '更新失败' : '创建失败'))
            }
          } catch (error) {
            console.error(this.isEdit ? '更新失败:' : '创建失败:', error)
            ElMessage.error('操作失败，请检查网络连接')
          } finally {
            this.submitLoading = false
          }
        }
      })
    },

    // 删除门店
    handleDelete(row) {
      ElMessageBox.confirm(
          `确定要删除门店 "${row.storeName}" 吗？此操作不可恢复`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(async () => {
        try {
          const response = await del(`/gym-stores/${row.id}`)
          if (response && response.code === 200) {
            ElMessage.success('删除成功')
            this.fetchStoreData()
          } else {
            ElMessage.error(response?.message || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          ElMessage.error('删除失败，请检查网络连接')
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    },

    // 城市选择变化
    onCityChange(value) {
      console.log('城市选择变化:', value)
    },

    // 查看教练团队
    viewCoaches(store) {
      this.currentStoreId = store.id
      this.currentStoreName = store.storeName
      this.coachDialogVisible = true
      this.fetchCoachData()
    },

    // 获取教练列表数据
    async fetchCoachData() {
      this.coachLoading = true
      try {
        const response = await get('/coaches/list', {
          storeId: this.currentStoreId,
          keyword: this.coachSearchKeyword,
          page: this.coachCurrentPage,
          pageSize: this.coachPageSize
        })

        if (response && response.code === 200) {
          // 确保状态字段是数字类型
          this.coachList = (response.data.records || []).map(coach => ({
            ...coach,
            status: coach.status !== undefined ? parseInt(coach.status, 10) : 1
          }))
          this.coachTotal = response.data.total || 0

          // 调试信息
          console.log('获取教练列表成功:', this.coachList)
        } else {
          ElMessage.error(response?.message || '获取教练列表失败')
          this.coachList = []
          this.coachTotal = 0
        }
      } catch (error) {
        console.error('获取教练列表失败:', error)
        ElMessage.error('网络错误，请检查后端服务')
        this.coachList = []
        this.coachTotal = 0
      } finally {
        this.coachLoading = false
      }
    },

    // 处理关闭教练对话框
    handleCoachDialogClose() {
      this.coachDialogVisible = false
      this.resetCoachQuery()
    },

    // 重置教练查询条件
    resetCoachQuery() {
      this.coachList = []
      this.coachCurrentPage = 1
      this.coachPageSize = 10
      this.coachTotal = 0
      this.coachSearchKeyword = ''
    },

    // 搜索教练
    handleCoachSearch() {
      this.coachCurrentPage = 1
      this.fetchCoachData()
    },

    // 教练分页大小改变
    handleCoachSizeChange(size) {
      this.coachPageSize = size
      this.coachCurrentPage = 1
      this.fetchCoachData()
    },

    // 教练当前页改变
    handleCoachCurrentChange(page) {
      this.coachCurrentPage = page
      this.fetchCoachData()
    },

    // 打开添加教练对话框
    openAddCoachDialog() {
      this.isEditCoach = false
      this.addCoachDialogVisible = true
      this.resetCoachForm()
      this.coachForm.storeId = this.currentStoreId
    },

    // 打开编辑教练对话框
    openEditCoachDialog(coach) {
      this.isEditCoach = true
      this.addCoachDialogVisible = true
      this.resetCoachForm()
      this.coachForm = { ...coach }
    },

    // 重置教练表单
    resetCoachForm() {
      this.coachForm = {
        id: null,
        storeId: this.currentStoreId,
        coachName: '',
        coachAvatar: '',
        specialty: '',
        status: 1
      }
      if (this.$refs.coachFormRef) {
        this.$refs.coachFormRef.resetFields()
      }

      // 清除上传组件的状态
      this.$nextTick(() => {
        if (this.$refs.coachUpload) {
          this.$refs.coachUpload.clearFiles()
        }
      })
    },

    // 处理关闭添加教练对话框
    handleAddCoachDialogClose() {
      this.addCoachDialogVisible = false
      this.resetCoachForm()
    },

    // 教练头像上传成功回调
    handleCoachImageSuccess(response, uploadFile) {
      if (response && response.code === 200) {
        this.coachForm.coachAvatar = response.data
        ElMessage.success('头像上传成功')

        // 强制更新视图
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      } else {
        ElMessage.error(response?.message || '头像上传失败')
      }
    },

    // 教练头像上传前校验
    beforeCoachImageUpload(file) {
      const isImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        ElMessage.error('上传头像只能是 JPG/JPEG/PNG/GIF 格式!')
      }
      if (!isLt5M) {
        ElMessage.error('上传头像大小不能超过 5MB!')
      }

      return isImage && isLt5M
    },

    // 教练头像上传错误
    handleCoachImageError(err, file, fileList) {
      console.error('头像上传错误:', err)
      ElMessage.error('头像上传失败，请重试')
    },

    // 移除教练头像
    removeCoachImage() {
      this.coachForm.coachAvatar = ''
      ElMessage.info('已移除头像')

      // 清除上传组件的状态
      this.$nextTick(() => {
        if (this.$refs.coachUpload) {
          this.$refs.coachUpload.clearFiles()
        }
        this.$forceUpdate()
      })
    },

    // 提交教练表单
    submitCoachForm() {
      this.$refs.coachFormRef.validate(async (valid) => {
        if (valid) {
          this.submitCoachLoading = true
          try {
            const response = await post('/coaches/save', this.coachForm)

            if (response && response.code === 200) {
              ElMessage.success(this.isEditCoach ? '更新成功' : '创建成功')
              this.handleAddCoachDialogClose()
              this.fetchCoachData()
            } else {
              ElMessage.error(response?.message || (this.isEditCoach ? '更新失败' : '创建失败'))
            }
          } catch (error) {
            console.error(this.isEditCoach ? '更新失败:' : '创建失败:', error)
            ElMessage.error('操作失败，请检查网络连接')
          } finally {
            this.submitCoachLoading = false
          }
        }
      })
    },

    // 删除教练
    handleDeleteCoach(coach) {
      ElMessageBox.confirm(
          `确定要删除教练 "${coach.coachName}" 吗？此操作不可恢复`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(async () => {
        try {
          const response = await del(`/coaches/${coach.id}`)
          if (response && response.code === 200) {
            ElMessage.success('删除成功')
            this.fetchCoachData()
          } else {
            ElMessage.error(response?.message || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          ElMessage.error('删除失败，请检查网络连接')
        }
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }
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

.header-actions {
  display: flex;
  gap: 10px;
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

.store-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 列表中的图片样式 */
.list-image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.list-image {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 图片上传样式 */
.image-upload-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upload-placeholder:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.upload-placeholder .el-icon {
  font-size: 32px;
  color: #999;
}

.upload-placeholder p {
  margin: 5px 0 0;
  color: #999;
  font-size: 14px;
}

.upload-placeholder .tip {
  font-size: 12px;
  opacity: 0.7;
}

.image-preview {
  position: relative;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* 对话框底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 解决上传组件重复上传问题 */
::v-deep(.el-upload--picture-card) {
  display: none !important;
}

::v-deep(.el-upload-list__item) {
  display: none !important;
}

/* 教练管理样式 */
.coach-management {
  padding: 20px;
}

.coach-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.coach-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .header-actions {
    flex-direction: column;
  }

  .header-actions .el-button {
    width: 100%;
  }

  .upload-placeholder,
  .image-preview {
    width: 150px;
    height: 100px;
  }

  .upload-placeholder .el-icon {
    font-size: 24px;
  }

  .upload-placeholder p {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .store-management {
    padding: 10px;
  }

  .upload-placeholder,
  .image-preview {
    width: 120px;
    height: 80px;
  }
}
</style>
