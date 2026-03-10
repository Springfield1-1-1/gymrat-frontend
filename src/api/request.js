// src/api/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
    baseURL: '/api', // 你的后端 API 基础路径
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        console.log('请求配置:', {
            url: config.url,
            method: config.method,
            data: config.data,
            params: config.params
        })

        // 从 localStorage 获取 token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        console.log('响应数据:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        })

        // 直接返回 response.data，让业务层处理
        return response.data
    },
    (error) => {
        const errorInfo = {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        }

        console.error('请求错误详情:', errorInfo)

        // 根据错误类型显示不同的提示
        if (error.response) {
            const data = error.response.data

            // 你的后端错误响应也是 Result 格式
            // 例如：{ code: 3001, message: '用户名或密码错误', data: null }
            if (data && data.message) {
                // 显示后端返回的错误消息
                ElMessage.error(data.message)
            } else {
                // 没有 message 字段，使用默认错误处理
                switch (error.response.status) {
                    case 400:
                        ElMessage.error('请求参数错误')
                        break
                    case 401:
                        ElMessage.error('未授权，请重新登录')
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        if (window.location.pathname !== '/login') {
                            window.location.href = '/login'
                        }
                        break
                    case 403:
                        ElMessage.error('拒绝访问')
                        break
                    case 404:
                        ElMessage.error(`接口不存在: ${error.config?.url}`)
                        break
                    case 500:
                        ElMessage.error('服务器内部错误')
                        break
                    default:
                        ElMessage.error('请求失败')
                }
            }
        } else if (error.request) {
            ElMessage.error('网络错误，请检查：1. 后端是否启动 2. 网络连接')
        } else {
            ElMessage.error('请求配置错误: ' + error.message)
        }

        return Promise.reject(error)
    }
)

// 导出 request 实例（默认导出）
export default request

// 也可以导出常用的方法（可选）
export const get = (url, params) => {
    return request.get(url, { params })
}

export const post = (url, data) => {
    return request.post(url, data)
}

export const put = (url, data) => {
    return request.put(url, data)
}

export const del = (url) => {
    return request.delete(url)
}
