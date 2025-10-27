# Mastera Platform

> 一个现代化的创作者内容平台，连接创作者与用户，提供丰富的数字内容交易和社区互动体验。

## 🌟 项目简介

Mastera Platform 是一个基于 Next.js 构建的全栈 Web 应用，旨在为创作者和用户提供一个完整的数字内容生态系统。平台支持多种内容类型的上传、购买、下载，并通过积分系统和社区功能增强用户参与度。

## ✨ 核心特性

- 🎨 **多元化内容支持** - 视觉艺术、音乐、动画、摄影、设计等
- 👥 **完整用户系统** - 多级会员制度、积分奖励、个人档案
- 💰 **创作者收益** - 内容销售分润、数据分析面板
- 🏆 **积分激励系统** - 任务系统、排行榜、勋章展示
- 🤝 **社区互动** - 评论收藏、关注系统、主题圈子
- 📱 **响应式设计** - 现代化 UI，支持多设备访问

## 🛠 技术栈

### 前端

- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **HeroUI** - 现代化 UI 组件库
- **Tailwind CSS 4** - 原子化 CSS 框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 后端

- **Better Auth** - 身份认证系统
- **Prisma** - 数据库 ORM
- **SQLite** - 开发环境数据库
- **Supabase** - 生产环境数据库和存储

### 开发工具

- **TypeScript** - 类型安全
- **ESLint** - 代码规范
- **PNPM** - 包管理器

## 📦 安装指南

### 环境要求

- Node.js 18.0 或更高版本
- PNPM 8.0 或更高版本

### 1. 克隆项目

```bash
git clone <repository-url>
cd themastera.xyz-app
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# 数据库
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"

# Supabase (生产环境)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Better Auth
BETTER_AUTH_SECRET=your_auth_secret


# 邮件服务 (Resend)
RESEND_API_KEY=your_resend_api_key
```

### 4. 数据库设置

```bash
# 生成 Prisma 客户端
pnpm dbgenerate

# 运行数据库迁移
pnpm dbmigrate

# (可选) 打开数据库管理界面
pnpm dbstudio
```

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── auth/              # 认证相关页面
│   ├── community/         # 社区功能
│   ├── content/           # 内容管理
│   ├── creator/           # 创作者中心
│   ├── profile/           # 用户档案
│   └── ...
├── components/            # 可复用组件
│   ├── FileUpload.js     # 文件上传组件
│   ├── Header.js         # 页面头部
│   └── ...
├── hooks/                 # 自定义 React Hooks
│   ├── useAuth.js        # 认证状态管理
│   ├── useTheme.js       # 主题切换
│   └── useWorks.js       # 作品数据管理
├── lib/                   # 工具库
│   ├── auth.js           # 认证配置
│   ├── prisma.js         # 数据库连接
│   └── supabase.js       # Supabase 客户端
├── styles/                # 样式文件
└── utils/                 # 工具函数
```

## 🚀 可用脚本

```bash
# 开发
pnpm dev          # 启动开发服务器 (使用 Turbopack)
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查

# 数据库
pnpm dbgenerate   # 生成 Prisma 客户端
pnpm dbmigrate    # 运行数据库迁移
pnpm dbpush       # 推送 schema 到数据库
pnpm dbstudio     # 打开 Prisma Studio
```

## 🏗 系统架构

### 1️⃣ 用户系统 (User System)

- **用户档案** - 会员等级 (Free / Creator+ / ArtCircle / VIP)
- **积分系统** - Mastera Points、活跃记录、等级徽章
- **认证系统** - 邮箱验证、登录注册
- **推荐机制** - 邀请好友、推荐奖励

### 2️⃣ 内容体系 (Content System)

- **内容类型** - 视觉内容、音频流媒体、付费内容包
- **权限管理** - 基于会员等级的下载权限
- **下载券机制** - 积分兑换系统

### 3️⃣ 社区互动体系 (Community System)

- **Mastera Circle** - 主题圈子
- **Creator Live / AMA** - 创作者直播问答
- **互动功能** - 评论、收藏、分享
- **合作创作** - Co-Create 功能
- **游戏化** - 积分成长、勋章展示

### 4️⃣ 积分与激励系统 (Points & Rewards)

- **获取途径** - 登录、互动、购买、邀请
- **消耗途径** - 下载券、门票、会员升级
- **任务系统** - 每日/周/成长任务
- **排行榜** - 积分排行、月度奖励

### 5️⃣ 创作者体系 (Creator System)

- **创作者主页** - 个人品牌展示
- **收益分润** - 内容销售分成
- **粉丝任务** - 积分激励配置
- **数据分析** - 收益和流量洞察
- **官方活动** - 活动报名入口

### 6️⃣ 营销与促活系统 (Growth System)

- **新人引导** - 任务包系统
- **消息推送** - 邮件和站内通知
- **个性化推荐** - 内容推荐算法
- **活动运营** - 月度活动、榜单激励
- **社群运营** - Discord / Telegram 集成

## 🔧 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 React 和 Next.js 最佳实践
- 组件使用 PascalCase 命名
- 文件使用 camelCase 命名

### 数据库操作

```bash
# 修改 schema 后重新生成客户端
pnpm dbgenerate

# 创建新的迁移
pnpm dbmigrate

# 重置数据库 (开发环境)
rm prisma/dev.db
pnpm dbmigrate
```

### 部署

项目支持部署到 Vercel、Netlify 等平台。确保配置正确的环境变量。

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Mastera Platform** - 让创作更有价值 ✨
