'use client'

import { useUser } from '@clerk/nextjs'
import { useCredits } from '@/hooks/useCredits'
import { useState } from 'react'

// 强制动态渲染，避免静态生成时的Clerk错误
export const dynamic = 'force-dynamic'

export default function TestCreditsPage() {
  const { user } = useUser()
  const { 
    credits, 
    loading, 
    error, 
    refetch, 
    forceRefresh 
  } = useCredits(true)
  
  const [operationLoading, setOperationLoading] = useState(false)

  const testWebhook = async () => {
    try {
      const response = await fetch('/api/test-creem')
      if (response.ok) {
        console.log('✅ Webhook测试成功')
        await refetch()
      } else {
        console.error('❌ Webhook测试失败')
      }
    } catch (error) {
      console.error('❌ Webhook测试错误:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600">需要登录才能查看积分信息</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💎 积分系统测试</h1>
          <p className="text-gray-600">测试积分管理系统的各项功能</p>
        </div>

        {/* 用户信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👤 用户信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">用户邮箱</label>
              <p className="text-lg">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">用户名</label>
              <p className="text-lg">{user.fullName}</p>
            </div>
          </div>
        </div>

        {/* 积分信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">💰 积分信息</h2>
            <button
              onClick={refetch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '刷新中...' : '刷新积分'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800">❌ {error}</p>
            </div>
          )}

          {loading && !credits ? (
            <div className="text-center py-8">
              <p className="text-gray-500">加载积分信息中...</p>
            </div>
          ) : credits ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                积分信息
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">剩余积分:</span>
                  <span className="font-bold text-purple-600">{credits.remainingCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">总积分:</span>
                  <span className="text-gray-900 dark:text-white">{credits.totalCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">已使用:</span>
                  <span className="text-gray-900 dark:text-white">{credits.usedCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">创建视频:</span>
                  <span className="text-gray-900 dark:text-white">{credits.videosCount}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">未找到积分信息</p>
            </div>
          )}
        </div>

        {/* Webhook 测试 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Webhook 测试</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testWebhook}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              测试 Premium Webhook
            </button>
            
            <button
              onClick={forceRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '强制刷新中...' : '强制刷新积分'}
            </button>
          </div>

          {!hasEnoughCredits(testAmount) && (
            <p className="text-red-600 text-sm mt-2">
              ⚠️ 积分不足，无法扣除 {testAmount} 积分
            </p>
          )}
        </div>

        {/* API 端点信息 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔗 API 端点</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-50 rounded p-3">
              <code className="text-blue-600">GET /api/credits</code>
              <p className="text-gray-600 mt-1">获取用户积分信息</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <code className="text-green-600">POST /api/credits</code>
              <p className="text-gray-600 mt-1">增加/扣除/设置用户积分</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <code className="text-purple-600">POST /api/webhooks/creem</code>
              <p className="text-gray-600 mt-1">Creem 支付 Webhook</p>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <code className="text-orange-600">GET /api/test-creem</code>
              <p className="text-gray-600 mt-1">测试 Creem Webhook</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 