# Mastera 平台

> 连接创作者和用户的现代创作者内容平台，提供丰富的数字内容交易和社区互动体验。

## 🌟 项目概述

Mastera 平台是一个基于 Next.js 构建的全栈 Web 应用程序，旨在为创作者和用户提供完整的数字内容生态系统。该平台支持上传、购买和下载各种内容类型，通过积分系统和社区功能增强用户参与度。

## 🧾 版本记录

### v0.2.0 — 2025-11-28 UI 重构与视觉升级

- 全面重构 UI，采用半透明玻璃拟态与柔和模糊，参考 https://www.anime.com/
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
- **Sentry** - 错误监控与日志上报

### 媒体和上传

- **Mux** - 视频处理和流媒体

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

   # Sentry 监控
   # 开启/关闭 Sentry 上报。
   # 如果未设置，开发环境默认关闭，生产环境默认开启。
   # 设置为 'true' 强制开启，'false' 强制关闭。
   NEXT_PUBLIC_ENABLE_SENTRY="false"

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

### 代码规范 (Code Standards)

#### 1. 通用规范

- **语言**: 使用 TypeScript 确保类型安全,遵循路径别名 `@/*` 指向 `./src/*`
- **包管理器**: 统一使用 PNPM 进行包管理
- **开发工具**: 遵循 ESLint 和 Prettier 配置保证代码质量
- **界面语言**: 界面文本使用英语,代码注释可使用中文说明复杂逻辑

#### 2. 文件和命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | 驼峰式 (camelCase) 或 帕斯卡式 (PascalCase) | `LoginForm.tsx`, `useAuth.tsx`, `request.ts` |
| 组件名 | 帕斯卡式 (PascalCase) | `AuthProvider`, `CustomSidebar`, `VideoPlayer` |
| 函数/变量 | 驼峰式 (camelCase) | `getUserProfile`, `isLoading`, `videoUrl` |
| 常量 | 大写蛇形 (UPPER_SNAKE_CASE) | `MAX_FILE_SIZE`, `API_BASE_URL` |
| 类型/接口 | 帕斯卡式 (PascalCase) | `ApiResponse<T>`, `UserProfile`, `WorkMetadata` |
| 数据库表/字段 | 蛇形命名 (snake_case) | `user`, `work_likes`, `created_at` |

#### 3. 前端开发规范

**React 组件**
- 优先使用函数组件,避免类组件
- 使用 `'use client'` 指令标记客户端组件
- 自定义 Hook 命名以 `use` 开头 (如 `useAuth`, `useWorks`)
- 组件文件结构: 导入 → 类型定义 → 组件实现 → 导出

