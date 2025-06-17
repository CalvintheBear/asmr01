'use client'

import { useState } from 'react'
import { Play, Sparkles, Video, Download, Settings, Zap, Heart, Star, Clock, Users, Volume2, Headphones } from 'lucide-react'
import Link from 'next/link'

export default function ASMRVideoStudio() {
  const [selectedASMRType, setSelectedASMRType] = useState('default')
  const [prompt, setPrompt] = useState('Create a relaxing ASMR video with soothing, high-quality audio and satisfying visual elements. Focus on generating calming sounds that help viewers unwind and relax.')
  const [watermark, setWatermark] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [freeTrialsLeft, setFreeTrialsLeft] = useState(2)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const asmrTypes = [
    { id: 'default', name: 'Default', icon: '🎵', description: 'Classic ASMR experience' },
    { id: 'ice-cutting', name: 'Ice Cutting ASMR', icon: '🧊', description: 'Satisfying ice cutting sounds' },
    { id: 'hot-iron', name: 'Hot Iron Forging', icon: '🔥', description: 'Metalworking ASMR sounds' },
    { id: 'lime-cutting', name: 'Lime Cutting ASMR', icon: '🍋', description: 'Fresh citrus cutting sounds' },
    { id: 'crystal-burger', name: 'Crystal Burger Cutting', icon: '🍔', description: 'Unique crystal burger ASMR' },
    { id: 'fireplace', name: 'Fireplace Crackling', icon: '🔥', description: 'Cozy fireplace sounds' },
    { id: 'keyboard', name: 'Keyboard Typing', icon: '⌨️', description: 'Mechanical keyboard ASMR' },
    { id: 'nail-care', name: 'Nail Care', icon: '💅', description: 'Gentle nail care sounds' }
  ]

  const handleGenerate = async () => {
    if (!isSubscribed && freeTrialsLeft <= 0) {
      alert('You have used all your free trials. Please subscribe to continue generating AI ASMR videos.')
      return
    }
    
    setIsGenerating(true)
    // 模拟API调用
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedVideo('/api/placeholder-video') // 模拟生成的视频URL
      
      // 减少免费试用次数
      if (!isSubscribed && freeTrialsLeft > 0) {
        setFreeTrialsLeft(prev => prev - 1)
      }
    }, 4000)
  }

  const handleDownload = () => {
    // 模拟下载功能
    console.log('下载视频')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CuttingASMR.org</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#pricing" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Stunning
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              AI ASMR Videos
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Generate professional ASMR content with our advanced AI technology. Perfect for TikTok &amp; YouTube creators, ASMR enthusiasts, and content makers. Start with 2 free trials, then choose a subscription plan with fair usage limits—subscriptions are not unlimited.
          </p>
        </div>
      </section>

      {/* Main Generator Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* ASMR Type Selection */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your ASMR Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {asmrTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedASMRType(type.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                      selectedASMRType === type.id
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{type.name}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">AI Prompt</h3>
                <span className="text-sm text-gray-500">Click to edit</span>
              </div>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your ASMR scene, sounds, and atmosphere"
                  className="w-full h-40 p-6 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-gray-700 leading-relaxed"
                />
                <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                  {prompt.length}/1000
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Watermark (Optional)</h3>
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                placeholder="Add your brand or custom text as watermark, or leave empty"
                className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="text-sm text-gray-400 mt-2">{watermark.length}/50</div>
            </div>

            {/* Trial Status */}
            {!isSubscribed && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900">Free Trials Remaining</h4>
                    <p className="text-blue-700">{freeTrialsLeft} out of 2 free AI ASMR generations left</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || (!isSubscribed && freeTrialsLeft <= 0)}
              className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating AI ASMR Video...</span>
                </>
              ) : (
                <>
                  <Video className="w-6 h-6" />
                  <span>
                    {!isSubscribed && freeTrialsLeft <= 0 
                      ? "Subscribe to Generate"
                      : "Generate AI ASMR Video"
                    }
                  </span>
                </>
              )}
            </button>

            {/* Progress Info */}
            {isGenerating && (
              <div className="text-center mt-4">
                <p className="text-gray-600">AI ASMR video generation takes 2-5 minutes. Please don{"'"}t close this tab.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Result Section */}
      {(isGenerating || generatedVideo) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your AI ASMR Video Result</h3>
            
            {isGenerating ? (
              <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your AI ASMR video...</p>
                </div>
              </div>
            ) : generatedVideo ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg">AI Generated ASMR Video</p>
                    <p className="text-sm opacity-80 mt-2">0:30</p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Video
                  </button>
                  <button className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Settings className="w-5 h-5 mr-2" />
                    My Library
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Examples Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI ASMR Video Examples</h2>
          <p className="text-xl text-gray-600">Explore various ASMR types our AI generator can create. Each AI ASMR video is crafted to deliver the perfect relaxing experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Ice Cutting ASMR', 
              description: 'Crisp ice cutting sounds generated by AI. Perfect ASMR content for relaxation and stress relief.', 
              duration: '0:30',
              success: 'Popular Choice'
            },
            { 
              title: 'AI Fireplace ASMR', 
              description: 'Warm crackling fireplace sounds created with AI technology. Cozy ASMR atmosphere for sleep and meditation.', 
              duration: '0:45',
              success: 'Sleep Aid'
            },
            { 
              title: 'Keyboard Typing ASMR', 
              description: 'Rhythmic mechanical keyboard sounds. AI-generated ASMR perfect for focus and concentration.', 
              duration: '0:35',
              success: 'Focus Helper'
            },
            { 
              title: 'Nail Care ASMR', 
              description: 'Gentle nail care sounds with precise AI audio generation. Delicate ASMR for ultimate relaxation.', 
              duration: '0:40',
              success: 'Therapeutic'
            }
          ].map((example, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                <Play className="w-12 h-12 text-gray-400" />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {example.duration}
                </div>
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                  AI Generated
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{example.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{example.description}</p>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                  {example.success}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Create AI ASMR Videos</h2>
          <p className="text-xl text-gray-600">Generate professional ASMR content with our AI-powered platform in just three simple steps:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
              {
                step: '1',
                title: 'Choose ASMR Type',
                description: 'Select from various ASMR scenarios including ice cutting, keyboard typing, fireplace crackling, and more AI ASMR options.',
                icon: <Settings className="w-8 h-8" />
              },
              {
                step: '2',
                title: 'Customize AI Prompt',
                description: 'Describe your desired ASMR scene and atmosphere. Our AI ASMR generator will create content based on your specifications.',
                icon: <Sparkles className="w-8 h-8" />
              },
              {
                step: '3',
                title: 'Generate & Download',
                description: 'Click generate and wait a few minutes to receive your AI-created ASMR video. Download and share instantly.',
                icon: <Video className="w-8 h-8" />
              }
            ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                {step.icon}
              </div>
              <div className="text-sm font-semibold text-purple-600 mb-2">步骤 {step.step}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg">
            Start Creating AI ASMR Videos
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our AI ASMR Generator</h2>
            <p className="text-xl text-gray-600">Advanced AI Technology × Professional Quality = Perfect ASMR Content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Diverse ASMR Content',
                description: 'Our AI ASMR generator supports multiple scene types including ice cutting, keyboard typing, fireplace crackling, nail care, and more. Each ASMR video is tailored to different relaxation preferences.',
                icon: <Star className="w-8 h-8 text-yellow-500" />,
                metric: '25+ ASMR Types'
              },
              {
                title: 'AI-Powered Quality',
                description: 'Advanced artificial intelligence ensures every ASMR video meets professional standards. Our AI ASMR technology produces consistent, high-quality content every time.',
                icon: <Zap className="w-8 h-8 text-blue-500" />,
                metric: 'AI Technology'
              },
              {
                title: 'Free Trial Available',
                description: 'Start with 2 free AI ASMR video generations to experience our quality. No credit card required for trial. Subscribe when you\'re ready for more ASMR generation capacity.',
                icon: <Heart className="w-8 h-8 text-red-500" />,
                metric: '2 Free Trials'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <div className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full inline-block font-semibold">
                  {benefit.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start Creating AI ASMR Videos Today
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of content creators using our AI ASMR generator. Start with 2 free trials and experience the future of ASMR content creation.
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI ASMR Generator Pricing</h2>
            <p className="text-xl text-gray-600">Start with free trials, then upgrade for higher monthly AI ASMR video generation limits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Trial */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Trial</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">$0</div>
                <p className="text-gray-600">Perfect for trying AI ASMR generation</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>2 free AI ASMR video generations</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Access to all ASMR types</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>HD video quality</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>No watermark</span>
                </li>
              </ul>

              <button className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Pro Subscription */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro Subscription</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">$9.99<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600">Generous monthly AI ASMR video creation quota</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Up to 200 AI ASMR generations / month</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Priority processing</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>4K video quality</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Custom watermarks</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Email support</span>
                </li>
              </ul>

              <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                Subscribe to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Volume2 className="w-6 h-6" />
                <span className="text-xl font-bold">CuttingASMR.org</span>
              </div>
              <p className="text-gray-400">
                The most advanced AI ASMR video generator. Create professional ASMR content with cutting-edge artificial intelligence technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI ASMR Generator</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">ASMR Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ASMR Guidelines</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 CuttingASMR.org • Advanced AI ASMR Video Generator</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 