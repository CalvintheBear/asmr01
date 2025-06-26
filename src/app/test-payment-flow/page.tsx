'use client'

import { useState, useEffect, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import CreemPaymentButton from '@/components/CreemPaymentButton'

// 导出dynamic配置确保页面不会静态生成
export const dynamic = 'force-dynamic'

interface TestResult {
  success: boolean
  data?: any
  status?: number
  error?: string
  label: string
}

function TestContent() {
  const [mounted, setMounted] = useState(false)
  const [hasClerk, setHasClerk] = useState(false)
  
  // 在客户端挂载后再检查Clerk
  useEffect(() => {
    setMounted(true)
    // 检查是否有Clerk的publishableKey
    setHasClerk(!!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || typeof window !== 'undefined')
  }, [])

  if (!mounted) {
    return <div className="p-4">正在初始化...</div>
  }

  if (!hasClerk) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">支付流程测试页面</h1>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Clerk认证未配置，无法进行测试</p>
        </div>
      </div>
    )
  }

  return <AuthenticatedTestContent />
}

function AuthenticatedTestContent() {
  const { user, isLoaded } = useUser()
  const [testResults, setTestResults] = useState<{
    advancedApiHealth: TestResult | null
    simpleApiHealth: TestResult | null
    advancedApiTest: TestResult | null
    simpleApiTest: TestResult | null
  }>({
    advancedApiHealth: null,
    simpleApiHealth: null,
    advancedApiTest: null,
    simpleApiTest: null
  })

  const testAPI = async (endpoint: string, label: string): Promise<TestResult> => {
    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      return { 
        success: response.ok, 
        data, 
        status: response.status,
        label 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error), 
        label 
      }
    }
  }

  const runTests = async () => {
    console.log('开始运行API测试...')
    
    // 测试API健康检查
    const advancedHealth = await testAPI('/api/payments/creem-advanced', '高级API健康检查')
    const simpleHealth = await testAPI('/api/payments/creem', '简单API健康检查')
    
    // 如果用户已登录，测试实际支付创建
    let advancedTest: TestResult | null = null
    let simpleTest: TestResult | null = null
    
    if (user) {
      advancedTest = await testAPI('/api/payments/creem-advanced', '高级API支付测试')
      simpleTest = await testAPI('/api/payments/creem', '简单API支付测试')
    }

    setTestResults({
      advancedApiHealth: advancedHealth,
      simpleApiHealth: simpleHealth,
      advancedApiTest: advancedTest,
      simpleApiTest: simpleTest
    })
  }

  useEffect(() => {
    if (isLoaded) {
      runTests()
    }
  }, [isLoaded, user])

  if (!isLoaded) {
    return <div className="p-4">正在加载用户信息...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">支付流程测试页面</h1>
      
      {/* 用户状态 */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">用户状态</h2>
        {user ? (
          <div>
            <p className="text-green-600">✅ 已登录</p>
            <p>用户ID: {user.id}</p>
            <p>邮箱: {user.primaryEmailAddress?.emailAddress}</p>
          </div>
        ) : (
          <p className="text-red-600">❌ 未登录</p>
        )}
      </div>

      {/* API测试结果 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">API测试结果</h2>
        
        {Object.entries(testResults).map(([key, result]) => (
          result && (
            <div key={key} className="mb-4 p-3 border rounded">
              <h3 className="font-medium">{result.label}</h3>
              <div className={`mt-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? '✅ 成功' : '❌ 失败'} (状态: {result.status || 'N/A'})
              </div>
              {result.data && (
                <pre className="mt-2 text-sm bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
              {result.error && (
                <div className="mt-2 text-red-600 text-sm">
                  错误: {result.error}
                </div>
              )}
            </div>
          )
        ))}
      </div>

      {/* 支付测试 */}
      {user && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">支付功能测试</h2>
          <p className="mb-4">使用真实的支付按钮测试购买流程：</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Starter套餐 (115积分 - $9.9)</h3>
              <CreemPaymentButton 
                planType="starter"
                amount={9.9}
                description="Starter Plan"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                测试购买 Starter
              </CreemPaymentButton>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Standard套餐 (355积分 - $30)</h3>
              <CreemPaymentButton 
                planType="standard"
                amount={30}
                description="Standard Plan"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                测试购买 Standard
              </CreemPaymentButton>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Premium套餐 (1450积分 - $99)</h3>
              <CreemPaymentButton 
                planType="premium"
                amount={99}
                description="Premium Plan"
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                测试购买 Premium
              </CreemPaymentButton>
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-700">请先登录以测试支付功能</p>
        </div>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-20 bg-gray-200 rounded mb-6"></div>
        <div className="h-40 bg-gray-200 rounded mb-6"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export default function TestPaymentFlowPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <TestContent />
    </Suspense>
  )
} 