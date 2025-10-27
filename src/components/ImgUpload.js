'use client'

import { useState, useRef, useEffect } from 'react'
import { Button, Card, CardBody, Image } from '@heroui/react'
import { Camera, X, ImageIcon, Upload } from 'lucide-react'
import { supabase, getStorageUrl } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function ImgUpload({
  onUploadComplete,
  maxSize = 10 * 1024 * 1024, // 10MB
  bucket = 'data',
  folder = '',
  required = true, // Whether it is required
  initialImage = null // Prefilled cover image (e.g., Mux thumbnail)
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  // 确保 bucket 和 folder 参数有效
  const storageBucket = bucket || 'data'
  const storageFolder = folder ? `${folder}/` : ''

  // Prefill cover image from parent (e.g., auto-generated Mux thumbnail)
  useEffect(() => {
    if (initialImage && !coverImage) {
      setCoverImage(initialImage)
    }
  }, [initialImage])

  // 上传封面图
  const uploadCoverImage = async (file) => {
    if (!file) return null

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `cover_${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = storageFolder ? `${storageFolder}${user.id}/covers/${fileName}` : `${user.id}/covers/${fileName}`

      const { data, error } = await supabase
        .storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
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
        type: file.type
      }
    } catch (error) {
      console.error('Cover upload error:', error)
      throw error
    }
  }

  const handleFileSelect = async (files) => {
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
      onUploadComplete?.(result);
    } catch (error) {
      console.error('Cover upload failed:', error)
      setError(error.message || 'Cover upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files)
    }
  }

  const removeCover = () => {
    setCoverImage(null)
    onUploadComplete?.(null)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full space-y-4">
      {/* Title area */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Work Cover {required && <span className="text-red-500">*</span>}
        </h4>
        {!coverImage && (
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => fileInputRef.current?.click()}
            startContent={<ImageIcon className="w-4 h-4" />}
            isLoading={uploading}
          >
            Select Cover
          </Button>
        )}
      </div>

      {/* Upload area */}
      {!coverImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragActive
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 hover:border-gray-400'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-sm font-medium mb-1">
            Click or drag an image here to upload
          </p>
          <p className="text-xs text-gray-500">
            Supports JPG, PNG, GIF formats | Max {maxSize / 1024 / 1024}MB
          </p>
        </div>
      ) : (
        /* Cover preview */
        <Card className="border-green-200">
          <CardBody className="flex flex-row items-center justify-between p-3">
            <div className="flex items-center space-x-3">
              <Image
                src={coverImage.fileUrl}
                alt="Cover preview"
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium text-green-800">{coverImage.originalName}</p>
                <p className="text-sm text-green-600">
                  Cover Image • {formatFileSize(coverImage.size)}
                </p>
                <a
                  href={coverImage.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View Original
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => fileInputRef.current?.click()}
                startContent={<ImageIcon className="w-4 h-4" />}
                isLoading={uploading}
              >
                Change
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={removeCover}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Required prompt */}
      {required && !coverImage && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded text-sm">
          <p className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Cover image is required, please select an image as the work cover
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}