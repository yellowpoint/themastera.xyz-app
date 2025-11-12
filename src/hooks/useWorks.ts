'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, type RequestResult } from '@/lib/request'
import type { Paginated } from '@/contracts/types/common'
import type { Work, WorkFilters } from '@/contracts/domain/work'

export const useWorks = (options?: { autoFetch?: boolean; initialFilters?: WorkFilters }) => {
  const { autoFetch = true, initialFilters = {} } = options || {}
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorks = useCallback(async (filters: WorkFilters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if ((filters as any).q) params.append('q', String((filters as any).q))
      if (filters.page) params.append('page', String(filters.page))
      if (filters.limit) params.append('limit', String(filters.limit))

      const res: RequestResult<Paginated<Work>> = await api.get(
        `/api/works?${params.toString()}`
      )
      const result = res.data
      if (res.ok === false || result?.success === false) {
        const msg = result?.error?.message || 'Failed to fetch works'
        throw new Error(msg)
      }
      const items = (result as any)?.data?.items || []
      setWorks(items)
      return result
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching works:', err)
      setWorks([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createWork = async (workData: Partial<Work>) => {
    setLoading(true)
    setError(null)
    try {
      const res: RequestResult<Work> = await api.post('/api/works', workData)
      const result = res.data
      if (res.ok === false || result?.success === false) {
        const msg = result?.error?.message || 'Failed to create work'
        throw new Error(msg)
      }
      setWorks((prev) => [result!.data, ...prev])
      return result!.data
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateWork = async (workId: string, updates: Partial<Work>) => {
    setLoading(true)
    setError(null)
    try {
      const res: RequestResult<Work> = await api.put(
        `/api/works/${workId}`,
        updates
      )
      const result = res.data
      if (res.ok === false || result?.success === false) {
        const msg = result?.error?.message || 'Failed to update work'
        throw new Error(msg)
      }
      setWorks((prev) =>
        prev.map((work) =>
          work.id === workId ? { ...work, ...result!.data } : work
        )
      )
      return result!.data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteWork = async (workId: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.delete(`/api/works/${workId}`)
      const result = res.data
      if (res.ok === false || result?.success === false) {
        const msg = result?.error?.message || 'Failed to delete work'
        throw new Error(msg)
      }
      setWorks((prev) => prev.filter((work) => work.id !== workId))
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getWorkStats = useCallback(async () => {
    try {
      const res: RequestResult<{
        totalWorks: number
        totalDownloads: number
        totalEarnings: number
        averageRating: number
        monthlyEarnings: number
        monthlyViews: number
        completionRate: number
      } | null> = await api.get(`/api/works/stats`)
      const result = res.data
      if (res.ok === false || result?.success === false) {
        const msg = result?.error?.message || 'Failed to fetch work stats'
        throw new Error(msg)
      }
      return (
        result?.data || {
          totalWorks: 0,
          totalDownloads: 0,
          totalEarnings: 0,
          averageRating: 0,
          monthlyEarnings: 0,
          monthlyViews: 0,
          completionRate: 96,
        }
      )
    } catch (err) {
      console.error('Error fetching work stats:', err)
      return {
        totalWorks: 0,
        totalDownloads: 0,
        totalEarnings: 0,
        averageRating: 0,
        monthlyEarnings: 0,
        monthlyViews: 0,
        completionRate: 96,
      }
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchWorks(initialFilters)
    }
  }, [fetchWorks, autoFetch])

  return {
    works,
    loading,
    error,
    fetchWorks,
    createWork,
    updateWork,
    deleteWork,
    getWorkStats,
  }
}
