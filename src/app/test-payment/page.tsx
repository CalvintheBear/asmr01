'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function TestPaymentPage() {
  const { user } = useUser()
  const [webhookResult, setWebhookResult] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [envInfo, setEnvInfo] = useState<any>(null)
  const [creditsInfo, setCreditsInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 组件加载时获取环境信息
  useEffect(() => {
    fetchEnvInfo()
  }, [])

  const testWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-creem')
      const result = await response.json()
      setWebhookResult(result)
    } catch (error) {
      console.error('测试webhook失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/sync')
      const result = await response.json()
      setUserInfo(result)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEnvInfo = async () => {
    try {
      const response = await fetch('/api/check-env')
      const result = await response.json()
      setEnvInfo(result)
    } catch (error) {
      console.error('获取环境信息失败:', error)
    }
  }

  const fetchCreditsInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/credits-check')
      const result = await response.json()
      setCreditsInfo(result)
    } catch (error) {
      console.error('获取积分信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const testStandardWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-standard-creem')
      const result = await response.json()
      setWebhookResult(result)
    } catch (error) {
      console.error('测试Standard Webhook失败:', error)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🔧 支付系统诊断中心</h1>
      
      <div className="space-y-6">
        {/* 环境配置信息 */}
        {envInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🌍 环境配置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div><strong>环境:</strong> <span className={`px-2 py-1 rounded ${envInfo.NODE_ENV === 'development' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{envInfo.NODE_ENV}</span></div>
                <div><strong>应用URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{envInfo.NEXT_PUBLIC_APP_URL}</code></div>
                <div><strong>测试模式:</strong> <span className={`px-2 py-1 rounded ${envInfo.isTestMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{envInfo.isTestMode ? '是' : '否'}</span></div>
                <div><strong>Webhook URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">{envInfo.webhook_url}</code></div>
              </div>
              <div className="space-y-2">
                <div><strong>Creem API Key:</strong> <span className={`px-2 py-1 rounded ${envInfo.CREEM_API_KEY === 'NOT_FOUND' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{envInfo.CREEM_API_KEY}</span></div>
                <div><strong>Webhook Secret:</strong> <span className={`px-2 py-1 rounded ${envInfo.CREEM_WEBHOOK_SECRET === 'NOT_FOUND' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{envInfo.CREEM_WEBHOOK_SECRET}</span></div>
                <div><strong>数据库:</strong> <span className={`px-2 py-1 rounded ${envInfo.HAS_DATABASE_URL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{envInfo.HAS_DATABASE_URL ? '已连接' : '未连接'}</span></div>
                <div><strong>Clerk:</strong> <span className={`px-2 py-1 rounded ${envInfo.HAS_CLERK_SECRET ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{envInfo.HAS_CLERK_SECRET ? '已配置' : '未配置'}</span></div>
              </div>
            </div>

            {/* 当前产品ID映射 */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">📦 当前产品ID映射</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium">Starter ($9.9)</div>
                  <div className="text-xs text-gray-600 mb-1">{envInfo.currentProductIds.starter}</div>
                  <a href={envInfo.starterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">测试支付链接</a>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-medium">Standard ($30)</div>
                  <div className="text-xs text-gray-600 mb-1">{envInfo.currentProductIds.standard}</div>
                  <a href={envInfo.standardUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-xs">测试支付链接</a>
                </div>
                <div className="bg-amber-50 p-3 rounded">
                  <div className="font-medium">Premium ($99)</div>
                  <div className="text-xs text-gray-600 mb-1">{envInfo.currentProductIds.premium}</div>
                  <a href={envInfo.premiumUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline text-xs">测试支付链接</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 用户信息 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">👤 当前用户</h2>
          <p><strong>邮箱:</strong> {user?.emailAddresses[0]?.emailAddress || '未登录'}</p>
          <p><strong>姓名:</strong> {user?.fullName || '未设置'}</p>
          <p><strong>用户ID:</strong> {user?.id || '未登录'}</p>
        </div>

        {/* 测试按钮 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🧪 测试功能</h2>
          <div className="space-x-4 space-y-2">
            <button
              onClick={testWebhook}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? '处理中...' : '测试Premium Webhook (添加1450积分)'}
            </button>

            <button
              onClick={testStandardWebhook}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? '处理中...' : '测试Standard Webhook (添加355积分)'}
            </button>
            
            <button
              onClick={fetchUserInfo}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? '加载中...' : '获取用户信息'}
            </button>

            <button
              onClick={fetchEnvInfo}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
            >
              刷新环境信息
            </button>

            <button
              onClick={fetchCreditsInfo}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? '检查中...' : '快速检查积分'}
            </button>


          </div>
        </div>

        {/* Webhook结果 */}
        {webhookResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📡 Webhook测试结果</h2>
            <div className={`p-4 rounded mb-4 ${webhookResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="font-medium">{webhookResult.success ? '✅ 成功' : '❌ 失败'}</div>
              <div className="text-sm">{webhookResult.message}</div>
              {webhookResult.webhookResponse && (
                <div className="mt-2">
                  <div className="text-sm">状态码: {webhookResult.webhookResponse.status}</div>
                </div>
              )}
            </div>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(webhookResult, null, 2)}
            </pre>
          </div>
        )}

        {/* 快速积分检查结果 */}
        {creditsInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">⚡ 快速积分检查</h2>
            
            {creditsInfo.success ? (
              <div className="space-y-4">
                {/* 当前状态 */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-center">💎 当前积分状态</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-purple-600">
                        {creditsInfo.remainingCredits}
                      </div>
                      <div className="text-sm text-gray-600">剩余积分</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">
                        {creditsInfo.totalCredits}
                      </div>
                      <div className="text-sm text-gray-600">总积分</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {creditsInfo.videosCreated || 0}
                      </div>
                      <div className="text-sm text-gray-600">创建视频</div>
                    </div>
                  </div>
                </div>

                {/* 详细信息 */}
                <div className="text-sm text-gray-600">
                  <p><strong>用户ID:</strong> {creditsInfo.userId}</p>
                  <p><strong>邮箱:</strong> {creditsInfo.email}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-800 font-medium">❌ 获取失败</div>
                <div className="text-red-600 text-sm">{creditsInfo.error || creditsInfo.message}</div>
              </div>
            )}
          </div>
        )}

        {/* 用户信息结果 */}
        {userInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">💎 用户信息</h2>
            
            {/* 积分信息卡片 */}
            {userInfo.user && (
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2">💎 积分信息</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {userInfo.user.remainingCredits || (userInfo.user.totalCredits - userInfo.user.usedCredits)}
                    </div>
                    <div className="text-sm text-gray-600">剩余积分</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {userInfo.user.totalCredits}
                    </div>
                    <div className="text-sm text-gray-600">总积分</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {userInfo.user.usedCredits}
                    </div>
                    <div className="text-sm text-gray-600">已使用</div>
                  </div>
                </div>
              </div>
            )}
            
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700 hover:text-gray-900">点击查看完整数据</summary>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto mt-2">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* 问题诊断指南 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">🚨 常见问题诊断</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-yellow-800">积分没有增加？</strong>
              <ul className="list-disc pl-5 mt-1 text-yellow-700">
                <li>检查Creem后台是否正确配置了Webhook URL</li>
                <li>确认支付使用的产品ID与当前环境匹配</li>
                <li>查看浏览器控制台是否有webhook请求日志</li>
                <li>检查用户邮箱是否与支付时使用的邮箱一致</li>
              </ul>
            </div>
            <div>
              <strong className="text-yellow-800">环境不匹配？</strong>
              <ul className="list-disc pl-5 mt-1 text-yellow-700">
                <li>生产环境支付需要使用生产环境的产品ID</li>
                <li>本地测试需要Webhook URL指向正确的域名</li>
                <li>确认NEXT_PUBLIC_APP_URL设置正确</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 