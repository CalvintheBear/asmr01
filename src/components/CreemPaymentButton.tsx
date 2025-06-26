'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { CREEM_CONFIG, PlanType } from '@/lib/creem-config'
import UserAgreementModal from './UserAgreementModal'

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
  const [showAgreementModal, setShowAgreementModal] = useState(false)

  // Check if user has agreed to all terms
  const checkUserAgreement = () => {
    // First check localStorage
    const localAgreement = localStorage.getItem('userAgreement')
    if (localAgreement) {
      try {
        const agreement = JSON.parse(localAgreement)
        return agreement.privacyPolicy && agreement.termsOfService && agreement.refundPolicy
      } catch {
        return false
      }
    }

    // If no local agreement, check database via API
    if (user?.primaryEmailAddress?.emailAddress) {
      checkDatabaseAgreement(user.primaryEmailAddress.emailAddress)
    }
    
    return false
  }

  const checkDatabaseAgreement = async (email: string) => {
    try {
      const response = await fetch('/api/user/agreement', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.agreement && data.agreement.privacyPolicy && data.agreement.termsOfService && data.agreement.refundPolicy) {
          // Save to localStorage for future checks
          localStorage.setItem('userAgreement', JSON.stringify({
            privacyPolicy: true,
            termsOfService: true,
            refundPolicy: true,
            agreedAt: data.agreement.agreedAt
          }))
        }
      }
    } catch (error) {
      console.log('Error checking database agreement:', error)
    }
  }

  const handlePayment = async () => {
    if (!user) {
      alert('Please log in first to purchase credits')
      return
    }

    // Check if user has agreed to all terms
    if (!checkUserAgreement()) {
      setShowAgreementModal(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 🔥 NEW: 先尝试高级API（支持数据库），失败则回退到简单API
      let response = await fetch('/api/payments/creem-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType })
      })

      // 如果高级API失败，回退到简单API
      if (!response.ok) {
        console.log('高级API失败，回退到简单API...')
        response = await fetch('/api/payments/creem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planType })
        })
        
        if (!response.ok) {
          throw new Error('All payment APIs failed')
        }
      }

      const result = await response.json()
      
      console.log('✅ 支付订单创建成功:', result)
      
      // 直接跳转到支付页面
      window.open(result.checkout_url, '_blank')
    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during payment')
    } finally {
      setIsLoading(false)
    }
  }

  const onAgreementComplete = () => {
    setShowAgreementModal(false)
    // After agreement, proceed with payment
    setTimeout(() => {
      handlePayment()
    }, 500)
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
            Processing...
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

      {/* User Agreement Modal */}
      <UserAgreementModal 
        show={showAgreementModal} 
        onComplete={onAgreementComplete} 
      />


    </>
  )
} 