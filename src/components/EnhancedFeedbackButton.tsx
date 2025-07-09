'use client'

import { MessageCircle } from 'lucide-react'

interface EnhancedFeedbackButtonProps {
  onClick: () => void
  isMobile?: boolean
  className?: string
}

export default function EnhancedFeedbackButton({ onClick, isMobile = false, className = '' }: EnhancedFeedbackButtonProps) {
  const baseClasses = isMobile 
    ? "block w-full text-left px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors flex items-center space-x-2"
    : "px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-1"

  return (
    <div className="relative feedback-button">
      <button 
        onClick={onClick}
        className={`${baseClasses} ${className} animate-pulse-custom group`}
      >
        <MessageCircle className="w-4 h-4 animate-bounce-subtle" />
        <span>Feedback</span>
        <span className="text-xs text-white ml-1">
          (30 Credits Reward)
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