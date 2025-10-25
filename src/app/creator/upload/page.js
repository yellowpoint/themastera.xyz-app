'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Select, SelectItem, Card, CardBody, Form, addToast } from '@heroui/react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import VideoUpload from '@/components/VideoUpload'
import ImgUpload from '@/components/ImgUpload'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from '@/config/categories'

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createWork } = useWorks()

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    language: '',
    price: '',
    tags: '',
    fileUrl: '',
    thumbnailUrl: '',
    status: 'draft'
  })

  const [tags, setTags] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle video upload completion
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

  // Handle cover upload completion
  const handleCoverUploadComplete = (coverImage) => {
    console.log('Cover upload result:', coverImage)

    setUploadForm(prev => ({
      ...prev,
      thumbnailUrl: coverImage ? coverImage.fileUrl : ''
    }))
  }

  // Publish work
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      addToast({
        description: 'Please login first',
        color: "danger"
      })
      return
    }

    if (!uploadForm.title || !uploadForm.description || !uploadForm.category) {
      addToast({
        description: 'Please fill in required information',
        color: "danger"
      })
      return
    }

    if (!uploadForm.fileUrl) {
      addToast({
        description: 'Please upload video file',
        color: "danger"
      })
      return
    }

    if (!uploadForm.thumbnailUrl) {
      addToast({
        description: 'Please upload cover image',
        color: "danger"
      })
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
      addToast({
        description: 'Work published successfully!',
        color: "success"
      })
      router.push('/creator')
    } catch (error) {
      console.error('Publish failed:', error)
      addToast({
        description: 'Publish failed, please try again',
        color: "danger"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Save draft
  const handleSaveDraft = async () => {
    if (!user) {
      addToast({
        description: 'Please login first',
        color: "danger"
      })
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
      addToast({
        description: 'Draft saved successfully!',
        color: "success"
      })
      router.push('/creator')
    } catch (error) {
      console.error('Error saving draft:', error)
      addToast({
        description: 'Save failed, please try again',
        color: "danger"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = MUSIC_CATEGORIES.map(category => ({
    key: category,
    label: category
  }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header navigation */}
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
              <h1 className="text-xl font-semibold">Publish Video</h1>
            </div>

          </div>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Video upload area */}
          <div className="space-y-6">
            <Card>
              <CardBody className="p-6">
                <h2 className="text-lg font-medium mb-4">Upload Video</h2>
                <VideoUpload
                  onUploadComplete={handleVideoUploadComplete}
                />
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h2 className="text-lg font-medium mb-4">Upload Cover</h2>
                <ImgUpload
                  onUploadComplete={handleCoverUploadComplete}
                  required={true}
                />
              </CardBody>
            </Card>
          </div>

          {/* Right: Basic settings */}
          <div className="space-y-6">
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-medium mb-4">Basic Settings</h3>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Title
                  </label>
                  <Input
                    placeholder="Enter a title for your work"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    endContent={
                      <span className="text-xs text-gray-400">
                        {uploadForm.title.length}/80
                      </span>
                    }
                  />
                </div>

                {/* Style */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Style
                  </label>
                  <Select
                    placeholder="Select a style"
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

                {/* Language */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Language
                  </label>
                  <Select
                    placeholder="Select a language"
                    selectedKeys={uploadForm.language ? [uploadForm.language] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0]
                      setUploadForm(prev => ({ ...prev, language: selectedKey }))
                    }}
                  >
                    {LANGUAGE_CATEGORIES.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Tags
                  </label>
                  <Input
                    placeholder="Separate tags with commas, e.g., tutorial,programming,frontend"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, price: e.target.value }))}
                    startContent={<span className="text-sm">$</span>}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Description */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-medium mb-4">Description</h3>
                <Textarea
                  placeholder="Provide more details to help people discover your video"
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

        {/* Bottom button area */}
        <div className="mt-8 flex justify-end gap-4">
          {/* <Button
            variant="bordered"
            onPress={handleSaveDraft}
            isLoading={isSubmitting}
            size="lg"
          >
            Save Draft
          </Button> */}
          <Button
            color="primary"
            type="submit"
            isLoading={isSubmitting}
            size="lg"
          >
            Submit Now
          </Button>
        </div>
      </Form>
    </div>
  )
}