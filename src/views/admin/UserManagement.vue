<template>
  <div class="user-management">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="queryParams" label-width="80px" @submit.prevent="handleQuery">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="搜索">
              <el-input
                  v-model="queryParams.keyword"
                  placeholder="ID/用户名/手机号"
                  clearable
                  @clear="handleQuery"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="状态">
              <el-select
                  v-model="queryParams.status"
                  placeholder="全部状态"
                  clearable
                  @change="handleQuery"
              >
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card class="list-card">
      <!-- 列表标题 -->
      <template #header>
        <div class="card-header">
          <span>用户管理（共 {{ total }} 个用户）</span>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
          :data="userList"
          style="width: 100%"
          border
          stripe
          v-loading="loading"
      >
        <!-- 用户头像 -->
        <el-table-column label="头像" width="80" align="center">
          <template #default="scope">
            <el-avatar
                :size="40"
                :src="scope.row.avatarUrl || defaultAvatar"
                @error="true"
            >
              {{ scope.row.username?.charAt(0).toUpperCase() }}
            </el-avatar>
          </template>
        </el-table-column>

        <!-- 用户ID -->
        <el-table-column label="ID" width="100" align="center">
          <template #default="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <!-- 用户名 -->
        <el-table-column label="用户名" width="150">
          <template #default="scope">
            <div class="username">{{ scope.row.username }}</div>
          </template>
        </el-table-column>

        <!-- 手机号 -->
        <el-table-column label="手机号" width="150">
          <template #default="scope">
            {{ scope.row.phone || '未绑定' }}
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column label="创建时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createdAt) }}
          </template>
        </el-table-column>

        <!-- 更新时间 -->
        <el-table-column label="更新时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.updatedAt) }}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="120" align="center">
          <template #default="scope">
            <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
                @change="handleStatusChange(scope.row)"
                :disabled="loading"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  Search,
  User,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserManagement',
  components: {
    Search,
    User,
    Edit,
    Delete
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        status: null
      },
      // 用户列表
      userList: [],
      // 总数
      total: 0,
      // 加载状态
      loading: false,
      // 默认头像
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    /**
     * 获取用户列表
     */
    async getUserList() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams()

        // 添加查询参数
        Object.keys(this.queryParams).forEach(key => {
          if (this.queryParams[key] !== null && this.queryParams[key] !== '') {
            params.append(key, this.queryParams[key])
          }
        })

        const response = await fetch(`/api/user/admin/list?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (result.code === 200) {
          this.userList = result.data.records || []
          this.total = result.data.total || 0
          this.queryParams.pageNum = result.data.page || 1
          this.queryParams.pageSize = result.data.pageSize || 10
        } else {
          ElMessage.error(result.message || '获取用户列表失败')
        }
      } catch (error) {
        console.error('Error fetching user list:', error)
        ElMessage.error('网络错误，请检查服务是否正常')
      } finally {
        this.loading = false
      }
    },

    /**
     * 处理查询
     */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getUserList()
    },

    /**
     * 重置查询
     */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        status: null
      }
      this.getUserList()
    },

    /**
     * 处理每页数量变化
     */
    handleSizeChange() {
      this.getUserList()
    },

    /**
     * 处理当前页变化
     */
    handleCurrentChange() {
      this.getUserList()
    },

    /**
     * 格式化日期时间
     */
    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    },

    /**
     * 处理状态切换
     */
    async handleStatusChange(row) {
      // 显示确认对话框
      const actionText = row.status === 1 ? '启用' : '禁用'
      const confirmText = `确定要${actionText}用户 "${row.username}" 吗？`

      try {
        await ElMessageBox.confirm(
            confirmText,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
        )

        // 调用更新状态接口
        await this.updateUserStatus(row.id, row.status)
      } catch (error) {
        // 如果用户取消，恢复原状态
        if (error === 'cancel') {
          row.status = row.status === 1 ? 0 : 1
        }
      }
    },

    /**
     * 更新用户状态
     */
    async updateUserStatus(userId, status) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/user/admin/status/${userId}?status=${status}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (result.code === 200) {
          ElMessage.success('用户状态更新成功')
          // 重新加载数据
          this.getUserList()
        } else {
          ElMessage.error(result.message || '用户状态更新失败')
          // 重新加载数据以确保状态同步
          this.getUserList()
        }
      } catch (error) {
        console.error('Error updating user status:', error)
        ElMessage.error('网络错误，请检查服务是否正常')
        // 重新加载数据以确保状态同步
        this.getUserList()
      }
    }
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.list-card {
  min-height: 400px;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.username {
  font-weight: 500;
  color: #1f2937;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-form--label-top /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }

  .el-table /deep/ .el-table__cell {
    padding: 8px 0;
  }
}
</style>
