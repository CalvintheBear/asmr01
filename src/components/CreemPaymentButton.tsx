'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { CREEM_CONFIG, PlanType } from '@/lib/creem-config'

interface CreemPaymentButtonProps {
  planType: PlanType
  amount: number
  description: string
  className?: string
  children: React.ReactNode
}

export default function CreemPaymentButton({ 
  planType, 
  amount, 
  description, 
  className = '',
  children 
}: CreemPaymentButtonProps) {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEmailConfirm, setShowEmailConfirm] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setUserEmail(user.primaryEmailAddress.emailAddress)
    }
  }, [user])

  const handlePayment = async () => {
    if (!user) {
      alert('请先登录后再购买积分包')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 显示邮箱确认对话框
      setShowEmailConfirm(true)
    } catch (err) {
      console.error('支付错误:', err)
      setError(err instanceof Error ? err.message : '支付过程中出现错误')
    } finally {
      setIsLoading(false)
    }
  }

  const confirmAndPay = async () => {
    setShowEmailConfirm(false)
    
    if (!user) {
      alert('请先登录后再购买积分包')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 跳转到支付页面
      const paymentUrl = CREEM_CONFIG.getPaymentUrl(planType)
      
      // 记录用户邮箱到本地存储，用于后续匹配
      localStorage.setItem('payment_user_email', userEmail)
      localStorage.setItem('payment_session_id', user.id)
      
      window.open(paymentUrl, '_blank')
    } catch (err) {
      console.error('支付错误:', err)
      setError(err instanceof Error ? err.message : '支付过程中出现错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            处理中...
          </div>
        ) : (
          children
        )}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* 邮箱确认对话框 */}
      {showEmailConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">📧 确认支付邮箱</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                请确保支付时使用与网站登录相同的邮箱，以便积分能正确同步：
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="font-medium text-blue-800">
                  登录邮箱: {userEmail}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  ⚠️ 请在支付页面使用此邮箱地址
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>重要提醒：</strong>如果支付邮箱不一致，积分可能无法自动同步，需要手动处理。
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={confirmAndPay}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                我知道了，继续支付
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 