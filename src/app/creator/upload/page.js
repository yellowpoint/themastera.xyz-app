'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Plus, X } from 'lucide-react'
import UploadSwitcher from '@/components/UploadSwitcher'
import ImgUpload from '@/components/ImgUpload'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import { MUSIC_CATEGORIES, LANGUAGE_CATEGORIES } from '@/config/categories'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  const [autoCover, setAutoCover] = useState(null)

  // Handle video upload completion
  const handleVideoUploadComplete = (uploadedFiles) => {
    console.log('Video upload results:', uploadedFiles)

    if (uploadedFiles && uploadedFiles.length > 0) {
      const fileUrls = uploadedFiles.map(file => file.fileUrl).join(',')
      setUploadForm(prev => ({
        ...prev,
        fileUrl: fileUrls
      }))

      // Try to auto-generate a cover thumbnail from Mux playbackId
      const withPlayback = uploadedFiles.find(f => !!f.playbackId)
      if (withPlayback?.playbackId) {
        // Generate a thumbnail URL per Mux docs
        // Prefer webp for smaller size, use smartcrop with reasonable dimensions
        const playbackId = withPlayback.playbackId
        const thumbUrl = `https://image.mux.com/${playbackId}/thumbnail.webp?width=640&height=360&fit_mode=smartcrop&time=3`

        // Reflect to cover upload component by pre-filling initial image
        const initialImage = {
          fileUrl: thumbUrl,
          originalName: 'Auto thumbnail',
          size: 0,
          type: 'image/webp'
        }
        setAutoCover(initialImage)

        // Also set into form so submit uses this as default cover
        setUploadForm(prev => ({
          ...prev,
          thumbnailUrl: thumbUrl
        }))
      }
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
      toast.error('Please login first')
      return
    }

    if (!uploadForm.title || !uploadForm.description || !uploadForm.category) {
      toast.error('Please fill in required information')
      return
    }

    if (!uploadForm.fileUrl) {
      toast.error('Please upload video file')
      return
    }

    if (!uploadForm.thumbnailUrl) {
      toast.error('Please upload cover image')
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
      toast.success('Work published successfully!')
      router.push('/creator')
    } catch (error) {
      console.error('Publish failed:', error)
      toast.error('Publish failed, please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Save draft
  const handleSaveDraft = async () => {
    if (!user) {
      toast.error('Please login first')
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
      toast.success('Draft saved successfully!')
      router.push('/creator')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Save failed, please try again')
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
                size="icon"
                variant="ghost"
                onClick={() => router.back()}
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-xl font-semibold">Publish Video</h1>
            </div>

          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Video upload area */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Upload Video</h2>
                <UploadSwitcher onUploadComplete={handleVideoUploadComplete} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Upload Cover</h2>
                <ImgUpload
                  onUploadComplete={handleCoverUploadComplete}
                  required={true}
                  initialImage={autoCover}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Basic settings */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Basic Settings</h3>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Title
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter a title for your work"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400">
                      {uploadForm.title.length}/80
                    </span>
                  </div>
                </div>

                {/* Style */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Style
                  </label>
                  <Select value={uploadForm.category} onValueChange={(val) => setUploadForm(prev => ({ ...prev, category: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Language
                  </label>
                  <Select value={uploadForm.language} onValueChange={(val) => setUploadForm(prev => ({ ...prev, language: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_CATEGORIES.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={uploadForm.price}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Description</h3>
                <Textarea
                  placeholder="Provide more details to help people discover your video"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                />
                <div className="flex justify-end">
                  <span className="text-xs text-gray-400">
                    {uploadForm.description.length}/2000
                  </span>
                </div>
              </CardContent>
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
            type="submit"
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Now'}
          </Button>
        </div>
      </form>
    </div>
  )
}