import { useState, useEffect } from 'react'

interface CreditsData {
  totalCredits: number
  usedCredits: number
  remainingCredits: number
  videosCount: number
}

interface UseCreditsReturn {
  credits: CreditsData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCredits(autoFetch: boolean = false): UseCreditsReturn {
  const [credits, setCredits] = useState<CreditsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCredits = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/credits')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '获取积分信息失败')
      }

      if (data.success && data.data) {
        setCredits(data.data)
      } else {
        throw new Error('返回数据格式错误')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(errorMessage)
      console.error('获取积分信息失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchCredits()
    }
  }, [autoFetch])

  return {
    credits,
    loading,
    error,
    refetch: fetchCredits
  }
} 