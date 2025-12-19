# 项目初始化与开发规范模版

本文档用于快速初始化基于 Next.js 的新项目，并提供数据库、认证等核心功能模块的代码参考。

## 🛠 技术栈概览

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4, shadcn/ui
- **数据库**: Prisma (ORM), Supabase (PostgreSQL), SQLite (Local Dev)
- **认证**: Better Auth
- **包管理**: pnpm

---

## 🚀 项目初始化

### 1. 创建 Next.js 项目

使用以下**一键命令**快速初始化（包含 TypeScript, Tailwind, ESLint, src 目录, App Router, Turbopack）：

```bash
pnpm create next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --no-react-compiler
```

### 2. 配置代码格式化 (Prettier)

**安装依赖：**

```bash
pnpm add -D eslint-plugin-prettier prettier prettier-plugin-tailwindcss
```

**更新配置文件 `.eslintrc.js`：**

```json
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false, // 句末不使用分号
          trailingComma: 'es5', // 在 ES5 中有效的尾随逗号
          singleQuote: true, // 使用单引号（JSX 自动用双引号）
          tabWidth: 2, // 缩进占用2个空格
          useTabs: false, // 不使用制表符缩进，使用空格
          bracketSpacing: true, // 在对象字面量的括号中打印空格
          endOfLine: 'lf', // 换行符使用 lf
          plugins: ['prettier-plugin-tailwindcss'], // 加载 tailwindcss 排序插件
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig

```

**配置 VS Code 自动格式化 `.vscode/settings.json`：**

```json
{
  // 禁用 VSCode 内置的格式校验，避免和 ESLint 冲突
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    // 自动整理 import
    "source.organizeImports": "explicit"
  }
}
```

**重启 ESLint 服务器：**

1. 打开 VSCode 的命令面板（快捷键：`Ctrl+Shift+P` / `Cmd+Shift+P`）
2. 输入并选择 `ESLint: Restart ESLint Server`

### 3. 初始化 shadcn/ui

初始化配置：

```bash
pnpm dlx shadcn@latest init
```

选择配置：

- Style: New York (or Default)
- Base Color: Slate
- CSS Variables: Yes

**一键安装所有组件**（方便后续直接使用）：

```bash
pnpm dlx shadcn@latest add --all
```

### 4. 添加自动修复脚本

在 `package.json` 的 `scripts` 中添加：

```json
"lint:fix": "eslint . --fix"
```

运行以下命令即可自动格式化并修复所有代码：

```bash
pnpm lint:fix
```

### 5. 修复 Hydration Mismatch (Sidebar)

如果遇到 Sidebar 相关的 Hydration Mismatch 错误，请修改 `components/ui/sidebar.tsx`：

```typescript
// Random width between 50 to 90%.
const [width, setWidth] = React.useState('50%')

React.useEffect(() => {
  setWidth(`${Math.floor(Math.random() * 40) + 50}%`)
}, [])
```

6. 创建公共的AppLayout组件内置ThemeProvider、Toaster，创建 GoogleAnalytics

清理默认google字体（可能网络问题加载失败），后续若需字体使用@fontsource-variable本地安装对应字体

## 📂 推荐目录结构

```
src/
├── app/                 # 页面路由
│   ├── api/             # API 路由
│   ├── (auth)/          # 认证相关页面 (Route Group)
│   └── layout.tsx       # 全局布局
├── components/          # 组件
│   ├── ui/              # shadcn 基础组件
│   └── ...              # 业务组件
├── lib/                 # 核心库/工具单例
│   ├── prisma.ts        # Prisma 客户端
│   ├── auth.ts          # Better Auth 配置
│   ├── request.ts       # 请求封装
│   └── utils.ts         # 通用工具
├── config/              # 配置文件
├── hooks/               # 自定义 Hooks
└── types/               # TypeScript 类型定义
prisma/
└── schema.prisma        # 数据库模型
```

---

## 🧩 功能模块

### 1. 基础工具 (Utils)

**文件**: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 2. API 请求封装 (Request)

统一使用此封装进行 API 调用，处理错误和响应格式。

**文件**: `src/lib/request.ts`

```typescript
'use client'
import { toast } from 'sonner' // 或其他 Toast 组件

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export type RequestResult<T> = {
  ok: boolean
  status: number
  data: ApiResponse<T> | null
  error?: string
}

export async function baseRequest<T = any>(
  url: string,
  fetchOptions: RequestInit & { body?: any } = {},
  options: { showErrorToast?: boolean; throwOnError?: boolean } = {}
): Promise<RequestResult<T>> {
  const { showErrorToast = true, throwOnError = true } = options
  const { method = 'GET', headers = {}, body, ...rest } = fetchOptions
  const isJsonBody = body && typeof body !== 'string'

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: isJsonBody ? JSON.stringify(body) : body,
      ...rest,
    })

    let data: ApiResponse<T> | null = null
    try {
      data = await res.json()
    } catch {}

    if (!res.ok || (data && data.success === false)) {
      const msg = data?.error || '请求失败'
      if (showErrorToast) toast.error(msg)
      if (throwOnError) throw new Error(msg)
      return { ok: false, status: res.status, data, error: msg }
    }

    return { ok: true, status: res.status, data }
  } catch (err: any) {
    if (showErrorToast) toast.error(err.message || '网络错误')
    throw err
  }
}
```

### 3. 数据库 (Prisma)

**文件**: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

**初始化 Prisma**:

```bash
npx prisma init
```

### 4. 认证 (Better Auth)

**文件**: `src/lib/auth.ts`

```typescript
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: process.env.NODE_ENV === 'production' ? 'postgresql' : 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // 调用 Resend 发送重置邮件
      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: user.email,
        subject: '重置密码',
        text: `点击链接重置密码: ${url}`,
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // 调用 Resend 发送验证邮件
      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: user.email,
        subject: '验证邮箱',
        text: `点击链接验证邮箱: ${url}`,
      })
    },
  },
  socialProviders: {
    // google: { clientId: ..., clientSecret: ... }
  },
})
```

**API Route**: `src/app/api/auth/[...all]/route.ts`

```typescript
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```

---

## 📏 开发规范

### 命名规范

- **文件/目录**: 使用 `kebab-case` (如 `user-profile`, `page.tsx`)。
- **组件**: 使用 `PascalCase` (如 `UserProfile.tsx`)。
- **函数/变量**: 使用 `camelCase` (如 `getUserData`)。

### 提交规范

- 使用语义化提交 (feat, fix, docs, style, refactor, test, chore)。

### 代码风格

- 优先使用 `const`。
- 使用 TypeScript 类型而非 `any`。
- 组件 Props 使用接口定义。
- 所有的异步请求都应包含错误处理。
