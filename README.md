# Mastera 平台

> 连接创作者和用户的现代创作者内容平台，提供丰富的数字内容交易和社区互动体验。

## 🌟 项目概述

Mastera 平台是一个基于 Next.js 构建的全栈 Web 应用程序，旨在为创作者和用户提供完整的数字内容生态系统。该平台支持上传、购买和下载各种内容类型，通过积分系统和社区功能增强用户参与度。

## 🧾 版本记录

### v0.2.0 — 2025-11-28 UI 重构与视觉升级

- 全面重构 UI，采用半透明玻璃拟态与柔和模糊
- 替换旧 shadcn 模板布局，统一卡片/面板样式与间距
- 响应式策略保持 `md` 断点，优化移动端样式

### v0.1.0 — 2025-11-13 注册登录、视频上传发布查看等基础流程

- 完成核心架构：Next.js 15、TypeScript、Tailwind CSS 4
- 引入并应用 shadcn/ui，建立基础 UI 体系与复用组件
- 集成 Better Auth，支持注册、登录、邮箱验证与密码重置
- 建立 Prisma 数据模型（User、Work、Purchase、Review 等）并接通 SQLite 开发环境
- 打通媒体链路：Mux 上传、资产查询与播放页
- 统一请求封装：使用 `src/lib/request.ts`，标准化返回结构（`apiSuccess`/`apiFailure`）
- 初版页面就绪：登录/注册、探索、历史、订阅、播放列表、作品详情、创作者上传与编辑、用户主页
- 建立 API 路由：works、playlists、search、history、section、subscriptions、users 等

### ✅ 已完成功能

- **身份认证系统** - Better Auth 登录、注册、邮箱验证
- **数据库架构** - Prisma 完整数据模型（用户、作品、购买、评论）
- **创作者仪表板** - 作品管理、统计和收益概览
- **内容上传** - 文件上传系统，支持元数据和分类
- **内容查看** - 视频播放器、作品详情和互动功能
- **探索页面** - 分类筛选和内容发现
- **UI 组件** - shadcn/ui 组件库，设计一致

## 🛠 技术栈

### 前端

- **Next.js 15** - 带 App Router 的 React 全栈框架
- **React 19** - 用户界面库
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **shadcn/ui** - 基于 Radix UI 的现代组件库
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 后端

- **Better Auth** - 身份认证系统
- **Prisma** - 数据库 ORM
- **SQLite** - 开发数据库
- **Supabase** - 生产数据库和存储
- **Resend** - 邮件服务

### 媒体和上传

- **Mux** - 视频处理和流媒体
- **React Player** - 视频播放器组件

### 开发工具

- **TypeScript** - 类型安全
- **ESLint** - 代码检查
- **PNPM** - 包管理器

## 📦 安装指南

### 前置要求

- Node.js 18+
- PNPM 包管理器
- Git

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/yourusername/mastera-platform.git
   cd mastera-platform
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **环境配置**

   在根目录创建 `.env.local` 文件：

   ```env
   # 数据库
   DATABASE_URL="your_database_url"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

   # Better Auth
   BETTER_AUTH_SECRET="your_auth_secret"

   # Resend (邮件服务)
   RESEND_API_KEY="your_resend_api_key"

   # Mux (视频处理)
   MUX_TOKEN_ID="your_mux_token_id"
   MUX_TOKEN_SECRET="your_mux_token_secret"
   ```

4. **数据库设置**

   ```bash
   # 生成 Prisma 客户端
   pnpm dbgenerate

   # 运行数据库迁移
   pnpm dbmigrate

   # (可选) 打开 Prisma Studio
   pnpm dbstudio
   ```

5. **启动开发服务器**

   ```bash
   pnpm dev
   ```

   在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 🧭 现有页面一览

当前仓库中的页面（基于 App Router）：

