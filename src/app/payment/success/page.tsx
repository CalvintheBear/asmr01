'use client'

// 在Cloudflare Pages中必须使用Edge Runtime（使用useUser hook）
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { CheckCircle, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading payment information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <SEOHead
        title="Payment Successful - CuttingASMR.org | AI ASMR Credits Purchased"
        description="Payment completed successfully! Your AI ASMR credits have been added to your account. Start creating amazing ASMR videos with our AI generator."
        canonical="https://cuttingasmr.org/payment/success"
        keywords="payment success, ASMR credits purchased, AI video credits"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-xl text-slate-300">
            Thank you for your purchase! Your ASMR creation journey begins now.
          </p>
        </div>

        {/* 错误和警告信息 */}
        {debugInfo.errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="font-medium text-red-800 dark:text-red-300">Issues Detected</h3>
            </div>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              {debugInfo.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 环境配置警告 */}
        {debugInfo.environmentInfo && debugInfo.environmentInfo.environment?.isTestMode && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
              <div>
                <p className="text-amber-800 dark:text-amber-300 font-medium">⚠️ Test Environment Detected</p>
                <p className="text-amber-700 dark:text-amber-300 text-sm">Currently using test environment. Payment may not be processed in real. Please check environment variables.</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {paymentInfo && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8 border border-stone-200 dark:border-slate-600">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-2" />
              Purchase Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Credit Package</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                    {paymentInfo.planType} Plan
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Payment Amount</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    ${paymentInfo.amount} USD
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Product ID</div>
                  <div className="text-sm font-mono text-gray-600 dark:text-slate-300">
                    {paymentInfo.product_id}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">User Email</div>
                  <div className="text-lg font-semibold text-gray-800 dark:text-white">
                    {user?.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Order ID</div>
                  <div className="text-sm font-mono text-gray-600 dark:text-slate-300">
                    {paymentInfo.order_id}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Customer ID</div>
                  <div className="text-sm font-mono text-gray-600 dark:text-slate-300">
                    {paymentInfo.customer_id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credits Info */}
        <div className="bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-900/30 dark:to-amber-900/30 rounded-2xl p-8 mb-8 border border-stone-200 dark:border-slate-600">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🎉 Credits Added!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-stone-200 dark:border-slate-600">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {paymentInfo?.creditsAdded || '115'}
              </div>
              <div className="text-gray-600 dark:text-slate-300">Credits Added</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-stone-200 dark:border-slate-600">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {userCredits !== null ? userCredits : '--'}
              </div>
              <div className="text-gray-600 dark:text-slate-300">Available Credits</div>
              {userCredits === null && (
                <div className="text-xs text-red-500 dark:text-red-400 mt-1">Failed to load</div>
              )}
            </div>
          </div>
          
          <div className="text-center mt-6">
            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full inline-block text-sm font-medium">
              ⚡ Credits Never Expire • Use Anytime
            </div>
          </div>
        </div>

        {/* 积分同步状态检查 */}
        {userCredits !== null && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-stone-200 dark:border-slate-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">💎 Credit Sync Status</h3>
            
            {userCredits === 8 ? (
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
                    <div>
                      <p className="text-amber-800 dark:text-amber-300 font-medium">Credits may not be synced</p>
                      <p className="text-amber-700 dark:text-amber-300 text-sm">Your credits are still at the initial amount (8). Payment may not have been processed correctly.</p>
                    </div>
                  </div>
                  <Link 
                    href={`/payment-processor?${new URLSearchParams({
                      order_id: paymentInfo?.order_id || '',
                      product_id: paymentInfo?.product_id || '',
                      customer_id: paymentInfo?.customer_id || ''
                    }).toString()}`}
                    className="px-4 py-2 bg-amber-600 dark:bg-amber-700 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 text-sm font-medium"
                  >
                    Manually Sync Credits
                  </Link>
                </div>
              </div>
            ) : userCredits > 8 ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <div>
                    <p className="text-emerald-800 dark:text-emerald-300 font-medium">✅ Credits synced successfully</p>
                    <p className="text-emerald-700 dark:text-emerald-300 text-sm">Your credits have been updated successfully. You can start creating videos now!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <div>
                    <p className="text-red-800 dark:text-red-300 font-medium">⚠️ Credit Anomaly</p>
                    <p className="text-red-700 dark:text-red-300 text-sm">Abnormal credit amount ({userCredits}). Please contact customer service.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 调试信息 (仅在开发环境或有错误时显示) */}
        {(process.env.NODE_ENV === 'development' || debugInfo.errors.length > 0) && (
          <details className="bg-stone-50 dark:bg-slate-800 rounded-lg p-4 mb-8 border border-stone-200 dark:border-slate-600">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-slate-300 mb-2">
              🔧 Debug Info (Click to expand)
            </summary>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-gray-900 dark:text-white">URL Parameters:</strong>
                <pre className="bg-white dark:bg-slate-900 p-2 rounded mt-1 overflow-x-auto border border-stone-200 dark:border-slate-600 text-gray-800 dark:text-slate-200">
                  {JSON.stringify(debugInfo.urlParams, null, 2)}
                </pre>
              </div>
              
              {debugInfo.productInfo && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Product Info:</strong>
                  <pre className="bg-white dark:bg-slate-900 p-2 rounded mt-1 overflow-x-auto border border-stone-200 dark:border-slate-600 text-gray-800 dark:text-slate-200">
                    {JSON.stringify(debugInfo.productInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              {debugInfo.environmentInfo && (
                <div>
                  <strong className="text-gray-900 dark:text-white">Environment Config:</strong>
                  <pre className="bg-white dark:bg-slate-900 p-2 rounded mt-1 overflow-x-auto border border-stone-200 dark:border-slate-600 text-gray-800 dark:text-slate-200">
                    {JSON.stringify(debugInfo.environmentInfo, null, 2)}
                  </pre>
                </div>
              )}
              
              {debugInfo.apiResponse && (
                <div>
                  <strong className="text-gray-900 dark:text-white">API Response:</strong>
                  <pre className="bg-white dark:bg-slate-900 p-2 rounded mt-1 overflow-x-auto border border-stone-200 dark:border-slate-600 text-gray-800 dark:text-slate-200">
                    {JSON.stringify(debugInfo.apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Next Steps */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8 border border-stone-200 dark:border-slate-600">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Start Creating ASMR Videos</h3>
                <p className="text-gray-600 dark:text-slate-300 text-sm">
                  Choose your favorite ASMR type, enter a prompt, and let AI generate professional ASMR videos for you
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 dark:text-amber-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Download High-Quality Videos</h3>
                <p className="text-gray-600 dark:text-slate-300 text-sm">
                  After generation is complete, you can download high-definition videos for any purpose
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
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating ASMR Videos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link 
              href="/profile"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-slate-800 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
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