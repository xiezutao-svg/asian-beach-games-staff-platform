# 亚沙会工作人员平台

亚沙会工作人员打卡汇报平台，提供日常管理、通讯录、任务打卡、等核心功能。

## 功能特性

- 登录认证系统
- 首页仪表盘
- 每日报告管理
- 通讯录管理
- 任务打卡系统
- 公告通知
- 大屏数据展示
- 响应式设计（支持桌面端和移动端）

## 技术栈

- Vue 3.4+ (Composition API)
- TypeScript 5.3+
- Vue Router 4.3+
- Pinia Element Plus 2.5+
- ECharts 5.5+
- Vite 5.1+
- SCSS

## 项目结构

```
d:/篮协赛事/亚沙会工作人员平台/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   │   └── styles/       # 样式文件
│   │       ├── variables.scss   # SCSS 变量
│   │       ├── global.scss      # 全局样式
│   │       └── mixins.scss      # SCSS 混入
│   ├── components/        # 组件
│   │   ├── common/       # 通用组件
│   │   │   ├── AppHeader.vue       # 顶部导航
│   │   │   ├── AppSidebar.vue      # 侧边栏
│   │   │   └── AppMobileNav.vue    # 移动端导航
│   │   ├── contacts/     # 通讯录组件
│   │   ├── reports/      # 报告组件
│   │   ├── tasks/        # 任务组件
│   │   └── dashboard/    # 大屏组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   │   ├── user.ts       # 用户状态
│   │   ├── notices.ts    # 通知状态
│   │   ├── contacts.ts   # 通讯录状态
│   │   ├── reports.ts    # 报告状态
│   │   ├── tasks.ts      # 任务状态
│   │   └── stats.ts      # 统计状态
│   ├── views/             # 页面视图
│   │   ├── Login.vue     # 登录页
│   │   ├── Home.vue      # 首页
│   │   ├── Info.vue      # 公告通知
│   │   ├── Dashboard.vue # 大屏展示
│   │   ├── Reports.vue   # 每日报告
│   │   ├── Contacts.vue  # 通讯录
│   │   └── Tasks.vue     # 任务打卡
│   ├── App.vue            # 根组件
│   └── main.ts            # 应用入口
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── .gitignore            # Git 忽略文件
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目说明
```

## 快速开始

### 环境要求

- Node.js >= 18.0
- npm >= 9.0

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 环境变量

### 开发环境 (.env.development)

```env
VITE_BASE_URL=/
VITE_API_BASE_URL=http://localhost:8080/api
VITE_DEBUG=true
```

### 生产环境 (.env.production)

```env
VITE_BASE_URL=/
VITE_API_BASE_URL=/api
VITE_DEBUG=false
```

## 路由说明

| 路径 | 页面 | 说明 |
|------|------|------|
| `/login` | 登录页 | 用户登录 |
| `/` | 重定向到登录 | 首页重定向 |
| `/home` | 首页 | 模块入口仪表盘 |
| `/reports` | 每日报告 | 工作日报管理 |
| `/contacts` | 通讯录 | 联系人和部门管理 |
| `/tasks` | 任务打卡 | 任务和打卡记录 |
| `/info` | 公告通知 | 查看公告和通知 |
| `/dashboard` | 大屏展示 | 数据可视化展示 |

## 状态管理

### Pinia Stores

- `useUserStore` - 用户状态管理
- `useNoticesStore` - 通知状态管理
- `useContactsStore` - 通讯录状态管理
- `useReportsStore` - 报告状态管理
- `useTasksStore` - 任务状态管理
- `useStatsStore` - 统计状态管理

## 样式规范

### SCSS 变量

使用 `src/assets/styles/variables.scss` 中定义的变量：

```scss
$primary-orange: #FF6B35;
$dark-orange: #E55A2B;
$bg-primary: #FFFFFF;
$bg-secondary: #F5F7FA;
$text-primary: #1A1A1A;
$text-secondary: #666666;
```

### 组件样式

- 使用 scoped 样式
- 使用 SCSS 变量和混入
- 遵循 BEM 命名规范

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 性能优化

- 路由懒加载
- 组件按需引入
- Vite 构建优化
- ECharts 按需引入
- 图片懒加载

## 常见问题

### 如何添加新的模块？

1. 在 `src/views/` 创建新视图组件
2. 在 `src/router/index.ts` 添加路由配置
3. 在导航组件（AppHeader、AppSidebar、AppMobileNav）添加导航项
4. 在 `src/views/Home.vue` 添加模块入口卡片

### 如何添加新的状态管理？

1. 在 `src/stores/` 创建新的 store 文件
2. 在 `src/stores/index.ts` 导出新的 store
3. 在组件中使用 `useXxxStore` 引入

### 如何自定义主题？

修改 `src/assets/styles/variables.scss` 中的 SCSS 变量。

## 开发建议

1. 使用 TypeScript 编写代码，确保类型安全
2. 使用 Composition API 编写组件逻辑
3. 遵循 Vue 3 风格指南
4. 组件保持单一职责原则
5. 合理使用组件生命周期
6. 使用 Pinia 进行状态管理
7. 注意响应式数据的正确使用

## License

MIT
