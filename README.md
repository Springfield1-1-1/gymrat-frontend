# GymRat 健身达人前端项目

## 技术栈

- **前端框架**: Vue 3.5.29
- **构建工具**: Vite 7.3.1
- **UI 组件库**: Element Plus 2.13.5
- **路由管理**: Vue Router 4.3.0
- **HTTP 客户端**: Axios 1.13.6
- **图标库**: @element-plus/icons-vue 2.3.2
- **Markdown 解析**: marked 17.0.4

## 项目结构

```
gymrat-frontend/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 请求封装
│   ├── assets/         # 静态资源文件
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── utils/          # 工具函数
│   ├── views/          # 页面视图
│   │   ├── admin/      # 管理员页面
│   │   └── ...         # 其他页面
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html          # HTML 模板
├── package.json        # 项目依赖配置
└── vite.config.js      # Vite 配置文件
```

## 主要功能模块

### 用户端功能
- **首页**: 展示健身相关内容和推荐
- **用户认证**: 登录/注册功能
- **健身指南**: 提供详细的健身知识和训练方法
- **器械指南**: 介绍各种健身器材的使用方法
- **卡路里计算器**: 帮助用户计算每日所需卡路里
- **健身计划**: 制定个性化的健身计划
- **健身房查找**: 查找附近的健身房信息
- **用户中心**: 管理个人信息和设置
- **客服聊天**: 实时在线客服支持

### 管理员功能
- **数据仪表板**: 展示关键业务数据
- **用户管理**: 管理平台用户信息
- **器械管理**: 管理健身器材信息
- **门店管理**: 管理健身房门店信息
- **客服面板**: 处理用户咨询

## 安装与运行

### 环境要求
- Node.js >= 16.x
- npm >= 8.x 或 yarn >= 1.22.x

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发模式运行
```bash
npm run dev
# 或
yarn dev
```

启动后访问: http://localhost:3000

### 生产构建
```bash
npm run build
# 或
yarn build
```

### 预览生产构建
```bash
npm run preview
# 或
yarn preview
```

## 配置说明

### 代理配置
项目已配置开发服务器代理，将 `/api` 请求转发到后端服务:
- 目标地址: `http://localhost:8080`
- 自动处理跨域问题

### 路径别名
使用 `@` 作为 `src` 目录的别名，例如:
```javascript
import Home from '@/views/Home.vue'
```

## 路由权限控制

项目实现了基于角色的访问控制:
- 部分页面需要用户登录 (`requiresAuth`)
- 管理员页面需要管理员权限 (`requiresAdmin`)
- 路由守卫会自动检查用户权限并进行相应跳转

## API 接口

所有 API 请求通过 `src/api/request.js` 进行统一管理，支持:
- 统一的错误处理
- 请求/响应拦截器
- Token 自动携带


---

**注意**: 此为前端部分，需要配合后端服务才能完整运行。