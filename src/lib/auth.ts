import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { Resend } from 'resend'
import { prisma } from './prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

// Minimal typing to keep compatibility; Better Auth types are inferred
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: process.env.NODE_ENV === 'production' ? 'postgresql' : 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: 'noreply@themastera.xyz',
          to: user.email,
          subject: 'Reset your password — THE MASTERA',
          html: `
            <div style="background:#f5f5ff;padding:24px;font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e0e0f0;border-radius:8px;overflow:hidden;">
                <div style="padding:20px 24px;border-bottom:1px solid #e0e0f0;display:flex;align-items:center;gap:10px;">
                  <div style="font-weight:700;color:#6e56cf;letter-spacing:0.5px;">THE MASTERA</div>
                </div>
                <div style="padding:24px 24px 8px;color:#2a2a4a;">
                  <h2 style="margin:0 0 12px 0;font-size:20px;line-height:28px;color:#2a2a4a;">Reset your password</h2>
                  <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;color:#2a2a4a;">Hello ${user.name || user.email},</p>
                  <p style="margin:0 0 16px 0;font-size:14px;line-height:22px;color:#2a2a4a;">We received a request to reset your password. Click the button below to continue.</p>
                  <div style="text-align:center;margin:24px 0;">
                    <a href="${url}" style="background-color:#6e56cf;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">Reset Password</a>
                  </div>
                  <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#6c6c8a;">If the button doesn’t work, copy and paste this link:</p>
                  <p style="margin:0 0 16px 0;font-size:13px;line-height:20px;color:#6c6c8a;word-break:break-all;">${url}</p>
                  <p style="margin:0 0 16px 0;font-size:12px;line-height:18px;color:#6c6c8a;">If you did not request a password reset, you can safely ignore this email.</p>
                </div>
                <div style="padding:16px 24px;border-top:1px solid #e0e0f0;color:#6c6c8a;font-size:12px;line-height:18px;">
                  This link may expire after a period of time.
                </div>
              </div>
            </div>
          `,
          text: `Reset your password: ${url}`,
        })
        console.log('Password reset email sent to:', user.email)
      } catch (error) {
        console.error('Failed to send password reset email:', error)
        throw error
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        await resend.emails.send({
          from: 'noreply@themastera.xyz',
          to: user.email,
          subject: 'Verify your email — THE MASTERA',
          html: `
            <div style="background:#f5f5ff;padding:24px;font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e0e0f0;border-radius:8px;overflow:hidden;">
                <div style="padding:20px 24px;border-bottom:1px solid #e0e0f0;display:flex;align-items:center;gap:10px;">
                  <div style="font-weight:700;color:#6e56cf;letter-spacing:0.5px;">THE MASTERA</div>
                </div>
                <div style="padding:24px 24px 8px;color:#2a2a4a;">
                  <h2 style="margin:0 0 12px 0;font-size:20px;line-height:28px;color:#2a2a4a;">Welcome!</h2>
                  <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;color:#2a2a4a;">Hello ${user.name || user.email},</p>
                  <p style="margin:0 0 16px 0;font-size:14px;line-height:22px;color:#2a2a4a;">Thanks for signing up. Please verify your email to activate your account.</p>
                  <div style="text-align:center;margin:24px 0;">
                    <a href="${url}" style="background-color:#6e56cf;color:#ffffff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;">Verify Email</a>
                  </div>
                  <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#6c6c8a;">If the button doesn’t work, copy and paste this link:</p>
                  <p style="margin:0 0 16px 0;font-size:13px;line-height:20px;color:#6c6c8a;word-break:break-all;">${url}</p>
                  <p style="margin:0 0 16px 0;font-size:12px;line-height:18px;color:#6c6c8a;">This link may expire after a period of time.</p>
                </div>
                <div style="padding:16px 24px;border-top:1px solid #e0e0f0;color:#6c6c8a;font-size:12px;line-height:18px;">
                  If you didn’t create an account, you can safely ignore this email.
                </div>
              </div>
            </div>
          `,
          text: `Welcome to THE MASTERA. Verify your email: ${url}`,
        })
        console.log('Verification email sent to:', user.email)
      } catch (error) {
        console.error('Failed to send verification email:', error)
        throw error
      }
    },
  },
  socialProviders: {},
  session: {
    // freshAge: 60 * 60 * 24 * 7, // 1 day
    // expiresIn: 60 * 60 * 24 * 30, // 30 days
    // updateAge: 60 * 60 * 24 * 7, // 1 day
    // https://www.better-auth.com/docs/concepts/session-management#cookie-cache
    // rememberMe: false, 如果配置了就是每次都需要重新登录
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 60 * 30,
    // },
  },
  user: {
    additionalFields: {
      level: {
        type: 'string',
        defaultValue: 'User',
      },
      points: {
        type: 'number',
        defaultValue: 0,
      },
      earnings: {
        type: 'number',
        defaultValue: 0,
      },
    },
  },
  plugins: [nextCookies()],
})
