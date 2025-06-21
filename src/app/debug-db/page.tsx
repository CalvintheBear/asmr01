'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function DebugDBPage() {
  const { user, isLoaded } = useUser()
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [syncResult, setSyncResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const result = await response.json()
      setDbStatus(result)
    } catch (error) {
      console.error('数据库连接测试失败:', error)
      setDbStatus({ error: '连接失败' })
    } finally {
      setLoading(false)
    }
  }

  const syncCurrentUser = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST'
      })
      const result = await response.json()
      setSyncResult(result)
    } catch (error) {
      console.error('用户同步失败:', error)
      setSyncResult({ error: '同步失败' })
    } finally {
      setLoading(false)
    }
  }

  const checkCredits = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/credits')
      const result = await response.json()
      console.log('积分检查结果:', result)
    } catch (error) {
      console.error('积分检查失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testDatabaseConnection()
  }, [])

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">数据库调试页面</h1>
        
        {/* 用户状态 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">用户状态</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>用户ID:</strong> {user.id}</p>
              <p><strong>邮箱:</strong> {user.primaryEmailAddress?.emailAddress}</p>
              <p><strong>姓名:</strong> {user.fullName}</p>
            </div>
          ) : (
            <p>未登录</p>
          )}
        </div>

        {/* 数据库状态 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">数据库连接状态</h2>
          <button 
            onClick={testDatabaseConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
          >
            {loading ? '检测中...' : '测试连接'}
          </button>
          {dbStatus && (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(dbStatus, null, 2)}
            </pre>
          )}
        </div>

        {/* 用户同步 */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">用户同步</h2>
            <div className="space-x-4 mb-4">
              <button 
                onClick={syncCurrentUser}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? '同步中...' : '同步用户'}
              </button>
              <button 
                onClick={checkCredits}
                disabled={loading}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                {loading ? '检查中...' : '检查积分'}
              </button>
            </div>
            {syncResult && (
              <div>
                <h3 className="font-semibold mb-2">同步结果:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(syncResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {/* 返回主页 */}
        <div className="text-center">
          <a 
            href="/"
            className="inline-block bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
          >
            返回主页
          </a>
        </div>
      </div>
    </div>
  )
} 