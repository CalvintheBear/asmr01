'use client'

import { useState } from 'react'
import { X, Send, MessageCircle, Star, Bug, Lightbulb, Heart } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useUser()
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'rating'>('general')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: feedbackType,
          message,
          rating: feedbackType === 'rating' ? rating : undefined,
          email,
          userInfo: {
            userId: user?.id,
            userName: user?.fullName || user?.primaryEmailAddress?.emailAddress,
            timestamp: new Date().toISOString(),
          }
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          onClose()
          setIsSubmitted(false)
          setMessage('')
          setRating(0)
          setFeedbackType('general')
        }, 2000)
              } else {
          alert('Failed to send feedback, please try again later')
        }
      } catch (error) {
        console.error('Feedback submission error:', error)
        alert('Failed to send feedback, please try again later')
    } finally {
      setIsSubmitting(false)
    }
  }

  const feedbackTypes = [
    {
      id: 'general' as const,
      name: 'General Feedback',
      icon: MessageCircle,
      description: 'Share your thoughts and suggestions'
    },
    {
      id: 'bug' as const,
      name: 'Bug Report',
      icon: Bug,
      description: 'Report issues you encountered'
    },
    {
      id: 'feature' as const,
      name: 'Feature Request',
      icon: Lightbulb,
      description: 'Suggest new features or improvements'
    },
    {
      id: 'rating' as const,
      name: 'Product Rating',
      icon: Star,
      description: 'Rate our product and service'
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">User Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Reward Notice */}
        <div className="p-4 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-sm text-emerald-700">
              <span className="font-semibold">Credits Reward:</span> Users with adopted feedback receive 30 credits
            </p>
          </div>
          <p className="text-xs text-emerald-600 mt-1 ml-6">
            Quality feedback helps us improve and is rewarded with bonus credits
          </p>
        </div>

        {isSubmitted ? (
          // Success State
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your feedback!</h3>
            <p className="text-gray-600">
              We have received your feedback and will carefully consider your suggestions.
            </p>
          </div>
        ) : (
          // Feedback Form
          <form onSubmit={handleSubmit} className="p-6">
            {/* Feedback Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-3 text-left border rounded-lg transition-all ${
                        feedbackType === type.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{type.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Rating Section for Product Rating */}
            {feedbackType === 'rating' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 rounded transition-colors ${
                        star <= rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    You gave {rating} star{rating > 1 ? 's' : ''} rating
                  </p>
                )}
              </div>
            )}

            {/* Message Input */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {feedbackType === 'bug' && 'Please describe the issue you encountered'}
                {feedbackType === 'feature' && 'Please describe the feature you would like'}
                {feedbackType === 'rating' && 'Share your experience with us'}
                {feedbackType === 'general' && 'Your feedback message'}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                placeholder={
                  feedbackType === 'bug'
                    ? 'e.g., I encountered an error when generating a video...'
                    : feedbackType === 'feature'
                    ? 'e.g., I would like to add background music...'
                    : feedbackType === 'rating'
                    ? 'Share your thoughts about our product...'
                    : 'Tell us what you think...'
                }
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Your email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide your email if you'd like us to respond
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 