'use client'

import AuthCardLayout from '@/components/auth/AuthCardLayout'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import { ResendVerificationEmailDialog } from '@/components/auth/ResendVerificationEmailDialog'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { generateVerifyEmailCallbackURL } from '@/utils/auth'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const { signUp, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isResendDialogOpen, setIsResendDialogOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (field: keyof RegisterFormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const openResendDialog = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first')
      return
    }
    setIsResendDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!formData.password) {
      setError('Please enter your password')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        callbackURL: generateVerifyEmailCallbackURL(formData.email),
      })

      if (result?.error) {
        const msg =
          typeof result.error === 'string'
            ? result.error
            : result.error?.message
        setError(msg || 'Registration failed, please try again later')
      } else {
        setSuccess(
          'Registration successful. Please check your email to verify your account.'
        )
      }
    } catch (err) {
      setError('Registration failed, please try again later')
      // eslint-disable-next-line no-console
      console.error('Registration error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <AuthCardLayout
        title="Create an account"
        description="Enter your information below to create your account"
      >
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            {error && (
              <div className="text-destructive text-sm" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm" role="status">
                {success}
              </div>
            )}

            <FieldGroup>
              <Field>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </div>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{' '}
                  <Link href="/auth/login">Sign in</Link>
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
              <GoogleLoginButton />
            </FieldGroup>
          </FieldGroup>
        </form>
      </AuthCardLayout>

      <ResendVerificationEmailDialog
        email={formData.email}
        open={isResendDialogOpen}
        onOpenChange={setIsResendDialogOpen}
      />
    </>
  )
}
