'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { request } from '@/lib/request'
import { checkBetaAllowed } from '@/utils/beta'
import Link from 'next/link'
import { useState } from 'react'

export default function BetaNoticePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'checking' | 'allowed' | 'denied' | 'applying' | 'applied'
  >('idle')
  const [message, setMessage] = useState('')

  const checkEmail = async () => {
    if (!email) return
    setStatus('checking')
    setMessage('')
    try {
      const allowed = await checkBetaAllowed(email)
      setStatus(allowed ? 'allowed' : 'denied')
    } catch (error) {
      console.error('Error checking email:', error)
      setMessage('Error checking email. Please try again.')
      setStatus('idle')
    }
  }

  const applyForAccess = async () => {
    setStatus('applying')
    try {
      const { data, ok } = await request.post<{
        message: string
        status: 'PENDING' | 'APPROVED' | 'REJECTED'
        exists: boolean
      }>('/api/beta/apply', { email })
      if (!ok || !data || (data as any).success === false) {
        const msg =
          (data as any)?.error?.message || 'Error submitting application.'
        throw new Error(msg)
      }
      const payload = (data as any)?.data
      setStatus('applied')
      setMessage(payload?.message || 'Application submitted successfully.')
    } catch (error) {
      console.error('Error applying:', error)
      setMessage('Error submitting application. Please try again.')
      setStatus('denied')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>NOTICE: STRICTLY CONFIDENTIAL BETA VERSION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are accessing a confidential, pre-release system intended for
            internal use only. All content is proprietary and strictly forbidden
            from being shared, screenshotted, or distributed outside the
            authorized testing group. Violation of this policy may result in
            revocation of access and legal action.
          </p>

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Verify Access
              </label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setStatus('idle')
                    setMessage('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && status === 'idle') {
                      checkEmail()
                    }
                  }}
                  disabled={status === 'checking' || status === 'applying'}
                />
                <Button
                  onClick={checkEmail}
                  disabled={
                    !email ||
                    status === 'checking' ||
                    status === 'applying' ||
                    status === 'allowed'
                  }
                >
                  {status === 'checking' ? 'Checking...' : 'Check'}
                </Button>
              </div>
            </div>

            {status === 'allowed' && (
              <div className="bg-green-500/10 text-green-600 p-3 rounded-md text-sm">
                Access granted. You may now log in.
              </div>
            )}

            {status === 'denied' && (
              <div className="bg-yellow-500/10 text-yellow-600 p-3 rounded-md text-sm">
                Access denied. This email is not on the whitelist.
              </div>
            )}

            {status === 'applied' && (
              <div className="bg-blue-500/10 text-blue-600 p-3 rounded-md text-sm">
                {message}
              </div>
            )}

            {message && status !== 'applied' && (
              <div className="text-red-500 text-sm">{message}</div>
            )}

            <div className="flex gap-3 pt-2">
              {status === 'allowed' ? (
                <Button className="w-full">
                  <Link href="/auth/login">Proceed to Login</Link>
                </Button>
              ) : (
                (status === 'denied' || status === 'applying') && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={applyForAccess}
                    disabled={status === 'applying'}
                  >
                    {status === 'applying' ? 'Applying...' : 'Apply for Access'}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
