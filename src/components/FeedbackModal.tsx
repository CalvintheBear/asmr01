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
        alert('发送反馈失败，请稍后重试')
      }
    } catch (error) {
      console.error('反馈提交错误:', error)
      alert('发送反馈失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const feedbackTypes = [
    {
      id: 'general' as const,
      name: '一般反馈',
      icon: MessageCircle,
      description: '分享您的想法和建议'
    },
    {
      id: 'bug' as const,
      name: '错误报告',
      icon: Bug,
      description: '报告遇到的问题'
    },
    {
      id: 'feature' as const,
      name: '功能建议',
      icon: Lightbulb,
      description: '建议新功能或改进'
    },
    {
      id: 'rating' as const,
      name: '产品评价',
      icon: Star,
      description: '为我们的产品评分'
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
            <h2 className="text-xl font-semibold text-gray-900">用户反馈</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isSubmitted ? (
          // Success State
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">感谢您的反馈！</h3>
            <p className="text-gray-600">
              我们已收到您的反馈，将会认真考虑您的建议。
            </p>
          </div>
        ) : (
          // Feedback Form
          <form onSubmit={handleSubmit} className="p-6">
            {/* Feedback Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                反馈类型
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
                  产品评分
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
                    您给了 {rating} 星评价
                  </p>
                )}
              </div>
            )}

            {/* Message Input */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {feedbackType === 'bug' && '请详细描述遇到的问题'}
                {feedbackType === 'feature' && '请描述您希望的新功能'}
                {feedbackType === 'rating' && '分享您的使用体验'}
                {feedbackType === 'general' && '您的反馈内容'}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                placeholder={
                  feedbackType === 'bug'
                    ? '例如：在生成视频时遇到了错误...'
                    : feedbackType === 'feature'
                    ? '例如：希望能够添加音乐背景...'
                    : feedbackType === 'rating'
                    ? '分享您对产品的看法...'
                    : '请告诉我们您的想法...'
                }
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                联系邮箱 <span className="text-gray-500">(可选)</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="您的邮箱地址"
              />
              <p className="text-xs text-gray-500 mt-1">
                如果需要回复，请留下您的邮箱地址
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>发送中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>发送反馈</span>
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