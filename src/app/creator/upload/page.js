'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Select, SelectItem, Card, CardBody, Form } from '@heroui/react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import VideoUpload from '@/components/VideoUpload'
import ImgUpload from '@/components/ImgUpload'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createWork } = useWorks()

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    tags: '',
    fileUrl: '',
    thumbnailUrl: '',
    status: 'draft'
  })

  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 处理视频上传完成
  const handleVideoUploadComplete = (uploadedFiles) => {
    console.log('Video upload results:', uploadedFiles)

    if (uploadedFiles && uploadedFiles.length > 0) {
      const fileUrls = uploadedFiles.map(file => file.fileUrl).join(',')
      setUploadForm(prev => ({
        ...prev,
        fileUrl: fileUrls
      }))
    }
  }

  // 处理封面上传完成
  const handleCoverUploadComplete = (coverImage) => {
    console.log('Cover upload result:', coverImage)

    setUploadForm(prev => ({
      ...prev,
      thumbnailUrl: coverImage ? coverImage.fileUrl : ''
    }))
  }

  // 发布作品
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('请先登录')
      return
    }

    if (!uploadForm.title || !uploadForm.description || !uploadForm.category) {
      toast.error('请填写必要信息')
      return
    }

    if (!uploadForm.fileUrl) {
      toast.error('请上传视频文件')
      return
    }

    if (!uploadForm.thumbnailUrl) {
      toast.error('请上传封面图片')
      return
    }

    setIsSubmitting(true)

    try {
      const workData = {
        ...uploadForm,
        userId: user.id,
        price: parseFloat(uploadForm.price) || 0,
        tags: tags,
        status: 'published'
      }

      await createWork(workData)
      toast.success('作品发布成功！')
      router.push('/creator')
    } catch (error) {
      console.error('发布失败:', error)
      toast.error('发布失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 保存草稿
  const handleSaveDraft = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    setIsSubmitting(true)

    try {
      const workData = {
        ...uploadForm,
        userId: user.id,
        price: parseFloat(uploadForm.price) || 0,
        tags: tags,
        status: 'draft'
      }

      await createWork(workData)
      toast.success('草稿保存成功！')
      router.push('/creator')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('保存失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { key: 'video', label: '视频' },
    { key: 'audio', label: '音频' },
    { key: 'image', label: '图片' },
    { key: 'document', label: '文档' },
    { key: 'software', label: '软件' },
    { key: 'other', label: '其他' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部导航 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="light"
                onPress={() => router.back()}
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-xl font-semibold">发布视频</h1>
            </div>

          </div>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：视频上传区域 */}
          <div className="space-y-6">
            <Card>
              <CardBody className="p-6">
                <h2 className="text-lg font-medium mb-4">上传视频</h2>
                <VideoUpload
                  onUploadComplete={handleVideoUploadComplete}
                />
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h2 className="text-lg font-medium mb-4">上传封面</h2>
                <ImgUpload
                  onUploadComplete={handleCoverUploadComplete}
                  required={true}
                />
              </CardBody>
            </Card>
          </div>

          {/* 右侧：基本设置 */}
          <div className="space-y-6">
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-medium mb-4">基本设置</h3>

                {/* 标题 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> 标题
                  </label>
                  <Input
                    placeholder="请输入标题"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    endContent={
                      <span className="text-xs text-gray-400">
                        {uploadForm.title.length}/80
                      </span>
                    }
                  />
                </div>

                {/* 分区 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> 分区
                  </label>
                  <Select
                    placeholder="请选择分区"
                    selectedKeys={uploadForm.category ? [uploadForm.category] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0]
                      setUploadForm(prev => ({ ...prev, category: selectedKey }))
                    }}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* 标签 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> 标签
                  </label>
                  <Input
                    placeholder="请用逗号分隔多个标签，例如：教程,编程,前端"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                {/* 价格 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">价格</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, price: e.target.value }))}
                    startContent={<span className="text-sm">¥</span>}
                  />
                </div>
              </CardBody>
            </Card>

            {/* 简介 */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-medium mb-4">简介</h3>
                <Textarea
                  placeholder="填写更全面的相关信息，让更多的人能够找到你的视频吧"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  minRows={6}
                  endContent={
                    <span className="text-xs text-gray-400">
                      {uploadForm.description.length}/2000
                    </span>
                  }
                />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* 底部按钮区域 */}
        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="bordered"
            onPress={handleSaveDraft}
            isLoading={isSubmitting}
            size="lg"
          >
            存草稿
          </Button>
          <Button
            color="primary"
            type="submit"
            isLoading={isSubmitting}
            size="lg"
          >
            立即投稿
          </Button>
        </div>
      </Form>
    </div>
  )
}