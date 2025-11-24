'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { getStorageUrl, supabase } from '@/lib/supabase'
import {
  ImageIcon,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type CoverImage = {
  fileUrl: string
  playbackId?: string
  fullPath?: string
  fileName?: string
  originalName?: string
  size?: number
  type?: string
}

type ImgUploadProps = {
  onUploadComplete?: (result: CoverImage | null) => void
  maxSize?: number
  bucket?: string
  folder?: string
  subDir?: string
  required?: boolean
  initialImage?: CoverImage | null
}

export default function ImgUpload({
  onUploadComplete,
  maxSize = 10 * 1024 * 1024, // 10MB
  bucket = 'data',
  folder = '',
  subDir = 'covers',
  required = true, // Whether it is required
  initialImage = null, // Prefilled cover image (e.g., Mux thumbnail)
}: ImgUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [coverImage, setCoverImage] = useState<CoverImage | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // Only prefill initialImage once; otherwise remove action will re-fill it
  const hasPrefilledRef = useRef<boolean>(false)
  const { user } = useAuth()

  // 确保 bucket 和 folder 参数有效
  const storageBucket = bucket || 'data'
  const storageFolder = folder ? `${folder}/` : ''

  // Prefill cover image from parent (e.g., auto-generated Mux thumbnail)
  // Ensure it happens only once to avoid re-populating after user removes the image
  useEffect(() => {
    if (initialImage && !coverImage && !hasPrefilledRef.current) {
      setCoverImage(initialImage)
      hasPrefilledRef.current = true
    }
  }, [initialImage, coverImage])

  // 上传封面图
  const uploadCoverImage = async (file: File): Promise<CoverImage> => {
    if (!file) return null

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `cover_${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const dir = subDir || 'covers'
      const filePath = storageFolder
        ? `${storageFolder}${user!.id}/${dir}/${fileName}`
        : `${user!.id}/${dir}/${fileName}`

      const { data, error } = await supabase.storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        throw new Error(`Cover upload failed: ${error.message}`)
      }

      const publicUrl = getStorageUrl(storageBucket, filePath)

      return {
        fileUrl: publicUrl,
        fullPath: filePath,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
      }
    } catch (error) {
      console.error('Cover upload error:', error)
      throw error as Error
    }
  }

  const handleFileSelect = async (files: FileList) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Cover must be an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`Image file exceeds size limit (${maxSize / 1024 / 1024}MB)`)
      return
    }

    try {
      setUploading(true)
      setError('')
      const result = await uploadCoverImage(file)
      setCoverImage(result)

      // Notify parent component
      onUploadComplete?.(result)
    } catch (error) {
      console.error('Cover upload failed:', error)
      setError(error.message || 'Cover upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files)
    }
  }

  const removeCover = () => {
    setCoverImage(null)
    onUploadComplete?.(null)
    // Clear input value to allow re-selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const autoGenerateCover = () => {
    const playbackId = initialImage?.playbackId
    const thumbUrl = `https://image.mux.com/${playbackId}/thumbnail.webp?width=640&height=360&fit_mode=smartcrop&time=3`
    const result: CoverImage = {
      fileUrl: thumbUrl,
      originalName: 'Auto Generated',
    }
    setCoverImage(result)
    onUploadComplete?.(result)
  }

  return (
    <div className="w-full flex flex-col  gap-3">
      <div
        className={`relative w-50 aspect-video border-2 border-dashed rounded-2xl p-2 text-center transition-colors border-gray-300 hover:border-gray-400 ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => {
          if (!uploading) fileInputRef.current?.click()
        }}
        aria-label={coverImage ? 'Change image' : 'Upload image'}
        aria-busy={uploading}
      >
        {!coverImage ? (
          <div className="size-full flex flex-col items-center justify-center gap-2">
            <ImageIcon className="size-12 text-gray-800" aria-hidden="true" />
            <p className=" text-gray-500">upload file</p>
          </div>
        ) : (
          <div className="size-full">
            <img
              src={coverImage.fileUrl}
              alt="Preview of uploaded image"
              className="size-full object-contain"
            />
            <div className="absolute top-1 right-1 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    size="icon"
                    variant="secondary"
                    className="size-6 hover:bg-secondary"
                    aria-label="Actions"
                    disabled={uploading}
                  >
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[10rem]">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!uploading) fileInputRef.current?.click()
                    }}
                  >
                    <RefreshCw className="size-4" />
                    Reselect
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!uploading) autoGenerateCover()
                    }}
                  >
                    <Sparkles className="size-4" />
                    Auto generate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!uploading) removeCover()
                    }}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-700" />
            <p className="mt-1 text-xs text-gray-600">Uploading...</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
          disabled={uploading}
        />
      </div>
      <p className="text-xs text-gray-600">
        {coverImage?.originalName || 'No file selected'}
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
