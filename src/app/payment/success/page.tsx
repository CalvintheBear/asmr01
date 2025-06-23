'use client'

import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { CheckCircle, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { CREEM_CONFIG } from '@/lib/creem-config'

interface PaymentInfo {
  product_id: string
  order_id: string
  customer_id: string
  planType: string
  amount: number
  creditsAdded: number
}

interface DebugInfo {
  urlParams: Record<string, string>
  productInfo: any
  environmentInfo: any
  apiResponse: any
  errors: string[]
}

function PaymentSuccessContent() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    urlParams: {},
    productInfo: null,
    environmentInfo: null,
    apiResponse: null,
    errors: []
  })

  useEffect(() => {
    const errors: string[] = []
    
    // 从URL参数获取支付信息 - 检查多种可能的参数名
    const productId = searchParams.get('product_id') || searchParams.get('product')
    const orderId = searchParams.get('order_id') || searchParams.get('checkout_id') || searchParams.get('order')
    const customerId = searchParams.get('customer_id') || searchParams.get('customer')
    
    const urlParams = Object.fromEntries(searchParams.entries())
    
    console.log('🔍 支付成功页面参数:', {
      allParams: urlParams,
      productId,
      orderId,
      customerId
    })

    // 更新调试信息
    setDebugInfo(prev => ({
      ...prev,
      urlParams,
      errors
    }))

    if (productId) {
      // 从Creem配置获取产品信息
      const productInfo = CREEM_CONFIG.getProductInfo(productId)
      
      if (productInfo) {
        console.log('✅ 产品信息匹配成功:', productInfo)
        setPaymentInfo({
          product_id: productId,
          order_id: orderId || '',
          customer_id: customerId || '',
          planType: productInfo.planType,
          amount: productInfo.amount,
          creditsAdded: productInfo.creditsToAdd
        })
        
        setDebugInfo(prev => ({
          ...prev,
          productInfo
        }))
      } else {
        const error = `❌ 无法找到产品信息: ${productId}`
        console.error(error)
        errors.push(error)
        
        // 检查是否是测试环境产品ID在生产环境使用
        const isTestProductId = productId.startsWith('prod_3') || productId.startsWith('prod_67') || productId.startsWith('prod_5')
        if (isTestProductId) {
          errors.push('⚠️ 检测到测试环境产品ID，可能是环境配置问题')
        }
      }
    } else {
      const error = '⚠️ 未找到产品ID参数'
      console.log(error)
      errors.push(error)
      
      // 如果没有产品ID，显示默认信息
      setPaymentInfo({
        product_id: '',
        order_id: orderId || '',
        customer_id: customerId || '',
        planType: 'premium',
        amount: 99,
        creditsAdded: 1450
      })
    }

    // 获取用户最新的积分信息
    if (user) {
      fetchUserCredits()
    } else {
      errors.push('❌ 用户未登录')
      setLoading(false)
    }
    
    // 更新错误信息
    setDebugInfo(prev => ({
      ...prev,
      errors
    }))
  }, [searchParams, user])

  const fetchUserCredits = async () => {
    try {
      console.log('📡 开始获取用户积分信息...')
      
      const response = await fetch('/api/credits')
      const result = await response.json()
      
      console.log('📊 积分API响应:', {
        status: response.status,
        ok: response.ok,
        result
      })
      
      // 更新调试信息
      setDebugInfo(prev => ({
        ...prev,
        apiResponse: {
          status: response.status,
          ok: response.ok,
          result
        }
      }))
      
      if (response.ok) {
        if (result.success && result.data) {
          const credits = result.data.remainingCredits
          setUserCredits(credits)
          console.log('✅ 积分信息已获取:', { 
            totalCredits: result.data.totalCredits,
            usedCredits: result.data.usedCredits,
            remainingCredits: result.data.remainingCredits,
            videosCount: result.data.videosCount
          })
        } else {
          const error = `❌ API响应格式错误: ${result.error || result.message || '未知错误'}`
          console.error(error)
          setDebugInfo(prev => ({
            ...prev,
            errors: [...prev.errors, error]
          }))
        }
      } else {
        const error = `❌ 获取积分信息失败: ${response.status} ${response.statusText}`
        console.error(error)
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, error]
        }))
      }
    } catch (error) {
      const errorMsg = `❌ 获取用户积分失败: ${error instanceof Error ? error.message : '网络错误'}`
      console.error(errorMsg, error)
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, errorMsg]
      }))
    } finally {
      setLoading(false)
    }
  }

  // 获取环境配置信息
  useEffect(() => {
    const fetchEnvironmentInfo = async () => {
      try {
        const response = await fetch('/api/check-creem-config')
        const envInfo = await response.json()
        console.log('🔧 环境配置信息:', envInfo)
        
        setDebugInfo(prev => ({
          ...prev,
          environmentInfo: envInfo
        }))
      } catch (error) {
        console.error('获取环境信息失败:', error)
      }
    }
    
    fetchEnvironmentInfo()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">正在加载支付信息...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600">
            感谢您的购买！您的ASMR创作之旅现在开始了。
          </p>
        </div>

        {/* 错误和警告信息 */}
        {debugInfo.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-medium text-red-800">检测到问题</h3>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {debugInfo.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 环境配置警告 */}
        {debugInfo.environmentInfo && debugInfo.environmentInfo.environment?.isTestMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-yellow-800 font-medium">⚠️ 检测到测试环境配置</p>
                <p className="text-yellow-700 text-sm">当前使用测试环境，支付可能不会真实处理。请检查环境变量配置。</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {paymentInfo && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
              Purchase Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">积分包类型</div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">
                    {paymentInfo.planType} Plan
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">支付金额</div>
                  <div className="text-lg font-semibold text-gray-900">
                    ${paymentInfo.amount} USD
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">产品ID</div>
                  <div className="text-sm font-mono text-gray-600">
                    {paymentInfo.product_id}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">用户邮箱</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {user?.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">订单ID</div>
                  <div className="text-sm font-mono text-gray-600">
                    {paymentInfo.order_id}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">客户ID</div>
                  <div className="text-sm font-mono text-gray-600">
                    {paymentInfo.customer_id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credits Info */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Credits Added!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {paymentInfo?.creditsAdded || '115'}
              </div>
              <div className="text-gray-600">Credits Added</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {userCredits !== null ? userCredits : '--'}
              </div>
              <div className="text-gray-600">Available Credits</div>
              {userCredits === null && (
                <div className="text-xs text-red-500 mt-1">获取失败</div>
              )}
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">1080p</div>
              <div className="text-gray-600">HD Quality</div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full inline-block text-sm font-medium">
                              ⚡ Credits Never Expire • Use Anytime
            </div>
          </div>
        </div>

        {/* 积分同步状态检查 */}
        {userCredits !== null && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💎 积分同步状态</h3>
            
            {userCredits === 8 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-yellow-800 font-medium">积分可能未同步</p>
                      <p className="text-yellow-700 text-sm">检测到您的积分仍为初始积分(8)，支付可能未正确处理</p>
                    </div>
                  </div>
                  <Link 
                    href={`/payment-processor?${new URLSearchParams({
                      order_id: paymentInfo?.order_id || '',
                      product_id: paymentInfo?.product_id || '',
                      customer_id: paymentInfo?.customer_id || ''
                    }).toString()}`}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
                  >
                    手动同步积分
                  </Link>
                </div>
              </div>
            ) : userCredits > 8 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-800 font-medium">✅ 积分同步成功</p>
                    <p className="text-green-700 text-sm">您的积分已成功更新，可以开始创作视频了！</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-red-800 font-medium">⚠️ 积分异常</p>
                    <p className="text-red-700 text-sm">积分数量异常({userCredits})，请联系客服处理</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 调试信息 (仅在开发环境或有错误时显示) */}
        {(process.env.NODE_ENV === 'development' || debugInfo.errors.length > 0) && (
          <details className="bg-gray-50 rounded-lg p-4 mb-8">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              🔧 调试信息 (点击展开)
            </summary>
            <div className="space-y-3 text-sm">
              <div>
                <strong>URL参数:</strong>
                <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(debugInfo.urlParams, null, 2)}
                </pre>
              </div>
              
              {debugInfo.productInfo && (
                <div>
                  <strong>产品信息:</strong>
                  <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(debugInfo.productInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              {debugInfo.environmentInfo && (
                <div>
                  <strong>环境配置:</strong>
                  <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(debugInfo.environmentInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              {debugInfo.apiResponse && (
                <div>
                  <strong>API响应:</strong>
                  <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(debugInfo.apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">开始创作ASMR视频</h3>
                <p className="text-gray-600 text-sm">
                  选择您喜欢的ASMR类型，输入提示词，让AI为您生成专业的ASMR视频
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">下载高质量视频</h3>
                <p className="text-gray-600 text-sm">
                  生成完成后，您可以下载1080p高清视频用于任何用途
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              开始创作ASMR视频
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link 
              href="/profile"
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300"
            >
              查看个人中心
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading payment information...</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  )
} 