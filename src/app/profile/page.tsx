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
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Form state
  const [formData, setFormData] = useState<{
    name: string
    description: string
    avatar: string | null
  }>({
    name: user?.name || '',
    description: '',
    avatar: user?.image || null,
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
    field: 'name' | 'description' | 'avatar',
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
    }))
    setIsEditing(false)
  }

  return (
    <div className="h-full">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardContent className="p-8">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Profile</h1>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isNameEmpty || uploading}
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

            <div className="grid grid-cols-1 gap-8">
              {/* Left Column - Profile Info */}
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-[168px] h-[168px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-4xl text-gray-600">
                            {formData.name?.[0] || 'U'}
                          </span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div
                        className={`absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity ${uploading ? 'opacity-100 cursor-default' : 'opacity-0 hover:opacity-100 cursor-pointer'}`}
                        onClick={!uploading ? () => fileInputRef.current?.click() : undefined}
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
                  </div>

                  {isEditing && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload new avatar
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Maximum file size: 5MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Name Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder="Enter your name"
                      className="text-2xl font-normal h-12"
                    />
                  ) : formData.name?.trim() ? (
                    <h2 className="text-2xl font-normal">{formData.name}</h2>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Your display name is not set yet.
                    </p>
                  )}
                  {isEditing && isNameEmpty && (
                    <p className="text-xs text-red-500">Name is required</p>
                  )}
                </div>

                {/* Email Section (read-only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={user?.email || ''}
                    readOnly
                    disabled
                    placeholder="your-email@example.com"
                  />
                </div>

                {/* Badge removed */}

                {/* Description Section */}
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
                      No description yet. Add a short bio to let others know
                      about you.
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.description.length}/500
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column removed as requested */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
