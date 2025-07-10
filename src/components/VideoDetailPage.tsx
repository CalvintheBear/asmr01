'use client'

import { ShowcaseVideo } from '@/data/video-types'
import Link from 'next/link'
import { Copy, ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface VideoDetailPageProps {
  video: ShowcaseVideo
}

export default function VideoDetailPage({ video }: VideoDetailPageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(video.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
          {video.title}
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {video.description}
        </p>
      </header>

      {/* Main content */}
      <main className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Video */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            src={video.videoUrl}
            controls
            autoPlay
            loop
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Prompt & actions */}
        <div className="bg-stone-800/60 p-6 rounded-lg flex flex-col border border-stone-700">
          <h2 className="text-2xl font-semibold text-white mb-4">Prompt Template</h2>
          <div className="bg-stone-900 p-4 rounded-md mb-4 flex-grow overflow-auto border border-stone-700">
            <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono">
{video.prompt}
            </pre>
          </div>
          <button
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors duration-200 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
            }`}
            aria-label="Copy prompt"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="mt-20 text-center border-t border-stone-700 pt-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/video-showcase"
            className="inline-flex items-center gap-2 px-5 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            View All AI Video Templates
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors"
          >
            Generate AI Videos for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  )
} 