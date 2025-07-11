'use client'

// 在Cloudflare Pages中必须使用Edge Runtime
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle, CreditCard, RefreshCw, Zap } from 'lucide-react'
import { CREEM_CONFIG } from '@/lib/creem-config'

function PaymentProcessorContent() {
  const { user, isLoaded } = useUser()
  
  // 在加载完成前显示加载状态，避免预渲染错误
  if (!isLoaded) {
    return <LoadingFallback />
  }
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)

  useEffect(() => {
    // 从URL参数获取支付信息
    const orderId = searchParams.get('order_id')
    const productId = searchParams.get('product_id')
    const customerId = searchParams.get('customer_id')
    
    if (orderId && productId) {
      const productInfo = CREEM_CONFIG.getProductInfo(productId)
      setPaymentInfo({
        orderId,
        productId,
        customerId,
        productInfo
      })
    }
  }, [searchParams])

  const handleProcessPayment = async () => {
    if (!paymentInfo) {
      setError('缺少支付信息')
      return
    }

    try {
      setProcessing(true)
      setError(null)
      setResult(null)

      const response = await fetch('/api/simulate-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: paymentInfo.orderId,
          productId: paymentInfo.productId,
          customerEmail: user?.primaryEmailAddress?.emailAddress,
          amount: paymentInfo.productInfo?.amount
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || '处理失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('处理支付失败:', err)
    } finally {
      setProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600">需要登录才能处理支付</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚡ 支付处理中心</h1>
          <p className="text-gray-600">
            由于本地开发环境限制，Webhook可能无法自动处理。您可以在这里手动完成积分同步。
          </p>
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-800 mb-3">💡 为什么需要手动处理？</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• 本地开发环境 (localhost) 无法接收外部 Webhook 调用</li>
            <li>• Creem 的服务器无法访问您的本地服务器</li>
            <li>• 生产环境部署后，Webhook 将自动工作</li>
            <li>• 此页面仅用于开发测试阶段</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">正在加载...</p>
      </div>
    </div>
  )
}

export default function PaymentProcessorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentProcessorContent />
    </Suspense>
  )
} 