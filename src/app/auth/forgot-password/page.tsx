'use client'

import AuthCardLayout from '@/components/auth/AuthCardLayout'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const { resetPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    setSubmitting(true)
    try {
      const res = await resetPassword(email.trim())
      if (res?.error) {
        const msg = (res.error as any)?.message || 'Failed to send reset email'
        setError(msg)
      } else {
        setSuccess('If an account exists, we have emailed a reset link')
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCardLayout
      title="Forgot your password?"
      description="Enter your email to receive a password reset link"
    >
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          {error && (
            <FieldDescription className="text-red-500">
              {error}
            </FieldDescription>
          )}
          {success && (
            <FieldDescription className="text-green-600">
              {success}
            </FieldDescription>
          )}

          <Field>
            <Button
              type="submit"
              className="w-full"
              loading={submitting || loading}
            >
              {submitting || loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              Remembered your password?{' '}
              <Link href="/auth/login">Back to Login</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </AuthCardLayout>
  )
}
