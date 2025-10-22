import { useState } from 'react'
import { useAuth } from './useAuth'

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { user } = useAuth()

  const uploadFile = async (file, folder = '') => {
    if (!file) {
      throw new Error('No file provided')
    }

    // 检查用户认证状态
    if (!user) {
      throw new Error('请先登录后再上传文件')
    }

    setUploading(true)
    setProgress(0)

    try {
      // 生成唯一文件名，包含用户ID以确保权限
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = folder ? `${folder}/${user.id}/${fileName}` : `${user.id}/${fileName}`

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

      // 创建 FormData 对象
      const formData = new FormData()
      formData.append('file', file)
      formData.append('filePath', filePath)
      formData.append('userId', user.id)

      // 上传文件到自定义 API 端点
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`上传失败: ${errorData.message || '未知错误'}`)
      }

      const result = await response.json()
      setProgress(100)

      return {
        path: result.path,
        publicUrl: result.publicUrl,
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
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const uploadMultipleFiles = async (files, folder = '') => {
    if (!files || files.length === 0) {
      throw new Error('No files provided')
    }

    const results = []
    const errors = []

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i], folder)
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
  }

  const deleteFile = async (filePath) => {
    if (!user) {
      throw new Error('请先登录')
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath,
          userId: user.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`删除失败: ${errorData.message || '未知错误'}`)
      }

      return { error: null }
    } catch (error) {
      console.error('Delete error:', error)
      return { error }
    }
  }

  const getFileUrl = (filePath) => {
    // 返回文件的公共访问 URL
    return `/api/files/${filePath}`
  }

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    getFileUrl,
    uploading,
    progress
  }
}