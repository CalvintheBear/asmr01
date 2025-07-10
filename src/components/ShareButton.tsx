import { Share2 } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
  url: string
  title?: string
}

export default function ShareButton({ url, title = 'Check this AI ASMR prompt template' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-sm font-medium shadow border border-slate-600 transition-colors"
      title={copied ? 'Link copied!' : 'Share'}
    >
      <Share2 className="w-4 h-4" />
      <span>{copied ? 'Copied' : 'Share'}</span>
    </button>
  )
} 