'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useCredits } from '@/hooks/useCredits'
import { CREDITS_CONFIG } from '@/lib/credits-config'
import { useEffect, useState } from 'react'

interface Purchase {
  id: string
  packageType: string
  packageName: string
  amount: number
  currency: string
  creditsAdded: number
  orderId: string
  status: string
  formattedDate: string
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { credits, loading, error, refetch } = useCredits(false) // 不自动获取
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [purchasesLoading, setPurchasesLoading] = useState(false)
  const [purchasesError, setPurchasesError] = useState<string | null>(null)

  // 获取购买历史
  const fetchPurchases = async () => {
    try {
      setPurchasesLoading(true)
      setPurchasesError(null)
      
      const response = await fetch('/api/user/purchases')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPurchases(result.data.purchases)
        } else {
          setPurchasesError(result.error)
        }
      } else {
        setPurchasesError('获取购买历史失败')
      }
    } catch (error) {
      console.error('获取购买历史失败:', error)
      setPurchasesError('网络错误')
    } finally {
      setPurchasesLoading(false)
    }
  }

  // 用户加载完成后自动同步到数据库并获取最新数据
  useEffect(() => {
    let isMounted = true
    let lastSyncTime = 0
    const SYNC_COOLDOWN = 30000 // 30秒冷却时间
    
    const syncUserAndFetchData = async () => {
      if (!isLoaded || !user || !isMounted) return
      
      // 检查冷却时间
      const now = Date.now()
      if (now - lastSyncTime < SYNC_COOLDOWN) {
        console.log('⏰ 同步冷却中，直接获取数据...')
        // 即使在冷却期也要获取最新数据
        if (isMounted) {
          refetch()
          fetchPurchases()
        }
        return
      }
      
      try {
        setSyncing(true)
        setSyncError(null)
        lastSyncTime = now
        
        console.log('🔄 开始同步用户到数据库...')
        const response = await fetch('/api/user/sync', {
          method: 'POST'
        })
        
        if (!response.ok) {
          // 如果是速率限制错误，静默处理
          if (response.status === 429) {
            console.log('⚠️ Clerk API速率限制，稍后自动重试')
            // 直接获取积分信息，因为用户可能已经存在
            if (isMounted) {
              refetch()
              fetchPurchases()
            }
            return
          }
          
          const errorData = await response.json()
          throw new Error(errorData.error || '用户同步失败')
        }
        
        const result = await response.json()
        console.log('✅ 用户同步成功:', result)
        
        // 同步成功后获取最新积分信息和购买历史
        if (isMounted) {
          console.log('📊 正在获取最新积分和购买记录...')
          refetch()
          fetchPurchases()
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : '用户同步失败'
          setSyncError(errorMessage)
          console.error('用户同步失败:', err)
          
          // 即使同步失败也尝试获取数据
          refetch()
          fetchPurchases()
        }
      } finally {
        if (isMounted) {
          setSyncing(false)
        }
      }
    }

    syncUserAndFetchData()
    
    // 清理函数
    return () => {
      isMounted = false
    }
  }, [isLoaded, user]) // 移除refetch依赖

  if (!isLoaded || syncing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">
          {syncing ? '正在同步用户信息...' : 'Loading...'}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">请先登录</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">个人中心</h1>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>

        {/* 错误提示 */}
        {syncError && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-200">⚠️ {syncError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 用户信息卡片 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">👤</span>
              基本信息
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300">显示名称</label>
                <p className="text-white font-medium">
                  {user.fullName || user.firstName || '未设置'}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-300">邮箱地址</label>
                <p className="text-white font-medium">
                  {user.primaryEmailAddress?.emailAddress || '未设置'}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-300">注册时间</label>
                <p className="text-white font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
                </p>
              </div>
            </div>
          </div>

          {/* 积分信息卡片 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">💎</span>
              积分信息
              <button 
                onClick={refetch}
                disabled={loading}
                className="ml-auto text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 px-3 py-1 rounded-lg transition-colors"
              >
                {loading ? '刷新中...' : '刷新'}
              </button>
            </h2>

            {error ? (
              <div className="text-red-400 text-sm mb-4">
                {error}
                <button 
                  onClick={refetch}
                  className="ml-2 text-blue-400 hover:text-blue-300 underline"
                >
                  重试
                </button>
              </div>
            ) : credits ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">
                      {credits.remainingCredits}
                    </p>
                    <p className="text-sm text-gray-300">剩余积分</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">
                      {credits.totalCredits}
                    </p>
                    <p className="text-sm text-gray-300">总积分</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-purple-400">
                      {credits.usedCredits}
                    </p>
                    <p className="text-sm text-gray-300">已使用</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-2xl font-bold text-orange-400">
                      {credits.videosCount}
                    </p>
                    <p className="text-sm text-gray-300">视频数量</p>
                  </div>
                </div>

                <div className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                  <p>💡 每生成一个视频消耗 {CREDITS_CONFIG.VIDEO_COST} 积分</p>
                  <p>💡 可以生成约 {CREDITS_CONFIG.getVideoCount(credits.remainingCredits)} 个视频</p>
                </div>
              </div>
            ) : loading ? (
              <div className="text-gray-300">加载积分信息中...</div>
            ) : (
              <div className="text-gray-300">
                <p>积分信息暂未加载</p>
                <button 
                  onClick={refetch}
                  className="mt-2 text-blue-400 hover:text-blue-300 underline"
                >
                  点击加载
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 购买历史 */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">🛒</span>
            购买历史
            <button 
              onClick={fetchPurchases}
              disabled={purchasesLoading}
              className="ml-auto text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 px-3 py-1 rounded-lg transition-colors"
            >
              {purchasesLoading ? '加载中...' : '刷新'}
            </button>
          </h2>

          {purchasesError ? (
            <div className="text-red-400 text-sm mb-4">
              {purchasesError}
              <button 
                onClick={fetchPurchases}
                className="ml-2 text-blue-400 hover:text-blue-300 underline"
              >
                重试
              </button>
            </div>
          ) : purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-semibold text-white capitalize">
                          {purchase.packageName}
                        </span>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                          purchase.status === 'completed' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {purchase.status === 'completed' ? '已完成' : '处理中'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">支付金额</p>
                          <p className="text-white font-medium">
                            ${purchase.amount.toFixed(2)} {purchase.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">获得积分</p>
                          <p className="text-green-400 font-medium">
                            +{purchase.creditsAdded}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">订单号</p>
                          <p className="text-white font-mono text-xs">
                            {purchase.orderId || '暂无'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">购买时间</p>
                          <p className="text-white">
                            {purchase.formattedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : purchasesLoading ? (
            <div className="text-gray-300 text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2"></div>
              加载购买历史中...
            </div>
          ) : (
            <div className="text-gray-300 text-center py-8">
              <p>暂无购买记录</p>
              <p className="text-sm text-gray-400 mt-2">
                去 <a href="/pricing" className="text-blue-400 hover:text-blue-300 underline">购买积分包</a> 开始您的创作之旅
              </p>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/pricing"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            购买积分包
          </a>
          
          <a
            href="/"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
} 