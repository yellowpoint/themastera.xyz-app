import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export const useWorks = (userId = null) => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 获取作品列表
  const fetchWorks = async (filters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      // 构建查询条件
      let query = supabase
        .from('works')
        .select(`
          *,
          author:users(id, name, avatar),
          reviews(rating),
          purchases(id)
        `)

      // 如果指定了用户ID，只获取该用户的作品
      if (userId) {
        query = query.eq('authorId', userId)
      }

      // 应用其他过滤条件
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      // 排序
      query = query.order('createdAt', { ascending: false })

      const { data, error } = await query

      if (error) throw error

      setWorks(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching works:', err)
    } finally {
      setLoading(false)
    }
  }

  // 创建新作品
  const createWork = async (workData) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('works')
        .insert([workData])
        .select()
        .single()

      if (error) throw error

      setWorks(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error creating work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 更新作品
  const updateWork = async (workId, updates) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('works')
        .update(updates)
        .eq('id', workId)
        .select()
        .single()

      if (error) throw error

      setWorks(prev => 
        prev.map(work => 
          work.id === workId ? { ...work, ...data } : work
        )
      )
      
      return data
    } catch (err) {
      setError(err.message)
      console.error('Error updating work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 删除作品
  const deleteWork = async (workId) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', workId)

      if (error) throw error

      setWorks(prev => prev.filter(work => work.id !== workId))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 获取作品统计数据
  const getWorkStats = async (authorId) => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select(`
          id,
          downloads,
          earnings,
          reviews(rating)
        `)
        .eq('authorId', authorId)
        .eq('status', 'published')

      if (error) throw error

      const stats = {
        totalWorks: data.length,
        totalDownloads: data.reduce((sum, work) => sum + work.downloads, 0),
        totalEarnings: data.reduce((sum, work) => sum + work.earnings, 0),
        averageRating: 0
      }

      // 计算平均评分
      const allRatings = data.flatMap(work => work.reviews.map(r => r.rating))
      if (allRatings.length > 0) {
        stats.averageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
      }

      return stats
    } catch (err) {
      console.error('Error fetching work stats:', err)
      return {
        totalWorks: 0,
        totalDownloads: 0,
        totalEarnings: 0,
        averageRating: 0
      }
    }
  }

  // 初始加载
  useEffect(() => {
    fetchWorks()
  }, [userId])

  return {
    works,
    loading,
    error,
    fetchWorks,
    createWork,
    updateWork,
    deleteWork,
    getWorkStats
  }
}