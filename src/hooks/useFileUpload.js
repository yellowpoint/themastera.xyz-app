import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file, bucket = 'works', folder = '') => {
    if (!file) {
      throw new Error('No file provided')
    }

    setUploading(true)
    setProgress(0)

    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      // 上传文件到 Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      // 获取公共 URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setProgress(100)
      
      return {
        path: data.path,
        publicUrl,
        fullPath: data.fullPath
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const uploadMultipleFiles = async (files, bucket = 'works', folder = '') => {
    const uploadPromises = files.map(file => uploadFile(file, bucket, folder))
    return Promise.all(uploadPromises)
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