import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file, bucket = 'works', folder = '') => {
    if (!file) {
      throw new Error('No file provided')
    }

    // 检查用户认证状态
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
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

      // 上传文件到 Supabase Storage，添加用户元数据
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            userId: user.id,
            originalName: file.name
          }
        })

      clearInterval(progressInterval)

      if (error) {
        console.error('Supabase upload error:', error)
        throw new Error(`上传失败: ${error.message}`)
      }

      if (!data || !data.path) {
        throw new Error('上传失败: 未收到有效的上传数据')
      }

      // 获取公共 URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('获取文件URL失败')
      }

      setProgress(100)
      
      return {
        path: data.path,
        publicUrl,
        fullPath: data.fullPath,
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
      setTimeout(() => setProgress(0), 1000) // 延迟重置进度条
    }
  }

  const uploadMultipleFiles = async (files, bucket = 'works', folder = '') => {
    if (!files || files.length === 0) {
      throw new Error('No files provided')
    }

    const results = []
    const errors = []

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFile(files[i], bucket, folder)
        results.push(result)
      } catch (error) {
        console.error(`Failed to upload file ${files[i].name}:`, error)
        errors.push({ file: files[i].name, error: error.message })
      }
    }

    if (errors.length > 0) {
      const errorMessage = `部分文件上传失败: ${errors.map(e => e.file).join(', ')}`
      throw new Error(errorMessage)
    }

    return results
  }

  const deleteFile = async (filePath, bucket = 'works') => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  const getFileUrl = (filePath, bucket = 'works') => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
    
    return data.publicUrl
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