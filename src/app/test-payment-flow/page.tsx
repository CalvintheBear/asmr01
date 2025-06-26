'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import CreemPaymentButton from '@/components/CreemPaymentButton'

export default function TestPaymentFlow() {
  const { user, isLoaded } = useUser()
  const [testResults, setTestResults] = useState<any[]>([])

  const addTestResult = (test: string, result: 'pass' | 'fail', details: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      test,
      result,
      details
    }])
  }

  const testAPIEndpoints = async () => {
    const tests = [
      { name: '健康检查', url: '/api/health', method: 'GET' },
      { name: 'Creem配置检查', url: '/api/check-creem-config', method: 'GET' },
      { name: '积分查询', url: '/api/credits', method: 'GET' },
    ]

    for (const test of tests) {
      try {
        const response = await fetch(test.url, { method: test.method })
        const result = await response.json()
        
        addTestResult(test.name, response.ok ? 'pass' : 'fail', {
          status: response.status,
          data: result
        })
      } catch (error) {
        addTestResult(test.name, 'fail', {
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }
  }

  const testPaymentAPI = async (planType: 'starter' | 'standard' | 'premium') => {
    try {
      // 测试高级API
      const advancedResponse = await fetch('/api/payments/creem-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType })
      })

      if (advancedResponse.ok) {
        const result = await advancedResponse.json()
        addTestResult(`高级支付API (${planType})`, 'pass', result)
        return result
      } else {
        // 回退到简单API
        const simpleResponse = await fetch('/api/payments/creem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType })
        })

        if (simpleResponse.ok) {
          const result = await simpleResponse.json()
          addTestResult(`简单支付API (${planType})`, 'pass', result)
          return result
        } else {
          addTestResult(`支付API (${planType})`, 'fail', {
            error: 'Both APIs failed'
          })
        }
      }
    } catch (error) {
      addTestResult(`支付API (${planType})`, 'fail', {
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  if (!isLoaded) {
    return <div className="p-8">加载中...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🧪 支付流程测试</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">需要登录</h2>
            <p className="text-red-700">请先登录以测试完整的支付流程</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 支付流程端到端测试</h1>
        
        {/* 用户信息 */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">👤 当前用户信息</h2>
          <div className="space-y-2 text-sm">
            <p><strong>用户ID:</strong> {user.id}</p>
            <p><strong>邮箱:</strong> {user.primaryEmailAddress?.emailAddress}</p>
            <p><strong>登录状态:</strong> ✅ 已登录</p>
          </div>
        </div>

        {/* API测试 */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🔌 API端点测试</h2>
          <button
            onClick={testAPIEndpoints}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            测试所有API端点
          </button>
        </div>

        {/* 支付按钮测试 */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">💳 支付按钮测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Starter - $9.9</h3>
              <p className="text-sm text-gray-600 mb-4">115 积分</p>
              <CreemPaymentButton
                planType="starter"
                amount={9.9}
                description="Starter Plan"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                测试 Starter 购买
              </CreemPaymentButton>
              <button
                onClick={() => testPaymentAPI('starter')}
                className="w-full mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                仅测试API
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Standard - $30</h3>
              <p className="text-sm text-gray-600 mb-4">355 积分</p>
              <CreemPaymentButton
                planType="standard"
                amount={30}
                description="Standard Plan"
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                测试 Standard 购买
              </CreemPaymentButton>
              <button
                onClick={() => testPaymentAPI('standard')}
                className="w-full mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                仅测试API
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Premium - $99</h3>
              <p className="text-sm text-gray-600 mb-4">1450 积分</p>
              <CreemPaymentButton
                planType="premium"
                amount={99}
                description="Premium Plan"
                className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                测试 Premium 购买
              </CreemPaymentButton>
              <button
                onClick={() => testPaymentAPI('premium')}
                className="w-full mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                仅测试API
              </button>
            </div>
          </div>
        </div>

        {/* 测试结果 */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📊 测试结果</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.result === 'pass' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {result.result === 'pass' ? '✅' : '❌'} {result.test}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
            <button
              onClick={() => setTestResults([])}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              清空结果
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 