'use client'

import { Button } from '@/components/ui/button'
import AuthCardLayout from '@/components/auth/AuthCardLayout'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createAuthClient } from 'better-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const authClient = createAuthClient()

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const t = searchParams.get('token') || searchParams.get('code')
    setToken(t)
  }, [searchParams])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!token) {
      setError('Invalid or missing reset token')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    try {
      const { error: authError } = await authClient.resetPassword({
        newPassword: password,
        token,
      })
      if (authError) {
        setError(authError.message || 'Failed to reset password')
      } else {
        setSuccess('Password reset successful. Redirecting to login...')
        setTimeout(() => router.push('/auth/login'), 2000)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCardLayout
      title="Reset your password"
      description="Set a new password for your account"
    >
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FieldDescription>Minimum 8 characters</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm">Confirm Password</FieldLabel>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </Field>
          {error && (
            <FieldDescription className="text-red-500">{error}</FieldDescription>
          )}
          {success && (
            <FieldDescription className="text-green-600">{success}</FieldDescription>
          )}
          <Field>
            <Button type="submit" className="w-full" loading={submitting}>
              {submitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </AuthCardLayout>
  )
}
