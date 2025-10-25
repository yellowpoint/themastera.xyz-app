'use client'

import { useState, useRef } from 'react'
import { Button, Progress, Card, CardBody } from '@heroui/react'
import { Upload, X, Video, Check } from 'lucide-react'
import { supabase, getStorageUrl } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function VideoUpload({
  onUploadComplete,
  maxSize = 50 * 1024 * 1024, // 50MB
  bucket = 'data',
  folder = ''
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  // 确保 bucket 和 folder 参数有效
  const storageBucket = bucket || 'data'
  const storageFolder = folder ? `${folder}/` : ''

  // 上传单个文件
  const uploadFile = async (file) => {
    if (!file) {
      throw new Error('No file provided')
    }

    // 检查用户认证状态
    if (!user) {
      throw new Error('请先登录后再上传文件')
    }

    try {
      // 生成唯一文件名，包含用户ID以确保权限
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = storageFolder ? `${storageFolder}${user.id}/${fileName}` : `${user.id}/${fileName}`

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // 使用Supabase上传文件
      const { data, error } = await supabase
        .storage
        .from(storageBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      clearInterval(progressInterval)

      if (error) {
        throw new Error(`上传失败: ${error.message || '未知错误'}`)
      }

      // 获取文件的公共URL
      const publicUrl = getStorageUrl(storageBucket, filePath)
      setProgress(100)

      return {
        fileUrl: publicUrl,
        fullPath: filePath,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type
      }

    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setTimeout(() => setProgress(0), 1000)
    }
  }

  // 上传多个文件
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) {
      throw new Error('No files provided')
    }

    setUploading(true)
    const results = []
    const errors = []

    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const result = await uploadFile(files[i])
          results.push(result)
        } catch (error) {
          errors.push({ file: files[i].name, error: error.message })
        }
      }

      return {
        results,
        errors,
        success: errors.length === 0
      }
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = async (files) => {
    setError('') // 清除之前的错误
    const fileArray = Array.from(files)
    
    // 验证文件类型（只允许视频文件）
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('video/')) {
        setError(`文件 ${file.name} 不是视频文件`)
        return false
      }
      if (file.size > maxSize) {
        setError(`文件 ${file.name} 超过大小限制 (${maxSize / 1024 / 1024}MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // 自动开始上传
    try {
      setUploading(true)
      const uploadResult = await uploadFiles(validFiles)

      if (uploadResult && uploadResult.results) {
        const newUploadedFiles = [...uploadedFiles, ...uploadResult.results];
        setUploadedFiles(newUploadedFiles);
        
        // 传递文件信息
        onUploadComplete?.(newUploadedFiles);
        setError('');
      } else {
        setError('上传失败：未收到有效的上传结果')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setError(error.message || '上传失败，请重试')
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

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUploadComplete?.(newFiles)
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
      {/* 视频文件上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
          ? 'border-primary bg-primary/10'
          : 'border-gray-300 hover:border-gray-400'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">
          点击或拖拽视频文件到此处上传
        </p>
        <p className="text-sm text-gray-500">
          支持的格式: MP4, MOV, AVI, MKV | 最大大小: {maxSize / 1024 / 1024}MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* 上传进度 */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>上传中...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* 已上传视频列表 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-green-600">已上传的视频:</h4>
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="border-green-200">
              <CardBody className="flex flex-row items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">{file.originalName || file.fileName}</p>
                    <p className="text-sm text-green-600">
                      上传成功 • {formatFileSize(file.size)}
                    </p>
                    {file.fileUrl && (
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        查看视频
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}