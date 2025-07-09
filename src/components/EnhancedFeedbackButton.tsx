'use client'

import { MessageCircle } from 'lucide-react'

interface EnhancedFeedbackButtonProps {
  onClick: () => void
  isMobile?: boolean
  className?: string
}

export default function EnhancedFeedbackButton({ onClick, isMobile = false, className = '' }: EnhancedFeedbackButtonProps) {
  const baseClasses = isMobile 
    ? "block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
    : "px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"

  return (
    <div className="relative feedback-button">
      <button 
        onClick={onClick}
        className={`${baseClasses} ${className} animate-pulse-custom group`}
      >
        <MessageCircle className="w-4 h-4 animate-bounce-subtle" />
        <span>Feedback</span>
        <span className="text-xs text-emerald-600 ml-1 opacity-75">
          (奖励30积分)
        </span>
      </button>
      
      {/* Tooltip */}
      {!isMobile && (
        <div className="feedback-tooltip">
          Users with adopted feedback receive 30 credits reward
        </div>
      )}
    </div>
  )
} 