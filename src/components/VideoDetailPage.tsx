'use client'

import { ShowcaseVideo } from '@/data/video-types'
import Link from 'next/link'
import { Copy, ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import FAQAccordion from '@/components/FAQAccordion'
import CollapsibleTechSection from '@/components/CollapsibleTechSection'
import { faqs } from '@/data/faqs'
import StructuredData from '@/components/StructuredData'
import GuidesSection from '@/components/GuidesSection'
import SuccessStoriesSection from '@/components/SuccessStoriesSection'

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
    <>
      <StructuredData type="video" videos={[video]} pageUrl={`https://cuttingasmr.org/video-showcase/${video.id}`} />
      <div className="min-h-screen bg-black py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl shadow-2xl border border-stone-700 p-6 sm:p-8 lg:p-12">
            {/* Header */}
            <header className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
                Prompt Details
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
                {video.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {video.description}
              </p>
            </header>

            {/* Main content */}
            <main className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Video */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-stone-700">
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
              <div className="bg-stone-800/50 p-6 rounded-xl flex flex-col border border-stone-700">
                <p className="text-lg text-cyan-300 mb-4 italic">
                  How to create AI {video.title}? Here's how!
                </p>
                <h2 className="text-2xl font-semibold text-white mb-4">AI Prompt Template</h2>
                <div className="bg-stone-900/70 p-4 rounded-lg mb-4 flex-grow overflow-auto border border-stone-600">
                  <pre className="text-slate-200 text-sm whitespace-pre-wrap font-mono">
                    {video.prompt}
                  </pre>
                </div>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors duration-200 text-base ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 shadow-lg'
                  }`}
                  aria-label="Copy prompt"
                >
                  <Copy className="w-5 h-5" />
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
            </main>

            {/* Guides Section */}
            <GuidesSection />

            {/* Success Stories Section */}
            <SuccessStoriesSection />

            {/* Footer navigation */}
            <footer className="mt-16 sm:mt-20 text-center border-t border-stone-700/50 pt-8">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <Link
                  href="/video-showcase"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors font-medium text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  View All Templates
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-lg font-medium text-base animate-pulse-scale"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Generate Video for free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </footer>

            {/* FAQ & Tech Section */}
            <FAQAccordion faqs={faqs} title="FAQ" />
            <CollapsibleTechSection />
          </div>
        </div>
      </div>
    </>
  )
} 