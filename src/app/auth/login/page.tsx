'use client'

import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import { ResendVerificationEmailDialog } from '@/components/auth/ResendVerificationEmailDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { MagicCard } from '@/components/ui/magic-card'
import { ENABLE_BETA_CHECK } from '@/config/beta'
import { useAuth } from '@/hooks/useAuth'
import { checkBetaAllowed } from '@/utils/beta'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const { signIn, loading } = useAuth()
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isResendDialogOpen, setIsResendDialogOpen] = useState<boolean>(false)
  const [needsVerification, setNeedsVerification] = useState<boolean>(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Reset verification state when email changes
    if (field === 'email') setNeedsVerification(false)
  }

  const openResendDialog = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first')
      return
    }
    setIsResendDialogOpen(true)
  }

  const handleResendSuccess = () => {
    setNeedsVerification(false)
    setError('')
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setNeedsVerification(false)

    if (!formData.email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!formData.password) {
      setError('Please enter your password')
      return
    }

    setIsSubmitting(true)

    try {
      // Check whitelist status first
      if (ENABLE_BETA_CHECK) {
        try {
          const allowed = await checkBetaAllowed(formData.email)
          if (!allowed) {
            setError('Access denied. Your email is not on the beta whitelist.')
            setIsSubmitting(false)
            return
          }
        } catch (checkErr) {
          console.error('Whitelist check failed:', checkErr)
          setError('Error verifying beta access. Please try again.')
          setIsSubmitting(false)
          return
        }
      }

      const result = await signIn({
        email: formData.email,
        password: formData.password,
        // rememberMe: false, // 如果配置了false就是每次都需要重新登录
      })

      if (result?.error) {
        const errorMsg = getErrorMessage(result.error)
        const errorCode = (result.error as any)?.code

        // Check if error is related to verification
        if (errorCode === 'EMAIL_NOT_VERIFIED') {
          setNeedsVerification(true)
          setError(
            "Email not verified yet. Please check your inbox for the verification link, or click 'Resend verification email' below."
          )
        } else {
          setError(errorMsg)
        }
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('Login failed, please try again later')
      // eslint-disable-next-line no-console
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getErrorMessage = (error: unknown) => {
    const errObj = error as { message?: string } | string | undefined
    const errorString =
      typeof errObj === 'string' ? errObj : errObj?.message || ''
    return errorString || 'Login failed, please try again later'
  }

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="w-full max-w-sm border-none p-0 shadow-none">
          <MagicCard
            gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
            className="p-0"
          >
            <CardHeader className="border-border border-b p-4 [.border-b]:pb-4">
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleLogin}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      required
                    />
                  </Field>
                  {error && (
                    <div className="space-y-2">
                      <FieldDescription className="text-red-500">
                        {error}
                      </FieldDescription>
                    </div>
                  )}
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      loading={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Field>
                  <GoogleLoginButton />
                  <Field>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{' '}
                      <Link href="/auth/register" className="hover:underline">
                        Sign up
                      </Link>
                      <span className="mt-2 block">
                        <button
                          type="button"
                          onClick={openResendDialog}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Resend verification email
                        </button>
                      </span>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </MagicCard>
        </Card>
      </div>

      <ResendVerificationEmailDialog
        email={formData.email}
        open={isResendDialogOpen}
        onOpenChange={setIsResendDialogOpen}
        onSuccess={handleResendSuccess}
      />
    </div>
  )
}
