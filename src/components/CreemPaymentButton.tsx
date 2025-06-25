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
  const [showEmailConfirm, setShowEmailConfirm] = useState(false)
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setUserEmail(user.primaryEmailAddress.emailAddress)
    }
  }, [user])

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
      // Show email confirmation dialog
      setShowEmailConfirm(true)
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
      setShowEmailConfirm(true)
    }, 500)
  }

  const confirmAndPay = async () => {
    setShowEmailConfirm(false)
    
    if (!user) {
      alert('Please log in first to purchase credits')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Redirect to payment page
      const paymentUrl = CREEM_CONFIG.getPaymentUrl(planType)
      
      // Save user email to localStorage for later matching
      localStorage.setItem('payment_user_email', userEmail)
      localStorage.setItem('payment_session_id', user.id)
      
      window.open(paymentUrl, '_blank')
    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during payment')
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

      {/* Email Confirmation Dialog */}
      {showEmailConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">📧 Confirm Payment Email</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please ensure you use the same email for payment as your website login for proper credit synchronization:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="font-medium text-blue-800">
                  Login Email: {userEmail}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  ⚠️ Please use this email address on the payment page
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Important:</strong> If payment email doesn't match, credits may not sync automatically and will require contacting administrator.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndPay}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                I Understand, Continue Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 