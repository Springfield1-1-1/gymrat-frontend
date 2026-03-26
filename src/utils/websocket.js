import { ElMessage } from 'element-plus'

class WebSocketService {
    constructor() {
        this.ws = null
        this.userId = null
        this.reconnectTimer = null
        this.heartbeatTimer = null
        this.reconnectCount = 0
        this.maxReconnectCount = 5
        this.heartbeatInterval = 30000 // 30 秒心跳
        this.messageHandlers = []
    }

    // 连接 WebSocket
    connect(userId) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket 已连接')
            return
        }

        this.userId = userId
        const wsUrl = `ws://8.155.171.152:8080/websocket/${userId}`

        try {
            this.ws = new WebSocket(wsUrl)

            this.ws.onopen = () => {
                console.log('WebSocket 连接成功')
                this.reconnectCount = 0
                this.startHeartbeat()
                this.notifyHandlers({ type: 'connected' })
            }

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data)
                    console.log('收到消息:', message)
                    this.handleMessage(message)
                } catch (error) {
                    console.error('消息解析失败:', error)
                }
            }

            this.ws.onerror = (error) => {
                console.error('WebSocket 错误:', error)
                ElMessage.error('聊天连接异常')
            }

            this.ws.onclose = () => {
                console.log('WebSocket 连接关闭')
                this.stopHeartbeat()
                this.attemptReconnect()
            }
        } catch (error) {
            console.error('WebSocket 连接失败:', error)
            this.attemptReconnect()
        }
    }

    // 处理消息
    handleMessage(message) {
        switch (message.type) {
            case 'chat':
                // 收到聊天消息
                this.notifyHandlers(message)
                break
            case 'chat_sent':
                // 自己发送的消息已送达
                this.notifyHandlers(message)
                break
            case 'typing':
                // 对方正在输入
                this.notifyHandlers(message)
                break
            case 'online_count':
                // 在线人数更新
                this.notifyHandlers(message)
                break
            default:
                console.log('未知消息类型:', message.type)
        }
    }

    // 发送消息
    sendMessage(content, targetId) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            ElMessage.warning('聊天未连接，请稍后再试')
            return false
        }

        const message = {
            type: 'chat',
            content: content,
            targetId: targetId
        }

        try {
            this.ws.send(JSON.stringify(message))
            return true
        } catch (error) {
            console.error('发送消息失败:', error)
            ElMessage.error('发送失败')
            return false
        }
    }

    // 发送正在输入状态
    sendTypingStatus(targetId) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return
        }

        const message = {
            type: 'typing',
            targetId: targetId
        }

        try {
            this.ws.send(JSON.stringify(message))
        } catch (error) {
            console.error('发送输入状态失败:', error)
        }
    }

    // 添加消息处理器
    addHandler(handler) {
        this.messageHandlers.push(handler)
    }

    // 移除消息处理器
    removeHandler(handler) {
        const index = this.messageHandlers.indexOf(handler)
        if (index > -1) {
            this.messageHandlers.splice(index, 1)
        }
    }

    // 通知所有处理器
    notifyHandlers(message) {
        this.messageHandlers.forEach(handler => {
            try {
                handler(message)
            } catch (error) {
                console.error('消息处理器错误:', error)
            }
        })
    }

    // 尝试重连
    attemptReconnect() {
        if (this.reconnectCount < this.maxReconnectCount) {
            this.reconnectCount++
            console.log(`尝试重连 (${this.reconnectCount}/${this.maxReconnectCount})...`)

            this.reconnectTimer = setTimeout(() => {
                this.connect(this.userId)
            }, 3000 * this.reconnectCount) // 递增延迟
        } else {
            console.error('超过最大重连次数')
            ElMessage.error('聊天连接失败，请刷新页面重试')
        }
    }

    // 开始心跳
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                try {
                    this.ws.send(JSON.stringify({ type: 'heartbeat' }))
                } catch (error) {
                    console.error('心跳发送失败:', error)
                }
            }
        }, this.heartbeatInterval)
    }

    // 停止心跳
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = null
        }
    }

    // 断开连接
    disconnect() {
        this.stopHeartbeat()

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }

        if (this.ws) {
            this.ws.close()
            this.ws = null
        }

        this.messageHandlers = []
    }

    // 获取连接状态
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN
    }
}

// 导出单例
export default new WebSocketService()
