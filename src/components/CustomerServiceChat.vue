NEW_FILE_CODE
<template>
  <div class="customer-service">
    <!-- 聊天入口按钮 -->
    <el-badge
        :value="unreadCount"
        :hidden="unreadCount === 0 || !isLoggedIn"
        class="chat-badge"
    >
      <el-button
          circle
          type="primary"
          size="large"
          class="chat-btn"
          @click="toggleChatWindow"
      >
        <el-icon><ChatDotRound /></el-icon>
      </el-button>
    </el-badge>

    <!-- 聊天窗口 -->
    <transition name="slide-fade">
      <div v-if="showChatWindow && isLoggedIn" class="chat-window">
        <div class="chat-header">
          <div class="header-title">
            <el-icon><UserFilled /></el-icon>
            <span>在线客服</span>
          </div>
          <div class="header-actions">
            <el-tooltip content="最小化">
              <el-button link @click="minimizeChat">
                <el-icon><Minus /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="关闭">
              <el-button link @click="closeChatWindow">
                <el-icon><Close /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <div class="chat-status" v-if="onlineInfo.count > 0">
          <span class="status-dot online"></span>
          <span>{{ onlineInfo.customers }} 位客服在线 | {{ onlineInfo.count }} 人在线</span>
        </div>

        <!-- 消息列表 -->
        <div class="chat-messages" ref="messagesContainer">
          <div
              v-for="(message, index) in messages"
              :key="index"
              class="message-item"
              :class="message.isSelf || !message.fromId ? 'message-sent' : 'message-received'"
          >
            <template v-if="message.isSelf || !message.fromId">
              <!-- 自己发送的消息：内容在左，头像在右 -->
              <div class="message-content">
                <div class="message-bubble">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>

              <div class="message-avatar">
                <el-avatar :size="40" :src="userAvatar">
                  {{ userNickname?.charAt(0).toUpperCase() }}
                </el-avatar>
              </div>
            </template>

            <template v-else>
              <!-- 客服发来的消息：头像在左，内容在右 -->
              <div class="message-avatar">
                <el-avatar :size="40" class="customer-avatar">
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
              </div>

              <div class="message-content">
                <div class="message-bubble">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>
            </template>
          </div>

          <!-- 正在输入提示 -->
          <div v-if="isTyping" class="typing-indicator">
            <el-avatar :size="40" class="customer-avatar">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
            <div class="typing-bubble">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <!-- 空状态提示 -->
          <div v-if="messages.length === 0" class="empty-state">
            <el-empty description="暂无消息，开始和客服对话吧~" :image-size="80" />
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <el-input
              v-model="inputContent"
              type="textarea"
              :rows="2"
              placeholder="输入消息..."
              @keydown.enter.exact.prevent="sendMessage"
              @input="handleInput"
          />
          <div class="input-actions">
            <el-button
                type="primary"
                size="small"
                :disabled="!inputContent.trim() || !isConnected"
                @click="sendMessage"
            >
              发送
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ChatDotRound, Close, Minus, UserFilled } from '@element-plus/icons-vue'
import WebSocketService from '@/utils/websocket'
import { ElMessage } from 'element-plus'

