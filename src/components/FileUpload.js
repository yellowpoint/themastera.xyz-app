'use client'

import { useState, useRef } from 'react'
import { Button, Progress, Card, CardBody } from '@heroui/react'
import { Upload, X, File, Image } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'

export default function FileUpload({ 
  onUploadComplete, 
  acceptedTypes = "image/*,application/pdf,.zip,.rar", 
  maxSize = 10 * 1024 * 1024, // 10MB
  bucket = 'works',
  folder = '',
  multiple = false 
}) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  
  const { uploadFile, uploadMultipleFiles, uploading, progress } = useFileUpload()

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        alert(`文件 ${file.name} 超过大小限制 (${maxSize / 1024 / 1024}MB)`)
        return false
      }
      return true
    })

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles])
    } else {
      setSelectedFiles(validFiles.slice(0, 1))
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
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    try {
      let results
      if (multiple && selectedFiles.length > 1) {
        results = await uploadMultipleFiles(selectedFiles, bucket, folder)
      } else {
        const result = await uploadFile(selectedFiles[0], bucket, folder)
        results = [result]
      }

      onUploadComplete?.(results)
      setSelectedFiles([])
    } catch (error) {
      console.error('Upload failed:', error)
      alert('上传失败，请重试')
    }
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-6 h-6" />
    }
    return <File className="w-6 h-6" />
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
      {/* 拖拽上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">
          点击或拖拽文件到此处上传
        </p>
        <p className="text-sm text-gray-500">
          支持的格式: {acceptedTypes} | 最大大小: {maxSize / 1024 / 1024}MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* 已选择的文件列表 */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">已选择的文件:</h4>
          {selectedFiles.map((file, index) => (
            <Card key={index}>
              <CardBody className="flex flex-row items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
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

      {/* 上传按钮 */}
      {selectedFiles.length > 0 && (
        <Button
          color="primary"
          onPress={handleUpload}
          isLoading={uploading}
          className="w-full"
        >
          {uploading ? '上传中...' : `上传 ${selectedFiles.length} 个文件`}
        </Button>
      )}
    </div>
  )
}