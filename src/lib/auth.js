import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { Resend } from "resend"
import { prisma } from "./prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: process.env.NODE_ENV === "production" ? "postgresql" : "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Enable email verification
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        await resend.emails.send({
          from: 'noreply@themastera.xyz',
          to: user.email,
          subject: 'Verify Your Email Address',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Welcome to TheMastera!</h2>
              <p>Hello ${user.name},</p>
              <p>Thank you for registering on our platform. Please click the link below to verify your email address:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Verify Email
                </a>
              </div>
              <p>If the button doesn't work, please copy and paste the following link into your browser's address bar:</p>
              <p style="word-break: break-all; color: #666;">${url}</p>
              <p>This link will expire in 24 hours.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                If you did not register for our service, please ignore this email.
              </p>
            </div>
          `,
          text: `Welcome to TheMastera! Please click the following link to verify your email address: ${url}`
        })
        console.log('Verification email sent to:', user.email)
      } catch (error) {
        console.error('Failed to send verification email:', error)
        throw error
      }
    },
  },
  socialProviders: {
    // Social login providers can be added as needed
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
  plugins: [nextCookies()], // Add the nextCookies plugin to automatically handle cookies
})