export default {
  name: 'CustomerServiceChat',
  components: {
    ChatDotRound,
    UserFilled,
    Close,
    Minus
  },
  data() {
    return {
      showChatWindow: false,
      messages: [],
      inputContent: '',
      unreadCount: 0,
      isTyping: false,
      typingTimer: null,
      onlineInfo: {
        count: 0,
        customers: 0
      },
      userAvatar: '',
      userNickname: '',
      targetId: '',
      isLoggedIn: false,
      isConnected: false
    }
  },
  mounted() {
    this.initUserInfo()
    if (this.isLoggedIn) {
      this.initWebSocket()
    }
  },
  beforeDestroy() {
    if (this.isLoggedIn) {
      WebSocketService.removeHandler(this.handleMessage)
    }
  },
  methods: {
    initUserInfo() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          this.userAvatar = user.avatarUrl || ''
          this.userNickname = user.username || '用户'
          this.isLoggedIn = true
        } catch (error) {
          console.error('解析用户信息失败:', error)
          this.isLoggedIn = false
        }
      } else {
        this.isLoggedIn = false
      }
    },

    initWebSocket() {
      if (!this.isLoggedIn) {
        return
      }

      try {
        const userStr = localStorage.getItem('user')
        const user = JSON.parse(userStr)
        const userId = 'user_' + (user.id || user.userId || user.uid || Date.now())

        console.log('正在连接 WebSocket, userId:', userId)

        WebSocketService.connect(userId)
        WebSocketService.addHandler(this.handleMessage)
        this.targetId = 'customer_001'

        const connectionHandler = (message) => {
          if (message.type === 'connected') {
            this.isConnected = true
            console.log('WebSocket 已连接')
          }
        }
        WebSocketService.addHandler(connectionHandler)

      } catch (error) {
        console.error('初始化 WebSocket 失败:', error)
        ElMessage.warning('客服系统初始化失败')
      }
    },

    handleMessage(message) {
      console.log('收到 WebSocket 消息:', message)

      switch (message.type) {
        case 'chat':
          this.messages.push({
            fromId: message.fromId,
            content: message.content,
            timestamp: message.timestamp || Date.now()
          })
          this.unreadCount++
          this.scrollToBottom()

          if (!this.showChatWindow) {
            ElMessage.success('收到新消息')
          }
          break

        case 'chat_sent':
          const tempIndex = this.messages.findIndex(m =>
              m.temp && m.content === message.content
          )
          if (tempIndex > -1) {
            this.messages[tempIndex].temp = false
            this.messages[tempIndex].timestamp = message.timestamp || Date.now()
          } else {
            this.messages.push({
              toId: message.toId,
              content: message.content,
              timestamp: message.timestamp || Date.now(),
              isSelf: true
            })
          }
          this.scrollToBottom()
          break

        case 'typing':
          this.showTyping()
          break

        case 'online_count':
          this.onlineInfo = {
            count: message.count,
            customers: message.customers || 0
          }
          console.log('在线人数更新:', this.onlineInfo)
          break

        case 'connected':
          this.isConnected = true
          console.log('客服聊天已连接')
          break

        default:
          console.log('未知消息类型:', message.type)
      }
    },

    sendMessage() {
      if (!this.inputContent.trim()) {
        return
      }

      if (!this.isConnected) {
        ElMessage.warning('正在连接客服，请稍后再试')
        return
      }

      const tempMessage = {
        isSelf: true,
        content: this.inputContent.trim(),
        timestamp: Date.now(),
        temp: true
      }
      this.messages.push(tempMessage)
      this.scrollToBottom()

      const success = WebSocketService.sendMessage(
          this.inputContent.trim(),
          this.targetId
      )

      if (success) {
        this.inputContent = ''
        this.unreadCount = 0
      } else {
        const index = this.messages.indexOf(tempMessage)
        if (index > -1) {
          this.messages.splice(index, 1)
        }
        ElMessage.error('发送失败，请重试')
      }
    },

    handleInput() {
      if (this.isConnected) {
        WebSocketService.sendTypingStatus(this.targetId)
      }
    },

    showTyping() {
      this.isTyping = true

      if (this.typingTimer) {
        clearTimeout(this.typingTimer)
      }

      this.typingTimer = setTimeout(() => {
        this.isTyping = false
      }, 3000)
    },

    toggleChatWindow() {
      this.showChatWindow = !this.showChatWindow
      if (this.showChatWindow) {
        this.unreadCount = 0
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },

    closeChatWindow() {
      this.showChatWindow = false
    },

    minimizeChat() {
      this.showChatWindow = false
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
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
  }
}
</script>

<style scoped>
.customer-service {
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 999;
}

.chat-badge {
  display: block;
}

.chat-btn {
  width: 60px;
  height: 60px;
  font-size: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.chat-btn:hover {
  transform: scale(1.1);
}

.chat-window {
  position: absolute;
  right: 0;
  bottom: 80px;
  width: 380px;
  height: 550px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 5px;
}

.header-actions .el-button {
  color: white;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: #f5f7fa;
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

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
  max-width: 70%;
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
  padding: 15px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 150px);
    right: 20px;
    bottom: 90px;
  }

  .customer-service {
    right: 10px;
    bottom: 90px;
  }
}
</style>