**样式规范**
- **Tailwind CSS 优先**: 使用 Tailwind utility classes
- **响应式设计**: 仅使用 `md` breakpoint (避免使用 sm/lg/xl)
- **全局类**: 页面布局使用 `.page-container` 类 (定义在 [src/app/globals.css](src/app/globals.css))
- **CSS 变量**: 使用 `--color-*`, `--shadow-*` 等自定义属性
- **UI 组件**: 优先使用 shadcn/ui 组件库,使用前查阅 [shadcn/ui 文档](https://ui.shadcn.com)

**图标和资源**
- 使用 Lucide React 图标库,避免直接使用 emoji
- 图标组件: `import { IconName } from 'lucide-react'`

#### 4. 后端开发规范

**API 路由规范**
- 路径: `src/app/api/[module]/route.ts`
- HTTP 方法: 使用标准 REST 动词 (GET, POST, PUT, PATCH, DELETE)
- 响应格式: **必须**使用统一的 API 响应类型

**统一 API 响应格式** ([src/contracts/types/common.ts](src/contracts/types/common.ts))

```typescript
// 成功响应
{
  success: true,
  data: T,
  error: null
}

// 失败响应
{
  success: false,
  data: null,
  error: {
    code: 'ERROR_CODE',      // UNAUTHORIZED | FORBIDDEN | NOT_FOUND | VALIDATION_FAILED | CONFLICT | INTERNAL_ERROR
    message: 'Error message',
    details?: any
  }
}
```

**使用辅助函数**
```typescript
import { apiSuccess, apiFailure } from '@/contracts/types/common'

// 成功
return NextResponse.json(apiSuccess(data))

// 失败
return NextResponse.json(
  apiFailure('NOT_FOUND', 'User not found'),
  { status: 404 }
)
```

#### 5. 统一请求封装

**禁止直接使用 fetch**,必须使用 [src/lib/request.ts](src/lib/request.ts) 的封装:

```typescript
import { request } from '@/lib/request'

// GET 请求
const result = await request.get<User>('/api/users/me')

// POST 请求
const result = await request.post<Work>('/api/works', {
  title: 'My Work',
  description: 'Description'
})

// 不显示错误提示
const result = await request.get('/api/data', {}, {
  showErrorToast: false,
  throwOnError: false
})
```

**请求选项**
- `showErrorToast`: 是否显示错误提示 (默认 `true`)
- `throwOnError`: 是否抛出错误 (默认 `true`)
- `parseJson`: 是否自动解析 JSON (默认 `true`)

#### 6. 数据验证和类型安全

- **Zod 验证**: 使用 Zod 进行数据验证和类型推导
- **Prisma 类型**: 利用 Prisma 生成的类型确保数据库操作类型安全
- **API Contract**: 定义 API 输入输出类型在 `src/contracts/` 目录

```typescript
import { z } from 'zod'

const CreateWorkSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().min(0)
})

type CreateWorkInput = z.infer<typeof CreateWorkSchema>
```

#### 7. 邮箱处理规范

**重要**: 所有邮箱处理必须转换为小写

```typescript
// ✅ 正确
const email = userInput.trim().toLowerCase()
const user = await prisma.user.findUnique({
  where: { email: email.toLowerCase() }
})

// ❌ 错误
const user = await prisma.user.findUnique({
  where: { email: userInput }  // 未转换小写
})
```

#### 8. 错误处理和日志

**Sentry 集成**
- 开发环境: 默认关闭 (可通过 `NEXT_PUBLIC_ENABLE_SENTRY=true` 强制开启)
- 生产环境: 默认开启 (可通过 `NEXT_PUBLIC_ENABLE_SENTRY=false` 强制关闭)
- 自动上报: 所有 API 错误会自动上报到 Sentry ([src/lib/request.ts:68-80](src/lib/request.ts#L68-L80))

**用户反馈**
- 使用 `sonner` 库显示 Toast 通知
- 错误消息应简洁明了,提供用户可操作的建议

```typescript
import { toast } from 'sonner'

toast.success('Work published successfully')
toast.error('Failed to upload file')
toast.info('Processing video...')
```

#### 9. 格式化规则 (Prettier)

```json
{
  "semi": false,              // 不使用分号
  "trailingComma": "es5",     // ES5 兼容的尾逗号
  "singleQuote": true,        // 使用单引号
  "tabWidth": 2,              // 2 空格缩进
  "useTabs": false,           // 使用空格而非 Tab
  "bracketSpacing": true,     // 对象花括号空格
  "endOfLine": "lf"           // Unix 换行符
}
```

#### 10. ESLint 规则

```javascript
// 禁用的规则
"react/no-unescaped-entities": "off",      // 允许未转义的引号
"@next/next/no-img-element": "off",        // 允许使用 <img> 标签
"react-hooks/exhaustive-deps": "off"       // 不强制 Hook 依赖检查
```

### 📐 开发工作流 (SOP)

#### 1. 开始开发

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
pnpm install

# 3. 生成 Prisma 客户端
pnpm dbgen

# 4. 启动开发服务器
pnpm dev
```

#### 2. 添加新功能

**步骤**:
1. **创建功能分支**: `git checkout -b feature/your-feature-name`
2. **设计 API 接口**: 在 `src/contracts/` 中定义类型
3. **数据库变更**: 修改 `prisma/schema.prisma` 并运行 `pnpm dbpush`
4. **实现 API 路由**: 在 `src/app/api/` 中创建路由
5. **创建前端组件**: 在 `src/components/` 中实现 UI
6. **创建页面**: 在 `src/app/` 中创建页面路由
7. **测试功能**: 本地测试所有流程
8. **代码检查**: 运行 `pnpm lint` 确保代码质量

#### 3. API 开发模板

```typescript
// src/app/api/[module]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { apiSuccess, apiFailure } from '@/contracts/types/common'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // 1. 身份验证
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) {
      return NextResponse.json(
        apiFailure('UNAUTHORIZED', 'Please login'),
        { status: 401 }
      )
    }

    // 2. 参数验证
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        apiFailure('VALIDATION_FAILED', 'Missing id parameter'),
        { status: 400 }
      )
    }

    // 3. 业务逻辑
    const data = await prisma.model.findUnique({
      where: { id }
    })
    if (!data) {
      return NextResponse.json(
        apiFailure('NOT_FOUND', 'Resource not found'),
        { status: 404 }
      )
    }

    // 4. 返回成功响应
    return NextResponse.json(apiSuccess(data))

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      apiFailure('INTERNAL_ERROR', 'Internal server error'),
      { status: 500 }
    )
  }
}
```

#### 4. 组件开发模板

```typescript
// src/components/YourComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { request } from '@/lib/request'
import { toast } from 'sonner'

