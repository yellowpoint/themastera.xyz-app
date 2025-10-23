'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Input, Button, Link, Divider, Checkbox } from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    // 清除之前的错误
    setError('');

    // 表单验证
    if (!formData.email.trim()) {
      setError('请输入邮箱地址');
      return;
    }

    if (!formData.password) {
      setError('请输入密码');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.error) {
        setError(getErrorMessage(result.error));
      } else {
        // 登录成功，跳转到首页或用户指定页面
        router.push('/');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 错误信息映射
  const getErrorMessage = (error) => {
    if (error.includes('Invalid login credentials')) {
      return '邮箱或密码错误，请检查后重试';
    }
    if (error.includes('Email not confirmed')) {
      return '请先验证您的邮箱地址';
    }
    if (error.includes('Invalid email')) {
      return '请输入有效的邮箱地址';
    }
    if (error.includes('Too many requests')) {
      return '登录尝试次数过多，请稍后再试';
    }
    return error || '登录失败，请稍后重试';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-content1 border-divider">
          <CardHeader className="flex flex-col gap-3 pb-6">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-lime-400 to-green-400 rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-xl">M</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">欢迎回到 Mastera</h1>
              <p className="text-gray-400 text-sm">登录您的创作者账户</p>
            </div>
          </CardHeader>

          <CardBody className="gap-4">
            <Input
              type="email"
              label="邮箱地址"
              placeholder="输入您的邮箱"
              value={formData.email}
              onValueChange={(value) => handleInputChange('email', value)}
              classNames={{
                 input: "text-white",
                 label: "text-gray-300",
                 inputWrapper: "bg-content2 border-divider hover:border-lime-400 focus-within:border-lime-400"
               }}
            />

            <Input
              label="密码"
              placeholder="输入您的密码"
              value={formData.password}
              onValueChange={(value) => handleInputChange('password', value)}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              classNames={{
                 input: "text-white",
                 label: "text-gray-300",
                 inputWrapper: "bg-content2 border-divider hover:border-lime-400 focus-within:border-lime-400"
               }}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={formData.rememberMe}
                onValueChange={(checked) => handleInputChange('rememberMe', checked)}
                classNames={{
                  label: "text-gray-300 text-sm"
                }}
              >
                记住我
              </Checkbox>
              <Link href="#" className="text-lime-400 text-sm hover:text-lime-300">
                忘记密码？
              </Link>
            </div>

            {/* 错误信息显示 */}
            {error && (
              <div className="text-sm p-3 rounded-lg bg-red-900/50 text-red-400 border border-red-700">
                {error}
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-lime-400 to-green-400 text-black font-semibold"
              size="lg"
              onPress={handleLogin}
              isDisabled={isSubmitting || loading}
              isLoading={isSubmitting || loading}
            >
              {isSubmitting || loading ? '登录中...' : '登录'}
            </Button>

            <Divider className="my-4" />

            <div className="space-y-3">
              <Button
                variant="bordered"
                className="w-full border-divider hover:border-lime-400"
                startContent={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                }
              >
                使用 Google 登录
              </Button>

              <Button
                variant="bordered"
                className="w-full border-divider hover:border-lime-400"
                startContent={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                }
              >
                使用 Twitter 登录
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                还没有账户？{' '}
                <Link href="/auth/register" className="text-lime-400 hover:text-lime-300">
                  立即注册
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}