- `/` 首页
- `/auth/login` 登录
- `/auth/register` 注册
- `/auth/forgot-password` 忘记密码
- `/auth/reset-password` 重置密码
- `/auth/verify-email/[email]` 邮箱验证
- `/creator` 创作者仪表板
- `/creator/upload` 创作者内容上传
- `/creator/edit/[id]` 创作者内容编辑
- `/explore` 内容探索/发现
- `/history` 浏览历史
- `/playlists` 播放列表
- `/playlists/[id]` 播放列表详情
- `/profile` 个人资料
- `/search` 搜索
- `/section` 分区/分类
- `/subscriptions` 订阅与会员
- `/content/[id]` 作品详情
- `/user/[id]` 用户主页
- `/admin` 管理页面
- `/subscriptions` 订阅与会员（src/app/subscriptions/page.js）
- `/content/[id]` 作品详情（动态路由，src/app/content/[id]/page.js）
- `/section/[id]` 分区/分类详情（动态路由，src/app/section/[id]/page.js）
- `/user/[id]` 用户主页（动态路由，src/app/user/[id]/page.js）

## 📋 开发待办事项列表

### ✅ 已完成功能

- **身份认证系统**：Better Auth 实现，包含登录、注册和邮箱验证
- **数据库架构**：Prisma 设置，包含用户、作品、购买和评论模型
- **创作者仪表板**：构建作品管理和分析功能
- **内容上传**：文件处理和元数据处理系统
- **内容查看**：视频播放器和作品详情页面
- **探索页面**：内容发现，支持分类筛选
- **shadcn/ui 设置**：一致的设计系统和组件库

### 🔥 高优先级（进行中）

- **用户资料**：实现用户个人资料页面，包含作品集和统计信息
- **Mastera 积分**：构建积分系统，包含获取和消费机制
- **会员等级**：实现订阅系统（免费版/创作者+/艺术圈/VIP）
- **支付处理**：集成支付系统，支持内容购买和会员升级
- **生产部署**：配置部署流程和生产环境

### 📋 中等优先级（已计划）

- **社区功能**：构建评论、点赞、关注和创作者圈子
- **高级搜索**：实现搜索功能，包含筛选和推荐
- **通知系统**：添加用户互动和更新通知
- **移动端优化**：增强移动设备的响应式设计
- **性能优化**：实现缓存、懒加载和 CDN 集成
- **测试框架**：设置综合测试套件

### 🔮 低优先级（未来）

- **管理员面板**：创建平台管理的管理面板

## 🏗 系统架构

### 用户系统

- **身份认证**：Better Auth 邮箱验证
- **用户资料**：个人信息、作品集、统计数据
- **账户管理**：设置、偏好、安全

### 内容系统

- **上传管理**：多格式文件支持，Mux 处理
- **内容组织**：分类、标签、元数据
- **访问控制**：公开、付费、会员专享内容

### 社区系统

- **社交功能**：评论、点赞、关注
- **创作者圈子**：创作者专属社区
- **用户互动**：私信、通知

### 积分奖励系统

- **Mastera 积分**：平台货币，奖励用户参与
- **获取机制**：每日签到、内容互动、推荐奖励
- **消费选项**：付费内容访问、专属功能

### 创作者系统

- **变现工具**：内容销售、订阅等级
- **分析面板**：收入跟踪、受众洞察
- **创作者支持**：资源、指南、社区

### 增长营销系统

- **推荐计划**：用户获取激励
- **内容发现**：推荐算法
- **SEO 优化**：搜索引擎可见性

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 确保类型安全
- 遵循 ESLint 配置保证代码质量
- 使用 Lucide React 图标而非直接使用 emoji
- 保持色彩搭配简洁清爽
- 界面语言使用英语
- 使用 PNPM 进行包管理
- 统一使用公共请求封装：`src/lib/request.ts`，避免在页面/组件中直接调用 `fetch`

### 数据库操作

```bash
# 重置数据库（仅开发环境）
pnpm dbpush --force-reset

# 查看数据库
pnpm dbstudio

# 生成新迁移
pnpm dbmigrate --name "migration_name"
```

### 部署

应用程序配置为在 Vercel、Netlify 或类似的 Next.js 兼容托管服务上部署。
