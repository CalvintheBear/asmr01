'use client'

import { useEffect, useState, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Sparkles, ArrowRight, Home, Loader2, AlertCircle } from 'lucide-react'
import { CREEM_CONFIG } from '@/lib/creem-config'

interface PaymentInfo {
  product_id: string
  order_id: string
  customer_id: string
  planType: string
  amount: number
  creditsAdded: number
}

function PaymentSuccessContent() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从URL参数获取支付信息 - 检查多种可能的参数名
    const productId = searchParams.get('product_id') || searchParams.get('product')
    const orderId = searchParams.get('order_id') || searchParams.get('checkout_id') || searchParams.get('order')
    const customerId = searchParams.get('customer_id') || searchParams.get('customer')
    
    console.log('🔍 支付成功页面参数:', {
      allParams: Object.fromEntries(searchParams.entries()),
      productId,
      orderId,
      customerId
    })

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
      } else {
        console.error('❌ 无法找到产品信息:', productId)
      }
    } else {
      console.log('⚠️ 未找到产品ID参数')
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
    }
  }, [searchParams, user])

  const fetchUserCredits = async () => {
    try {
      const response = await fetch('/api/credits')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const credits = result.data.remainingCredits // 修复：使用剩余积分而不是总积分
          setUserCredits(credits)
          console.log('✅ 积分信息已获取:', { 
            totalCredits: result.data.totalCredits,
            usedCredits: result.data.usedCredits,
            remainingCredits: result.data.remainingCredits,
            videosCount: result.data.videosCount
          })
        } else {
          console.error('获取积分信息失败:', result.message)
        }
      } else {
        console.error('获取积分信息失败:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('获取用户积分失败:', error)
    } finally {
      setLoading(false)
    }
  }

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
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">1080p</div>
              <div className="text-gray-600">HD Quality</div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full inline-block text-sm font-medium">
              ⚡ Credits永不过期 • 随时使用
            </div>
          </div>
        </div>

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
          {/* 如果积分显示为8（初始积分），说明webhook可能未执行，显示手动处理选项 */}
          {userCredits === 8 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-yellow-800 font-medium">积分可能未同步</p>
                    <p className="text-yellow-700 text-sm">检测到您的积分仍为初始积分，可能需要手动处理</p>
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
          )}

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
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              <Home className="w-5 h-5 mr-2" />
              查看我的信息
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            有问题？联系我们：<a href="mailto:support@cuttingasmr.org" className="text-purple-600 hover:text-purple-700">support@cuttingasmr.org</a>
          </p>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 bg-gray-100 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">🛠️ 开发信息</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>环境</strong>: 本地开发</p>
              <p><strong>用户</strong>: {user?.emailAddresses[0]?.emailAddress}</p>
              <p><strong>支付状态</strong>: 测试模式</p>
              <p><strong>当前积分</strong>: {userCredits}</p>
              {paymentInfo && (
                <div className="mt-2">
                  <p><strong>支付信息</strong>:</p>
                  <pre className="bg-gray-200 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(paymentInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
        <p className="text-gray-600">正在加载支付信息...</p>
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