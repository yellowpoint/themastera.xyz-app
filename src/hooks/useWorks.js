import { useState, useEffect, useCallback } from 'react'

export const useWorks = (userId = null) => {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch works list
  const fetchWorks = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      if (userId) {
        params.append('userId', userId)
      }
      
      if (filters.category) {
        params.append('category', filters.category)
      }
      
      if (filters.status) {
        params.append('status', filters.status)
      }
      
      if (filters.page) {
        params.append('page', filters.page.toString())
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString())
      }

      const response = await fetch(`/api/works?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch works')
      }

      setWorks(result.data || [])
      return result
    } catch (err) {
      setError(err.message)
      console.error('Error fetching works:', err)
      setWorks([])
      throw err
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Create new work
  const createWork = async (workData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create work')
      }

      setWorks(prev => [result.data, ...prev])
      return result.data
    } catch (err) {
      setError(err.message)
      console.error('Error creating work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update work
  const updateWork = async (workId, updates) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/works/${workId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update work')
      }

      setWorks(prev => 
        prev.map(work => 
          work.id === workId ? { ...work, ...result.data } : work
        )
      )
      
      return result.data
    } catch (err) {
      setError(err.message)
      console.error('Error updating work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete work
  const deleteWork = async (workId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/works/${workId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete work')
      }

      setWorks(prev => prev.filter(work => work.id !== workId))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting work:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch work statistics
  const getWorkStats = useCallback(async (userId) => {
    try {
      const response = await fetch(`/api/works/stats?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch work stats')
      }

      return result.data
    } catch (err) {
      console.error('Error fetching work stats:', err)
      return {
        totalWorks: 0,
        totalDownloads: 0,
        totalEarnings: 0,
        averageRating: 0,
        monthlyEarnings: 0,
        monthlyViews: 0,
        completionRate: 96
      }
    }
  }, [])

  // Initial load
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