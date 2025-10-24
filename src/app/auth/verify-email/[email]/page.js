'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { Card, CardBody, Button, Spinner } from '@heroui/react'
import { CheckCircle, XCircle } from 'lucide-react'
import { createAuthClient } from "better-auth/react"

const auth = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams()
  
  // 从路由参数获取 email，从查询参数获取 token
  const email = decodeURIComponent(params.email)
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      // 如果有token，说明是从邮件链接过来的，需要验证token
      verifyEmailToken(token)
    } else if (email) {
      // 如果只有email参数，检查该邮箱是否已经验证
      checkEmailVerificationStatus(email)
    } else {
      setStatus('error')
      setMessage('缺少验证参数')
    }
  }, [token, email])

  const verifyEmailToken = async (token) => {
    try {
      const result = await auth.verifyEmail({
        query: {
          token: token
        }
      })

      if (result.error) {
        setStatus('error')
        setMessage(result.error.message || '验证失败')
      } else {
        setStatus('success')
        setMessage('您的邮箱已经验证成功！您现在可以正常使用所有功能。')
        // 3秒后跳转到登录页面
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (error) {
      console.error('验证邮箱token时出错:', error)
      setStatus('error')
      setMessage('验证失败，请重试')
    }
  }

  const checkEmailVerificationStatus = async (email) => {
    try {
      const response = await fetch('/api/auth/check-verification-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.verified) {
          setStatus('success')
          setMessage('您的邮箱已经验证成功！您现在可以正常使用所有功能。')
          // 3秒后跳转到登录页面
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage('邮箱尚未验证，请检查您的邮箱并点击验证链接。')
        }
      } else {
        setStatus('error')
        setMessage(data.error || '检查验证状态失败')
      }
    } catch (error) {
      console.error('检查邮箱验证状态时出错:', error)
      setStatus('error')
      setMessage('网络错误，请稍后重试')
    }
  }

  const resendVerification = async () => {
    try {
      if (!email) {
        setMessage('无法获取邮箱地址，请重新注册')
        return
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setMessage('验证邮件已重新发送，请检查您的邮箱')
      } else {
        const data = await response.json()
        setMessage(data.error || '重发失败，请稍后重试')
      }
    } catch (error) {
      setMessage('网络错误，请稍后重试')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardBody className="text-center p-8">
          {status === 'verifying' && (
            <>
              <Spinner size="lg" className="mb-4" />
              <h1 className="text-2xl font-bold mb-4">验证邮箱中...</h1>
              <p className="text-gray-600 dark:text-gray-400">
                正在验证您的邮箱地址，请稍候...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-4">验证成功！</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                3秒后自动跳转到登录页面...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-600 mb-4">验证失败</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button
                  color="primary"
                  variant="solid"
                  onPress={resendVerification}
                  className="w-full"
                >
                  重新发送验证邮件
                </Button>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => router.push('/auth/login')}
                  className="w-full"
                >
                  返回登录页面
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  )
}