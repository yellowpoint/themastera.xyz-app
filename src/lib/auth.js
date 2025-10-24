import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { Resend } from "resend"
import { prisma } from "./prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // 启用邮箱验证
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log('发送验证邮件:', { user, url, })
      return
      try {
        await resend.emails.send({
          from: 'noreply@themastera.xyz',
          to: user.email,
          subject: '验证您的邮箱地址',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>欢迎注册 TheMastera！</h2>
              <p>您好 ${user.name}，</p>
              <p>感谢您注册我们的平台。请点击下面的链接来验证您的邮箱地址：</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  验证邮箱
                </a>
              </div>
              <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
              <p style="word-break: break-all; color: #666;">${url}</p>
              <p>此链接将在24小时后过期。</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                如果您没有注册我们的服务，请忽略此邮件。
              </p>
            </div>
          `,
          text: `欢迎注册 TheMastera！请点击以下链接验证您的邮箱地址：${url}`
        })
        console.log('验证邮件已发送至:', user.email)
      } catch (error) {
        console.error('发送验证邮件失败:', error)
        throw error
      }
    },
  },
  socialProviders: {
    // 可以根据需要添加社交登录提供商
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // },
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      level: {
        type: "string",
        defaultValue: "User",
      },
      points: {
        type: "number",
        defaultValue: 0,
      },
      earnings: {
        type: "number",
        defaultValue: 0,
      },
    },
  },
  plugins: [nextCookies()], // 添加 nextCookies 插件来自动处理 cookies
})