'use client'

import { useState } from 'react'
import { Play, Sparkles, Video } from 'lucide-react'

export default function ASMRVideoStudio() {
  const [prompt, setPrompt] = useState('Professional ASMR video content')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ASMR Studio</h1>
                <p className="text-xs text-gray-500">AI Video Generator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - ASMR Types */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">ASMR Video Generator</h2>
              </div>

              {/* Simple Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    视频描述
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    placeholder="输入您想要生成的ASMR视频描述..."
                  />
                </div>

                <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                  <Play className="w-5 h-5 mr-2" />
                  生成ASMR视频
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Simple Result */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Video Result</h3>
              
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-6 h-6 text-gray-400 ml-1" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">Ready to Generate</h4>
                  <p className="text-sm text-gray-500">
                    Enter a prompt to generate<br />
                    your ASMR video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 