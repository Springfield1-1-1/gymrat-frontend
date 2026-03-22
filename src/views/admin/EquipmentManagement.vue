<template>
  <div class="equipment-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>⚙️ 器械管理</h2>
          <div class="header-actions">
            <el-input
                v-model="searchKeyword"
                placeholder="搜索器械名称或目标肌群"
                style="width: 300px; margin-right: 10px;"
                clearable
                @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="openAddDialog">
              <el-icon><DocumentAdd /></el-icon>
              添加器械
            </el-button>
          </div>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>

      <!-- 空状态 -->
      <div v-else-if="equipmentList.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无器械数据" />
      </div>

      <!-- 器械列表 -->
      <div v-else class="equipment-list">
        <el-table
            :data="equipmentList"
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
          <el-table-column label="图片" width="180" align="center">
            <template #default="scope">
              <div v-if="scope.row.imageUrl" class="list-image-wrapper">
                <img :src="scope.row.imageUrl" :alt="scope.row.name" class="list-image">
              </div>
              <el-avatar v-else size="small">无图</el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="器械名称" min-width="150"></el-table-column>
          <el-table-column prop="targetMuscles" label="目标肌群" min-width="150"></el-table-column>
          <el-table-column prop="categoryName" label="分类" width="120"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
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

    <!-- 添加/编辑器械对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="60%"
        :before-close="handleClose"
        append-to-body
    >
      <el-form
          ref="equipmentFormRef"
          :model="equipmentForm"
          :rules="formRules"
          label-width="100px"
          status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="器械名称" prop="name">
              <el-input
                  v-model="equipmentForm.name"
                  placeholder="请输入器械名称"
                  maxlength="50"
                  show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分类" prop="categoryId">
              <el-select
                  v-model="equipmentForm.categoryId"
                  placeholder="请选择分类"
                  style="width: 100%;"
                  @change="onCategoryChange"
              >
                <el-option
                    v-for="category in categoryList"
                    :key="category.id"
                    :label="category.categoryName"
                    :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="目标肌群" prop="targetMuscles">
              <el-input
                  v-model="equipmentForm.targetMuscles"
                  placeholder="请输入目标肌群，多个用逗号分隔"
                  maxlength="100"
                  show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="使用方法" prop="usageDescription">
          <el-input
              v-model="equipmentForm.usageDescription"
              type="textarea"
              :rows="4"
              placeholder="请输入详细的使用方法说明"
              maxlength="500"
              show-word-limit
          />
        </el-form-item>

        <el-form-item label="器械图片" prop="imageUrl">
          <div class="image-upload-container">
            <el-upload
                action="/api/equipment/upload-image"
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
              <div v-if="!equipmentForm.imageUrl" class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <p>点击上传图片</p>
                <p class="tip">支持JPG/PNG/GIF格式，大小不超过5MB</p>
              </div>
              <div v-else class="image-preview">
                <img :src="equipmentForm.imageUrl" alt="预览" class="preview-img">
                <div class="image-actions">
                  <el-button circle size="small" @click.stop="removeImage">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-upload>
          </div>
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
  </div>
</template>

<script>
import {
  Search,
  DocumentAdd,
  Edit,
  Delete,
  Plus
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import { get, post, del } from '@/api/request'

export default {
  name: 'EquipmentManagement',
  components: {
    Search,
    DocumentAdd,
    Edit,
    Delete,
    Plus
  },
  data() {
    return {
      // 列表相关
      equipmentList: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchKeyword: '',

      // 对话框相关
      dialogVisible: false,
      isEdit: false,
      submitLoading: false,
      token: localStorage.getItem('token'),

      // 表单数据
      equipmentForm: {
        id: null,
        name: '',
        categoryId: null,
        targetMuscles: '',
        usageDescription: '',
        imageUrl: ''
      },

      // 分类列表
      categoryList: [],

      // 表单验证规则
      formRules: {
        name: [
          { required: true, message: '请输入器械名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择所属分类', trigger: 'change' }
        ],
        targetMuscles: [
          { required: true, message: '请输入目标肌群', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        usageDescription: [
          { required: true, message: '请输入使用方法', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请上传器械图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑器械' : '添加器械'
    }
  },
  created() {
    this.fetchEquipmentData()
    this.fetchCategoryList()
  },
  methods: {
    // 获取器械列表数据
    async fetchEquipmentData() {
      this.loading = true
      try {
        const response = await get('/equipment/list', {
          categoryCode: '',
          keyword: this.searchKeyword,
          page: this.currentPage,
          pageSize: this.pageSize
        })

        if (response && response.code === 200) {
          this.equipmentList = response.data.records || []
          this.total = response.data.total || 0
        } else {
          ElMessage.error(response?.message || '获取器械列表失败')
          this.equipmentList = []
          this.total = 0
        }
      } catch (error) {
        console.error('获取器械列表失败:', error)
        ElMessage.error('网络错误，请检查后端服务')
        this.equipmentList = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },

    // 获取分类列表
    async fetchCategoryList() {
      try {
        const response = await get('/equipment/categories')
        if (response && response.code === 200) {
          this.categoryList = response.data || []
        } else {
          ElMessage.error('获取分类列表失败')
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
        ElMessage.error('网络错误，无法获取分类列表')
      }
    },

    // 打开添加对话框
    openAddDialog() {
      this.isEdit = false
      this.dialogVisible = true
      this.resetForm()
    },

    // 打开编辑对话框
    openEditDialog(row) {
      this.isEdit = true
      this.dialogVisible = true
      this.resetForm()
      this.equipmentForm = { ...row }
    },

    // 重置表单
    resetForm() {
      this.equipmentForm = {
        id: null,
        name: '',
        categoryId: null,
        targetMuscles: '',
        usageDescription: '',
        imageUrl: ''
      }
      if (this.$refs.equipmentFormRef) {
        this.$refs.equipmentFormRef.resetFields()
      }

      // 清除上传组件的状态
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
      })
    },

    // 处理关闭对话框
    handleClose() {
      this.dialogVisible = false
      this.resetForm()
    },

    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchEquipmentData()
    },

    // 分页大小改变
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchEquipmentData()
    },

    // 当前页改变
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchEquipmentData()
    },

    // 图片上传成功回调
    handleImageSuccess(response, uploadFile) {
      if (response && response.code === 200) {
        this.equipmentForm.imageUrl = response.data
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
      this.equipmentForm.imageUrl = ''
      ElMessage.info('已移除图片')

      // 清除上传组件的状态
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles()
        }
        this.$forceUpdate()
      })
    },

    // 提交表单
    submitForm() {
      this.$refs.equipmentFormRef.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            const response = await post('/equipment/save', this.equipmentForm)

            if (response && response.code === 200) {
              ElMessage.success(this.isEdit ? '更新成功' : '创建成功')
              this.handleClose()
              this.fetchEquipmentData()
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

    // 删除器械
    handleDelete(row) {
      ElMessageBox.confirm(
          `确定要删除器械 "${row.name}" 吗？此操作不可恢复`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).then(async () => {
        try {
          const response = await del(`/equipment/${row.id}`)
          if (response && response.code === 200) {
            ElMessage.success('删除成功')
            this.fetchEquipmentData()
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

    // 分类选择变化
    onCategoryChange(value) {
      console.log('分类选择变化:', value)
    }
  }
}
</script>

<style scoped>
.equipment-management {
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

.equipment-list {
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
  height: 100px;
}

.list-image {
  max-width: 100%;
  max-height: 80px;
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
  .equipment-management {
    padding: 10px;
  }

  .upload-placeholder,
  .image-preview {
    width: 120px;
    height: 80px;
  }
}
</style>