interface YourComponentProps {
  title: string
  onSuccess?: () => void
}

export function YourComponent({ title, onSuccess }: YourComponentProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  const handleAction = async () => {
    setLoading(true)
    try {
      const result = await request.post('/api/your-endpoint', {
        // request body
      })

      if (result.ok && result.data?.success) {
        toast.success('Action completed successfully')
        onSuccess?.()
      }
    } catch (error) {
      // 错误已由 request 封装处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button onClick={handleAction} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </Button>
    </div>
  )
}
```

#### 5. 数据库操作规范

```bash
# 修改数据库模型后
pnpm dbpush          # 推送到数据库并生成客户端

# 查看数据库
pnpm dbstudio        # 打开 Prisma Studio GUI

# 备份数据库
pnpm dbbackup        # 备份当前数据库

# 导出/导入 JSON
pnpm dbexportjson:local   # 导出本地数据库为 JSON
pnpm dbimportjson:local   # 从 JSON 导入到本地数据库
```

**数据库查询最佳实践**:
```typescript
// ✅ 使用 select 减少数据传输
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    // 只选择需要的字段
  }
})

// ✅ 使用 include 关联查询
const work = await prisma.work.findUnique({
  where: { id },
  include: {
    creator: {
      select: { id: true, name: true, avatarUrl: true }
    },
    tags: true
  }
})

// ✅ 邮箱查询统一小写
const user = await prisma.user.findUnique({
  where: { email: email.toLowerCase() }
})
```

#### 6. Git 提交规范

遵循 Conventional Commits 风格:

```bash
# 格式: <type>(<scope>): <subject>

# 类型
feat:      # 新功能
fix:       # Bug 修复
refactor:  # 重构(不改变功能)
style:     # 样式调整
docs:      # 文档更新
test:      # 测试相关
chore:     # 构建/工具变动

# 示例
git commit -m "feat(auth): 添加 Google OAuth 登录支持"
git commit -m "fix(upload): 修复大文件上传失败问题"
git commit -m "refactor(api): 统一错误处理逻辑"
```

#### 7. 环境变量管理

**必需环境变量**:
```env
# 数据库
DATABASE_URL=              # Prisma 数据库连接
DIRECT_URL=                # 直连 URL (用于迁移)

# 认证
BETTER_AUTH_SECRET=        # Better Auth 密钥
BETTER_AUTH_URL=           # 认证服务 URL

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 邮件服务
RESEND_API_KEY=            # Resend 邮件服务

# 视频处理
MUX_TOKEN_ID=              # Mux 令牌 ID
MUX_TOKEN_SECRET=          # Mux 令牌密钥

# 监控 (可选)
NEXT_PUBLIC_ENABLE_SENTRY= # true/false 强制开关
SENTRY_DSN=                # Sentry 项目 DSN
```

#### 8. 常见问题和解决方案

**问题 1: Prisma Client 未生成**
```bash
pnpm dbgen
```

**问题 2: 端口被占用**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**问题 3: 依赖安装失败**
```bash
# 清理缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**问题 4: TypeScript 类型错误**
```bash
# 重新生成类型
pnpm dbgen
# 重启 TypeScript 服务器 (VS Code: Cmd/Ctrl + Shift + P → Restart TS Server)
```

### 🚀 部署

应用程序配置为在 Vercel、Netlify 或类似的 Next.js 兼容托管服务上部署。

**部署前检查清单**:
- [ ] 所有环境变量已配置
- [ ] 数据库迁移已应用 (`pnpm dbpush`)
- [ ] 构建成功 (`pnpm build`)
- [ ] Sentry 配置正确 (org: `yellowpoint`)
- [ ] 允许的图片域名已在 [next.config.mjs](next.config.mjs) 中配置
