'use client'

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
import { useAuth } from '@/hooks/useAuth'
import GoogleIcon from '@/components/icons/GoogleIcon'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const { signIn, signInWithGoogle, loading } = useAuth()
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

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
      const result = await signIn({
        email: formData.email,
        password: formData.password,
        // rememberMe: false, // 如果配置了false就是每次都需要重新登录
      })

      if (result?.error) {
        setError(getErrorMessage(result.error))
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

  const handleGoogle = async () => {
    await signInWithGoogle({ callbackURL: '/' })
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
                    <FieldDescription className="text-red-500">
                      {error}
                    </FieldDescription>
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
                <Field>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogle}
                  >
                    <GoogleIcon />
                    Continue with Google
                  </Button>
                </Field>
                <Field>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register">Sign up</Link>
                  </FieldDescription>
                </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </MagicCard>
        </Card>
      </div>
    </div>
  )
}
