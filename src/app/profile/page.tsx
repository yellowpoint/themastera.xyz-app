'use client'

import { useEffect, useRef, useState } from 'react'
// Separator removed (no longer used)
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import type { AuthUser } from '@/hooks/useAuth'
import { useAuth } from '@/hooks/useAuth'
import { request } from '@/lib/request'
import { getStorageUrl, supabase } from '@/lib/supabase'
import { Camera, Edit, Save, X } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadingCover, setUploadingCover] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  // Form state
  const [formData, setFormData] = useState<{
    name: string
    description: string
    avatar: string | null
    coverImage: string | null
  }>({
    name: user?.name || '',
    description: '',
    avatar: user?.image || null,
    coverImage: null,
  })

  // Validation state
  const isNameEmpty = !(formData.name || '').trim()

  // Prefill from API to get description and latest fields
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return
      try {
        const { data } = await request.get<AuthUser>(`/api/users/${user.id}`)
        if (data?.success && (data.data as any)) {
          const u: any = data.data
          setFormData((prev) => ({
            ...prev,
            name: u.name || prev.name,
            description: u.description || '',
            avatar: u.image || prev.avatar,
            coverImage: (u as any)?.coverImage || prev.coverImage || null,
          }))
        }
      } catch (e) {
        console.error('Failed to fetch user profile:', e)
      }
    }
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const handleInputChange = (
    field: 'name' | 'description' | 'avatar' | 'coverImage',
    value: string | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const uploadAvatar = async (file: File) => {
    if (!file || !user?.id) return null

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar_${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/avatars/${fileName}`

      const { data, error } = await supabase.storage
        .from('data')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        throw new Error(`Avatar upload failed: ${error.message}`)
      }

      const publicUrl = getStorageUrl('data', filePath)
      return publicUrl
    } catch (error) {
      console.error('Avatar upload error:', error)
      throw error
    }
  }

  const handleAvatarUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (10MB limit — consistent with ImgUpload)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file must be less than 10MB')
      return
    }

    try {
      setUploading(true)
      const avatarUrl = await uploadAvatar(file)
      handleInputChange('avatar', avatarUrl)
      toast.success('Avatar uploaded successfully')
    } catch (error) {
      console.error('Avatar upload failed:', error)
      toast.error('Avatar upload failed')
    } finally {
      setUploading(false)
    }
  }

  const uploadCover = async (file: File) => {
    if (!file || !user?.id) return null
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `cover_${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${user.id}/covers/${fileName}`
      const { data, error } = await supabase.storage
        .from('data')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })
      if (error) throw new Error(`Cover upload failed: ${error.message}`)
      const publicUrl = getStorageUrl('data', filePath)
      return publicUrl
    } catch (error) {
      console.error('Cover upload error:', error)
      throw error
    }
  }

  const handleCoverUpload = async (files: FileList) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file must be less than 10MB')
      return
    }
    try {
      setUploadingCover(true)
      const coverUrl = await uploadCover(file)
      handleInputChange('coverImage', coverUrl)
      if (user?.id) {
        const { data } = await request.put(`/api/users/${user.id}`, {
          coverImage: coverUrl,
        })
        if (!data?.success)
          throw new Error((data as any)?.error || 'Update failed')
      }
      toast.success('Cover updated successfully')
    } catch (error) {
      console.error('Cover upload failed:', error)
      toast.error('Cover upload failed')
    } finally {
      setUploadingCover(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarUpload(e.target.files)
    }
  }

  const handleSave = async () => {
    try {
      if (!user?.id) {
        toast.error('Not authenticated')
        return
      }
      if (isNameEmpty) {
        toast.error('Name cannot be empty')
        return
      }
      const payload = {
        name: formData.name,
        image: formData.avatar || null,
        description: formData.description || null,
        coverImage: formData.coverImage || null,
      }
      const { data } = await request.put(`/api/users/${user.id}`, payload)
      if (!data?.success) {
        throw new Error((data as any)?.error || 'Update failed')
      }

      refreshUser().catch(() => {})

      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData((prev) => ({
      name: user?.name || prev.name || '',
      description: prev.description || '',
      avatar: user?.image || prev.avatar || null,
      coverImage: prev.coverImage || null,
    }))
    setIsEditing(false)
  }

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full overflow-hidden p-0">
          <div className="relative w-full h-48 md:h-64 bg-gray-200">
            {formData.coverImage ? (
              <img
                src={formData.coverImage}
                alt="Profile cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300" />
            )}
            {isEditing && (
              <div
                className={`${uploadingCover ? 'opacity-100 cursor-default' : 'opacity-50 hover:opacity-100 cursor-pointer'} absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity`}
                onClick={
                  !uploadingCover
                    ? () => coverInputRef.current?.click()
                    : undefined
                }
              >
                {uploadingCover ? (
                  <Spinner className="h-8 w-8 text-white" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleCoverUpload(e.target.files)
              }
              className="hidden"
              disabled={uploadingCover}
            />
          </div>
          <CardContent className="pb-10">
            <div className="flex relative z-20 justify-between items-center mb-8">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 ml-auto"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2 ml-auto">
                  <Button
                    onClick={handleSave}
                    disabled={isNameEmpty || uploading || uploadingCover}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <div className="-mt-40 relative flex flex-col items-start">
              <div className="size-28 md:size-32 rounded-full overflow-hidden ring-2 ring-white bg-gray-200 shadow">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-3xl md:text-4xl text-gray-600">
                      {formData.name?.[0] || 'U'}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div
                  className={`${uploading ? 'opacity-100 cursor-default' : 'opacity-50 hover:opacity-100 cursor-pointer'} absolute left-0 top-0 w-28 h-28 md:w-32 md:h-32 rounded-full bg-black/50 flex items-center justify-center transition-opacity`}
                  onClick={
                    !uploading ? () => fileInputRef.current?.click() : undefined
                  }
                >
                  {uploading ? (
                    <Spinner className="h-8 w-8 text-white" />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={uploading}
              />
              <div className="mt-3 w-full">
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                    className="h-10 text-xl font-normal w-full"
                  />
                ) : formData.name?.trim() ? (
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {formData.name}
                  </h2>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Your display name is not set yet.
                  </p>
                )}
                {isEditing && isNameEmpty && (
                  <p className="text-xs text-red-500 mt-1">Name is required</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={user?.email || ''}
                  readOnly
                  disabled
                  placeholder="your-email@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Tell us about yourself..."
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                  />
                ) : formData.description?.trim() ? (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {formData.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No description yet. Add a short bio to let others know about
                    you.
                  </p>
                )}
                {isEditing && (
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.description.length}/500
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
