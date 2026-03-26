NEW_FILE_CODE
<template>
  <div class="customer-service-panel">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        <el-icon size="20"><Headset /></el-icon>
        <span class="status-title">客服工作平台</span>
      </div>
      <div class="status-right">
        <el-tag :type="isOnline ? 'success' : 'info'" size="large">
          {{ isOnline ? '在线' : '离线' }}
        </el-tag>
        <el-button
            :type="isOnline ? 'danger' : 'success'"
            size="small"
            @click="toggleOnlineStatus"
        >
          {{ isOnline ? '下线' : '上线' }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button link @click="goToHome">
          <el-icon><Back /></el-icon>
          返回前台
        </el-button>
      </div>
    </div>

    <div class="main-container">
      <!-- 左侧用户列表 -->
      <div class="user-list-panel">
        <div class="panel-header">
          <div class="header-actions">
            <el-input
                v-model="searchUser"
                placeholder="搜索用户..."
                clearable
                @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button
                type="primary"
                size="small"
                @click="refreshUserList"
                circle
            >
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="user-list">
          <div
              v-for="user in filteredUsers"
              :key="user.userId"
              :class="['user-item', currentUserId === user.userId ? 'active' : '']"
              @click="selectUser(user)"
          >
            <div class="user-avatar">
              <el-badge :value="user.unreadCount" :hidden="user.unreadCount === 0">
                <el-avatar :size="45" :src="user.avatarUrl || defaultAvatar">
                  {{ user.username?.charAt(0).toUpperCase() }}
                </el-avatar>
              </el-badge>
            </div>
            <div class="user-info">
              <div class="user-header">
                <span class="username">{{ user.username }}</span>
                <span class="time">{{ formatTime(user.lastMessageTime) }}</span>
              </div>
              <div class="last-message">
                {{ user.lastMessage || '暂无消息' }}
              </div>
            </div>
          </div>

          <el-empty v-if="filteredUsers.length === 0" description="暂无会话" />
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat-panel">
        <div v-if="currentUserId" class="chat-container">
          <!-- 聊天头部 -->
          <div class="chat-header">
            <div class="chat-user-info">
              <el-avatar :size="40" :src="currentUserAvatar">
                {{ currentUserName?.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="user-detail">
                <div class="name">{{ currentUserName }}</div>
                <div class="status">
                  <span class="status-dot" :class="{ online: userIsOnline }"></span>
                  {{ userIsOnline ? '在线' : '离线' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 消息列表 -->
          <div class="chat-messages" ref="messagesContainer">
            <div
                v-for="(message, index) in currentMessages"
                :key="index"
                :class="['message-item', message.isSelf ? 'message-sent' : 'message-received']"
            >
              <div v-if="!message.isSelf" class="message-avatar">
                <el-avatar :size="40" :src="currentUserAvatar">
                  {{ currentUserName?.charAt(0).toUpperCase() }}
                </el-avatar>
              </div>

              <div class="message-content">
                <div class="message-bubble">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatMessageTime(message.timestamp) }}
                </div>
              </div>

              <div v-if="message.isSelf" class="message-avatar">
                <el-avatar :size="40" class="customer-avatar">
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
              </div>
            </div>

            <div v-if="isUserTyping" class="typing-indicator">
              <el-avatar :size="40" :src="currentUserAvatar">
                {{ currentUserName?.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="typing-bubble">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="chat-input-area">
            <el-input
                v-model="inputContent"
                type="textarea"
                :rows="3"
                placeholder="输入回复内容..."
                @keydown.enter.exact.prevent="sendMessage"
                @input="handleInput"
            />
            <div class="input-actions">
              <el-button
                  type="primary"
                  :disabled="!inputContent.trim() || !isConnected"
                  @click="sendMessage"
              >
                发送
              </el-button>
            </div>
          </div>
        </div>

        <el-empty v-else description="请选择一个会话开始聊天" />
      </div>
    </div>
  </div>
</template>

<script>
import { Headset, Back, UserFilled, Search, Refresh } from '@element-plus/icons-vue'
import WebSocketService from '@/utils/websocket'
import { ElMessage } from 'element-plus'

export default {
  name: 'CustomerServicePanel',
  components: {
    Headset,
    Back,
    UserFilled,
    Search,
    Refresh
  },
  data() {
    return {
      isOnline: false,
      searchUser: '',
      users: [],
      currentUserId: null,
      currentUserName: '',
      currentUserAvatar: '',
      userIsOnline: false,
      messages: {},
      inputContent: '',
      isConnected: false,
      isUserTyping: false,
      typingTimer: null,
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      customerId: 'customer_001'
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchUser) {
        return this.users
      }
      return this.users.filter(user =>
          user.username.toLowerCase().includes(this.searchUser.toLowerCase())
      )
    },
    currentMessages() {
      return this.messages[this.currentUserId] || []
    }
  },
  mounted() {
    this.initWebSocket()
  },
  beforeDestroy() {
    WebSocketService.removeHandler(this.handleMessage)
  },
  methods: {
    initWebSocket() {
      try {
        console.log('客服连接 WebSocket:', this.customerId)
        WebSocketService.connect(this.customerId)
        WebSocketService.addHandler(this.handleMessage)

        this.loadUserList()
      } catch (error) {
        console.error('初始化 WebSocket 失败:', error)
        ElMessage.error('客服系统初始化失败')
      }
    },

    async loadUserList() {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch('/api/user/admin/list?pageNum=1&pageSize=100', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (result.code === 200) {
          const users = result.data.records || []

          this.users = users.map(user => ({
            userId: 'user_' + user.id,
            username: user.username,
            avatarUrl: user.avatarUrl || this.defaultAvatar,
            unreadCount: 0,
            lastMessage: '',
            lastMessageTime: new Date(user.createdAt).getTime(),
            phone: user.phone,
            status: user.status
          }))

          console.log('加载用户列表成功:', this.users.length)
        } else {
          ElMessage.error(result.message || '获取用户列表失败')
        }
      } catch (error) {
        console.error('Error loading user list:', error)
        ElMessage.error('网络错误，请检查服务是否正常')
      }
    },

    handleMessage(message) {
      console.log('客服收到消息:', message)

      switch (message.type) {
        case 'chat':
          const fromId = message.fromId
          const messageData = {
            isSelf: false,
            content: message.content,
            timestamp: message.timestamp || Date.now()
          }

          if (!this.messages[fromId]) {
            this.messages[fromId] = []
          }
          this.messages[fromId].push(messageData)

          const existingUser = this.getUserById(fromId)
          if (existingUser) {
            this.updateUserInfo(fromId, {
              lastMessage: message.content,
              lastMessageTime: message.timestamp || Date.now(),
              unreadCount: (existingUser.unreadCount || 0) + 1
            })

            if (this.currentUserId === fromId) {
              this.userIsOnline = true
            }
          } else {
            this.fetchUserDetails(fromId).then(() => {
              const newUser = this.getUserById(fromId)
              if (newUser) {
                newUser.lastMessage = message.content
                newUser.lastMessageTime = message.timestamp || Date.now()
                newUser.unreadCount = 1
              }
            })
          }

          if (this.currentUserId === fromId) {
            this.scrollToBottom()
          }
          break

        case 'typing':
          const typingUserId = message.fromId
          if (this.currentUserId === typingUserId) {
            this.showUserTyping()
            this.userIsOnline = true
          } else {
            const user = this.getUserById(typingUserId)
            if (user) {
              user.isOnline = true
              user.lastMessageTime = Date.now()
            }
          }
          break

        case 'connected':
          this.isConnected = true
          this.isOnline = true
          console.log('客服已连接')
          break

        case 'disconnect':
          const disconnectUserId = message.userId
          if (disconnectUserId) {
            const user = this.getUserById(disconnectUserId)
            if (user) {
              user.isOnline = false
              if (this.currentUserId === disconnectUserId) {
                this.userIsOnline = false
              }
            }
          }
          break
      }
    },

    selectUser(user) {
      this.currentUserId = user.userId
      this.currentUserName = user.username
      this.currentUserAvatar = user.avatarUrl

      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
      this.userIsOnline = user.lastMessageTime > fiveMinutesAgo

      user.unreadCount = 0

      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    sendMessage() {
      if (!this.inputContent.trim() || !this.currentUserId) {
        return
      }

      const success = WebSocketService.sendMessage(
          this.inputContent.trim(),
          this.currentUserId
      )

      if (success) {
        const messageData = {
          isSelf: true,
          content: this.inputContent.trim(),
          timestamp: Date.now()
        }

        if (!this.messages[this.currentUserId]) {
          this.messages[this.currentUserId] = []
        }
        this.messages[this.currentUserId].push(messageData)

        this.updateUserInfo(this.currentUserId, {
          lastMessage: this.inputContent.trim(),
          lastMessageTime: Date.now()
        })

        this.inputContent = ''
        this.scrollToBottom()
      }
    },

    handleInput() {
      if (this.isConnected && this.currentUserId) {
        const typingMessage = {
          type: 'typing',
          targetId: this.currentUserId
        }
        try {
          WebSocketService.ws.send(JSON.stringify(typingMessage))
        } catch (error) {
          console.error('发送输入状态失败:', error)
        }
      }
    },

    showUserTyping() {
      this.isUserTyping = true

      if (this.typingTimer) {
        clearTimeout(this.typingTimer)
      }

      this.typingTimer = setTimeout(() => {
        this.isUserTyping = false
      }, 3000)
    },

    toggleOnlineStatus() {
      this.isOnline = !this.isOnline
      ElMessage.success(this.isOnline ? '已上线' : '已下线')
    },

    refreshUserList() {
      this.loadUserList()
      ElMessage.success('用户列表已刷新')
    },

    goToHome() {
      this.$router.push('/')
    },

    getUserById(userId) {
      const numericId = userId.replace('user_', '')
      return this.users.find(u => u.userId === userId || String(u.userId).replace('user_', '') === numericId)
    },

    updateUserInfo(userId, updates) {
      const user = this.users.find(u => u.userId === userId)
      if (user) {
        Object.assign(user, updates)
        this.users.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
      }
    },

    async fetchUserDetails(userId) {
      try {
        const token = localStorage.getItem('token')
        const numericId = userId.replace('user_', '')

        const response = await fetch(`/api/user/admin/info/${numericId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (result.code === 200) {
          const user = result.data
          const existingUser = this.getUserById(userId)

          if (existingUser) {
            existingUser.username = user.username
            existingUser.avatarUrl = user.avatarUrl || this.defaultAvatar
            existingUser.phone = user.phone
          }
        }
      } catch (error) {
        console.error('获取用户详情失败:', error)
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`

      return `${date.getMonth() + 1}/${date.getDate()}`
    },

    formatMessageTime(timestamp) {
      const date = new Date(timestamp)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    },

    handleSearch() {
      if (!this.searchUser) {
        // 可选：是否需要重新加载
      }
    }
  }
}
</script>

<style scoped>
.customer-service-panel {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.status-bar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.main-container {
  flex: 1;
  display: grid;
  grid-template-columns: 350px 1fr;
  overflow: hidden;
}

.user-list-panel {
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-actions .el-input {
  flex: 1;
}

.user-list {
  flex: 1;
  overflow-y: auto;
}

.user-item {
  display: flex;
  gap: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f5f5f5;
}

.user-item:hover {
  background: #f5f7fa;
}

.user-item.active {
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.username {
  font-weight: 600;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.last-message {
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  font-size: 16px;
}

.status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #666;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

.status-dot.online {
  background: #67c23a;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
}

.message-item {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.message-received {
  flex-direction: row;
}

.message-sent {
  flex-direction: row;
}

.message-avatar {
  flex-shrink: 0;
}

.customer-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-content {
  max-width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-sent .message-content {
  margin-left: auto;
  align-items: flex-end;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  background: white;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-sent .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 10px;
  align-items: center;
}

.typing-bubble {
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  display: flex;
  gap: 4px;
}

.typing-bubble span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-bubble span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-bubble span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.chat-input-area {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.user-list::-webkit-scrollbar,
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.user-list::-webkit-scrollbar-track,
.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.user-list::-webkit-scrollbar-thumb,
.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
</style>
