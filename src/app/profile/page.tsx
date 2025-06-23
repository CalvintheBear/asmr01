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

interface Video {
  id: string
  taskId: string | null
  title: string
  type: string
  prompt: string
  status: string
  videoUrl: string | null
  videoUrl1080p: string | null
  thumbnailUrl: string | null
  creditsUsed: number
  createdAt: string
  completedAt: string | null
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { credits, loading, error, refetch } = useCredits(false) // 不自动获取
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [purchasesLoading, setPurchasesLoading] = useState(false)
  const [purchasesError, setPurchasesError] = useState<string | null>(null)
  
  // 历史视频相关状态
  const [videos, setVideos] = useState<Video[]>([])
  const [videosLoading, setVideosLoading] = useState(false)
  const [videosError, setVideosError] = useState<string | null>(null)

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

  // 获取历史视频
  const fetchVideos = async () => {
    try {
      setVideosLoading(true)
      setVideosError(null)
      
      const response = await fetch('/api/user/videos')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setVideos(result.data.videos)
        } else {
          setVideosError(result.error)
        }
      } else {
        setVideosError('获取视频历史失败')
      }
    } catch (error) {
      console.error('获取视频历史失败:', error)
      setVideosError('网络错误')
    } finally {
      setVideosLoading(false)
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
              fetchVideos()
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
          console.log('📊 正在获取最新积分、购买记录和视频历史...')
          refetch()
          fetchPurchases()
          fetchVideos()
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : '用户同步失败'
          setSyncError(errorMessage)
          console.error('用户同步失败:', err)
          
          // 即使同步失败也尝试获取数据
          refetch()
          fetchPurchases()
          fetchVideos()
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

        {/* 历史生成视频 */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">🎬</span>
            历史生成视频
            <button 
              onClick={fetchVideos}
              disabled={videosLoading}
              className="ml-auto text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 px-3 py-1 rounded-lg transition-colors"
            >
              {videosLoading ? '加载中...' : '刷新'}
            </button>
          </h2>

          {videosError ? (
            <div className="text-red-400 text-sm mb-4">
              {videosError}
              <button 
                onClick={fetchVideos}
                className="ml-2 text-blue-400 hover:text-blue-300 underline"
              >
                重试
              </button>
            </div>
          ) : videos.length > 0 ? (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-semibold text-white">
                          {video.title}
                        </span>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                          video.status === 'completed' 
                            ? 'bg-green-500/20 text-green-300' 
                            : video.status === 'failed'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {video.status === 'completed' ? '已完成' : 
                           video.status === 'failed' ? '失败' : '处理中'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-gray-400 text-sm mb-1">提示词:</p>
                        <p className="text-white text-sm bg-white/5 p-2 rounded">
                          {video.prompt.length > 100 ? 
                            `${video.prompt.substring(0, 100)}...` : 
                            video.prompt
                          }
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">TaskID</p>
                          <p className="text-white font-mono text-xs">
                            {video.taskId || '暂无'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">消耗积分</p>
                          <p className="text-orange-400 font-medium">
                            -{video.creditsUsed}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">创建时间</p>
                          <p className="text-white">
                            {new Date(video.createdAt).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">视频状态</p>
                          <div className="flex flex-col gap-1">
                            {video.videoUrl && (
                              <a 
                                href={video.videoUrl1080p || video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs underline"
                              >
                                📥 下载视频 {video.videoUrl1080p ? '(1080p)' : '(720p)'}
                              </a>
                            )}
                            {video.taskId && (
                              <p className="text-gray-500 text-xs">
                                🔗 TaskID: {video.taskId.substring(0, 8)}...
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : videosLoading ? (
            <div className="text-gray-300 text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2"></div>
              加载视频历史中...
            </div>
          ) : (
            <div className="text-gray-300 text-center py-8">
              <p>暂无生成记录</p>
              <p className="text-sm text-gray-400 mt-2">
                去 <a href="/" className="text-blue-400 hover:text-blue-300 underline">首页</a> 开始生成您的第一个AI ASMR视频
              </p>
            </div>
          )}
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

        {/* 账户管理 - Creem Compliance */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">💳</span>
            账户管理
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 管理支付和订阅 */}
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/creem-portal')
                  const data = await response.json()
                  
                  if (data.success && data.portalUrl) {
                    // 在新标签页中打开Creem Customer Portal
                    window.open(data.portalUrl, '_blank', 'noopener,noreferrer')
                  } else {
                    // 备用方案：直接打开Creem客户门户
                    window.open('https://www.creem.io/customer-portal', '_blank', 'noopener,noreferrer')
                  }
                } catch (error) {
                  console.error('打开客户门户失败:', error)
                  // 备用方案：直接打开Creem客户门户
                  window.open('https://www.creem.io/customer-portal', '_blank', 'noopener,noreferrer')
                }
              }}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">💳 管理支付方式</div>
              <div className="text-sm text-gray-400 mt-1">
                更新支付方式、查看账单历史
              </div>
            </button>

            {/* 客服支持 */}
            <a
              href="mailto:supportadmin@cuttingasmr.org"
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/50 px-4 py-3 rounded-lg transition-colors text-left block"
            >
              <div className="font-medium">📧 联系客服</div>
              <div className="text-sm text-gray-400 mt-1">
                需要帮助？我们3个工作日内回复
              </div>
            </a>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              <strong>💡 支付管理说明：</strong> 点击"管理支付方式"将打开Creem客户门户，您可以在那里安全地管理您的支付方式、查看详细账单历史，以及处理任何支付相关事务。
            </p>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">🔒</span>
            数据管理
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 导出数据 */}
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/user/export-data')
                  if (response.ok) {
                    const data = await response.json()
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `cuttingasmr-data-${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  } else {
                    alert('导出失败，请稍后重试')
                  }
                } catch (error) {
                  console.error('导出数据失败:', error)
                  alert('导出失败，请稍后重试')
                }
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">📥 导出我的数据</div>
              <div className="text-sm text-gray-400 mt-1">
                下载包含您所有数据的JSON文件
              </div>
            </button>

            {/* 清除视频历史 */}
            <button
              onClick={async () => {
                if (confirm('确定要清除所有视频生成历史吗？此操作不可恢复。')) {
                  try {
                    const response = await fetch('/api/user/clear-videos', { method: 'DELETE' })
                    if (response.ok) {
                      setVideos([])
                      alert('视频历史已清除')
                    } else {
                      alert('清除失败，请稍后重试')
                    }
                  } catch (error) {
                    console.error('清除视频历史失败:', error)
                    alert('清除失败，请稍后重试')
                  }
                }
              }}
              className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">🗑️ 清除视频历史</div>
              <div className="text-sm text-gray-400 mt-1">
                删除所有视频生成记录
              </div>
            </button>
            
            {/* 清除偏好设置 */}
            <button
              onClick={async () => {
                if (confirm('确定要重置所有偏好设置吗？这将清除您的ASMR类型偏好。')) {
                  try {
                    const response = await fetch('/api/user/clear-preferences', { method: 'DELETE' })
                    if (response.ok) {
                      alert('偏好设置已重置')
                    } else {
                      alert('重置失败，请稍后重试')
                    }
                  } catch (error) {
                    console.error('重置偏好失败:', error)
                    alert('重置失败，请稍后重试')
                  }
                }
              }}
              className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/50 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">🔄 重置偏好设置</div>
              <div className="text-sm text-gray-400 mt-1">
                清除ASMR类型偏好和设置
              </div>
            </button>

            {/* 删除账户 */}
            <button
              onClick={async () => {
                const confirmation = prompt('删除账户是不可恢复的操作。请输入 "DELETE" 确认删除：')
                if (confirmation === 'DELETE') {
                  try {
                    const response = await fetch('/api/user/delete-account', { method: 'DELETE' })
                    if (response.ok) {
                      alert('账户删除请求已提交。我们将在24小时内处理您的请求。')
                      window.location.href = '/'
                    } else {
                      alert('删除请求失败，请联系客服')
                    }
                  } catch (error) {
                    console.error('删除账户失败:', error)
                    alert('删除请求失败，请联系客服')
                  }
                }
              }}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">⚠️ 删除账户</div>
              <div className="text-sm text-gray-400 mt-1">
                永久删除账户和所有数据
              </div>
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 <strong>数据保护</strong>: 根据我们的隐私政策，您有权访问、更正、删除或导出您的个人数据。
              如需帮助，请联系 <a href="mailto:supportadmin@cuttingasmr.org" className="underline">supportadmin@cuttingasmr.org</a>
            </p>
          </div>
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