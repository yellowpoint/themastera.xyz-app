'use client'

import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody
} from '@heroui/react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [errors, setErrors] = useState({})

  const { signIn, signUp } = useAuth()

  // 错误信息映射
  const getErrorMessage = (error) => {
    if (!error) return ''
    
    const errorMessages = {
      'Invalid login credentials': '邮箱或密码错误',
      'Email not confirmed': '请先验证您的邮箱',
      'User already registered': '该邮箱已被注册',
      'Password should be at least 6 characters': '密码至少需要6位字符',
      'Invalid email': '请输入有效的邮箱地址',
      'Signup requires a valid password': '请输入有效的密码',
      'Email rate limit exceeded': '邮件发送频率过高，请稍后再试',
      'Too many requests': '请求过于频繁，请稍后再试'
    }
    
    return errorMessages[error.message] || error.message || '操作失败，请重试'
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = '请输入邮箱'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6位'
    }

    if (activeTab === 'register') {
      if (!formData.name) {
        newErrors.name = '请输入姓名'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次输入的密码不一致'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setErrors({})
    setLoading(true)

    try {
      let result
      if (activeTab === 'login') {
        // 登录验证
        if (!formData.email.trim()) {
          setErrors({ email: '请输入邮箱地址' })
          setLoading(false)
          return
        }
        if (!formData.password) {
          setErrors({ password: '请输入密码' })
          setLoading(false)
          return
        }
        
        result = await signIn(formData.email, formData.password)
      } else {
        // 注册验证
        if (!formData.name.trim()) {
          setErrors({ name: '请输入姓名' })
          setLoading(false)
          return
        }
        if (!formData.email.trim()) {
          setErrors({ email: '请输入邮箱地址' })
          setLoading(false)
          return
        }
        if (!formData.password) {
          setErrors({ password: '请输入密码' })
          setLoading(false)
          return
        }
        if (formData.password.length < 6) {
          setErrors({ password: '密码长度至少为6位' })
          setLoading(false)
          return
        }
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: '两次输入的密码不一致' })
          setLoading(false)
          return
        }
        
        result = await signUp(formData.email, formData.password, {
          name: formData.name
        })
      }

      if (result.error) {
        setErrors({ submit: getErrorMessage(result.error) })
      } else {
        // 注册成功的特殊处理
        if (activeTab === 'register' && result.data?.user && !result.data?.session) {
          setErrors({ 
            submit: '注册成功！请检查您的邮箱并点击验证链接来激活账户。' 
          })
        } else {
          // 登录成功或注册后自动登录成功
          onClose()
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: ''
          })
          setErrors({})
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ submit: '网络错误，请检查网络连接后重试' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
    setErrors({})
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          用户认证
        </ModalHeader>
        <ModalBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            className="w-full"
          >
            <Tab key="login" title="登录">
              <Card>
                <CardBody className="space-y-4">
                  <Input
                    label="邮箱"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => handleInputChange('email', value)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                  />
                  <Input
                    label="密码"
                    type="password"
                    value={formData.password}
                    onValueChange={(value) => handleInputChange('password', value)}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                  />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="register" title="注册">
              <Card>
                <CardBody className="space-y-4">
                  <Input
                    label="姓名"
                    value={formData.name}
                    onValueChange={(value) => handleInputChange('name', value)}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                  />
                  <Input
                    label="邮箱"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => handleInputChange('email', value)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                  />
                  <Input
                    label="密码"
                    type="password"
                    value={formData.password}
                    onValueChange={(value) => handleInputChange('password', value)}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                  />
                  <Input
                    label="确认密码"
                    type="password"
                    value={formData.confirmPassword}
                    onValueChange={(value) => handleInputChange('confirmPassword', value)}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword}
                  />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
          {errors.submit && (
            <div className={`text-sm text-center ${
              errors.submit.includes('注册成功') ? 'text-green-600' : 'text-red-500'
            }`}>
              {errors.submit}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            取消
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={loading}
          >
            {activeTab === 'login' ? '登录' : '注册'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}