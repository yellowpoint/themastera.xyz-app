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
    if (!validateForm()) return

    setLoading(true)
    try {
      let result
      if (activeTab === 'login') {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password, {
          name: formData.name
        })
      }

      if (result.error) {
        setErrors({ submit: result.error.message })
      } else {
        onClose()
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        })
      }
    } catch (error) {
      setErrors({ submit: '操作失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
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
            <div className="text-red-500 text-sm text-center">
              {errors.submit}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
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