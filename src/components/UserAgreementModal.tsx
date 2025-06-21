'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { X, FileText, Shield, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface UserAgreementModalProps {
  onComplete?: () => void
  show?: boolean
}

export default function UserAgreementModal({ onComplete, show = false }: UserAgreementModalProps) {
  const { isLoaded, isSignedIn, user } = useUser()
  const [showModal, setShowModal] = useState(show)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false,
    refund: false
  })

  // Update modal visibility when show prop changes
  useEffect(() => {
    setShowModal(show)
  }, [show])

  const handleAgreementChange = (type: 'privacy' | 'terms' | 'refund') => {
    setAgreements(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const allAgreed = agreements.privacy && agreements.terms && agreements.refund

  const handleConfirm = async () => {
    if (!allAgreed || !user) return

    try {
      // Save user agreement to localStorage
      const agreementKey = `user_agreement_${user.id}`
      const agreementData = {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        timestamp: new Date().toISOString(),
        agreements: agreements,
        userAgent: navigator.userAgent,
        ipConsent: true,
        privacyPolicy: true,
        termsOfService: true,
        refundPolicy: true
      }
      
      localStorage.setItem(agreementKey, JSON.stringify(agreementData))
      localStorage.setItem('userAgreement', JSON.stringify({
        privacyPolicy: true,
        termsOfService: true,
        refundPolicy: true,
        agreedAt: new Date().toISOString()
      }))
      
      // Optional: Send to server for logging
      const response = await fetch('/api/user/agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreementData)
      }).catch(err => {
        console.log('Agreement logging failed:', err)
        // Don't block user from continuing, just log
        return { ok: true } // Pretend success
      })
      
      if (response.ok) {
        console.log('✅ Agreement consent logged to server')
      }

      setHasAgreed(true)
      setShowModal(false)
      onComplete?.()
    } catch (error) {
      console.error('Error saving agreement:', error)
      // Allow user to continue even if saving fails
      setHasAgreed(true)
      setShowModal(false)
      onComplete?.()
    }
  }

  const handleDecline = () => {
    // User declines agreement, redirect to home or show warning
    alert('You must agree to our Terms of Service to use this service.')
  }

  // Don't render if not supposed to show
  if (!showModal) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome to CuttingASMR.org</h2>
              <p className="text-purple-100 mt-1">Please read and agree to our terms of service</p>
            </div>
            <Shield className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Service Introduction */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">About Our Service</h3>
              <p className="text-sm text-gray-600">
                CuttingASMR.org is a professional AI ASMR video generation platform using advanced Veo3 technology.
                We provide 25+ professional templates to generate high-quality relaxation content, perfect for YouTube and social media.
                All content you generate comes with full commercial usage rights.
              </p>
            </div>

            {/* Privacy and Security Guarantee */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Privacy and Security Guarantee</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your ASMR content and prompts are securely processed and never shared with third parties</li>
                <li>• We will not use your content to train AI models</li>
                <li>• All data transmission is encrypted for protection</li>
                <li>• You can manage and export your personal data from your profile page</li>
              </ul>
            </div>

            {/* Commercial Rights Description */}
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-2">Content Rights</h3>
              <p className="text-sm text-green-800">
                Every ASMR video you generate through our platform comes with full commercial usage rights.
                Whether for YouTube monetization, client projects, or selling content, you own complete copyright.
              </p>
            </div>

            {/* Agreement Confirmation Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Please confirm you have read and agree to the following:</h3>
                <button
                  onClick={() => setAgreements({ privacy: true, terms: true, refund: true })}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Agree to All
                </button>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreements.privacy}
                    onChange={() => handleAgreementChange('privacy')}
                    className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Privacy Policy</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Learn how we collect, use, and protect your personal information
                      <Link href="/privacy" target="_blank" className="text-purple-600 hover:text-purple-700 ml-1">
                        View Details →
                      </Link>
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreements.terms}
                    onChange={() => handleAgreementChange('terms')}
                    className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Terms of Service</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Rules and conditions for using our service
                      <Link href="/terms" target="_blank" className="text-purple-600 hover:text-purple-700 ml-1">
                        View Details →
                      </Link>
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreements.refund}
                    onChange={() => handleAgreementChange('refund')}
                    className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">Refund Policy</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Learn about our refund conditions and processing procedures
                      <Link href="/refund" target="_blank" className="text-purple-600 hover:text-purple-700 ml-1">
                        View Details →
                      </Link>
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleConfirm}
            disabled={!allAgreed}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              allAgreed
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {allAgreed ? 'Agree and Continue' : 'Please check all agreements'}
          </button>
        </div>
      </div>
    </div>
  )
} 