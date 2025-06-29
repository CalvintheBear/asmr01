'use client'

// 在Cloudflare Pages中必须使用Edge Runtime
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { Play, Sparkles, Video, Download, Settings, Zap, Heart, Star, Clock, Users, Volume2, Headphones, Check } from 'lucide-react'
import { asmrCategories, defaultOption } from '@/config/asmr-types'
import Link from 'next/link'
import ASMRVideoResult from '@/components/ASMRVideoResult'
import VideoShowcase from '@/components/VideoShowcase'
import CreemPaymentButton from '@/components/CreemPaymentButton'
import SEOHead from '@/components/SEOHead'
import CollapsibleOverlapSection from '@/components/CollapsibleOverlapSection'
import FAQAccordion from '@/components/FAQAccordion'
import CollapsibleTechSection from '@/components/CollapsibleTechSection'
import { useVideoGeneration } from '@/hooks/useVideoGeneration'
import { useCredits } from '@/hooks/useCredits'
import { CREDITS_CONFIG } from '@/lib/credits-config'

export default function ASMRVideoStudio() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedASMRType, setSelectedASMRType] = useState('default')
  const [prompt, setPrompt] = useState('')
  const [showAllTypesModal, setShowAllTypesModal] = useState(false)
  const [userSynced, setUserSynced] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // 使用积分钩子
  const { credits, loading: creditsLoading, refetch: refetchCredits, forceRefresh: forceRefreshCredits } = useCredits(!!user && userSynced)

  // FAQ数据 - 12条完整FAQ
  const faqData = [
    {
      id: 'what-is-asmr-generator',
      question: 'What is ASMR generator with Veo3 AI technology?',
      answer: 'Our AI video generator uses advanced Google Veo3 AI technology to transform prompts into high-quality, relaxing ASMR videos. Best AI video maker for creators - generate professional therapeutic content without traditional recording equipment or editing skills.'
    },
    {
      id: 'best-video-length',
      question: 'Best video length for TikTok Shorts and YouTube Shorts?',
      answer: 'For TikTok Shorts, 10-15 second video loops work best for maximum engagement. For YouTube Shorts, our AI video generator creates seamless loops perfect for longer immersive content and meditation videos. Our best AI video maker optimizes duration automatically.'
    },
    {
      id: 'how-to-make-without-equipment',
      question: 'How to make AI ASMR videos without equipment?',
      answer: 'Yes! Our AI video maker creates professional ASMR content instantly without microphones or editing skills. Transform simple prompts into 4K quality ASMR videos with spatial audio and realistic physics effects - perfect for content creators!'
    },
    {
      id: 'is-generator-free',
      question: 'Is your ASMR video generator free to use?',
      answer: 'We offer free credits for new users to get started, plus flexible paid plans for extensive use. Our transparent credit system means you only pay for rendered videos - no subscriptions required. Perfect for testing before committing.'
    },
    {
      id: 'perfect-for-youtube-tiktok',
      question: 'Perfect AI video generator for YouTube Shorts & TikTok Shorts?',
      answer: 'Absolutely! Our Google Veo AI generates ASMR videos optimized for YouTube Shorts, TikTok Shorts, and social media platforms. Create engaging video content that drives views and subscriber growth for content creators.'
    },
    {
      id: 'cost-for-creators',
      question: 'How much does it cost for content creators?',
      answer: 'Each AI-generated ASMR video costs just 10 credits (less than $1). For content creators, our packages start at $9.90 for 115 credits - creating 11+ videos. Much more cost-effective than traditional video production.'
    },
    {
      id: 'scale-youtube-channel',
      question: 'How can content creators scale their ASMR YouTube channel with Veo3 AI?',
      answer: 'Content creators can generate multiple ASMR videos daily using our best AI video generator. Create consistent ASMR content ideas for your YouTube channel without time-consuming setup - perfect for building a profitable ASMR creator business with meditation and sleep content.'
    },
    {
      id: 'create-ai-content-quickly',
      question: 'How quickly can I create AI content for my ASMR channel?',
      answer: 'Generate professional ASMR videos in just 3-5 minutes! Perfect for content creators who need consistent ASMR video ideas. Transform prompts into daily content for TikTok Shorts or weekly uploads for YouTube channels effortlessly.'
    },
    {
      id: 'asmr-content-ideas',
      question: 'What ASMR content ideas can Google Veo3 AI create?',
      answer: 'Our AI video generator creates amazing content: glass cutting, fruit slicing, knife cutting, lava effects, magma visuals, crystal breaking, and water sounds. Transform any ASMR video idea into reality with our best AI video generator - perfect for stress relief videos and sleep ASMR content.'
    },
    {
      id: 'text-to-video-different',
      question: 'What makes our text to video generator different from others?',
      answer: 'Our text to video AI specializes in ASMR content creation with superior audio-visual synchronization. Unlike generic text to video tools, our platform understands ASMR triggers and creates videos that deliver authentic relaxation experiences with perfect timing and realistic physics.'
    },
    {
      id: 'veo3-binaural-audio',
      question: 'Does Veo3 AI create best ASMR videos with binaural audio?',
      answer: 'Yes! Our Veo3 AI generates the best ASMR videos with built-in 3D spatial audio and binaural sound generation. Create immersive therapeutic audio that provides authentic ASMR tingles - perfect for sleep ASMR generator needs.'
    },
    {
      id: 'customize-brand-content',
      question: 'Can I customize AI-generated ASMR content for my brand?',
      answer: 'Absolutely! Content creators can customize every aspect through detailed prompts. Our Google AI creates unique ASMR content ideas with glass cutting, lava effects, and magma visuals that match your YouTube channel\'s style and audience preferences. Perfect for building a distinctive ASMR creator identity.'
    }
  ]

  // 用户登录后自动同步到数据库
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || userSynced) return
      
      try {
        console.log('🔄 自动同步用户到数据库...')
        const response = await fetch('/api/user/sync', {
          method: 'POST'
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ 用户同步成功:', result)
          setUserSynced(true)
          // 同步成功后获取积分信息
          refetchCredits()
        } else {
          console.error('❌ 用户同步失败:', response.status)
          // 即使同步失败也尝试获取积分
          setUserSynced(true)
          refetchCredits()
        }
      } catch (error) {
        console.error('💥 用户同步错误:', error)
        // 即使出错也标记为已尝试同步
        setUserSynced(true)
        refetchCredits()
      }
    }

    syncUser()
  }, [isLoaded, user, userSynced, refetchCredits])

  // 处理从ASMR类型页面返回的参数
  useEffect(() => {
    const typeId = searchParams.get('type')
    const typeName = searchParams.get('name')
    const typePrompt = searchParams.get('prompt')
    
    if (typeId && typeName) {
      setSelectedASMRType(typeId)
      if (typePrompt) {
        setPrompt(typePrompt)
      }
      
      // 清理URL参数，保持首页URL简洁以优化SEO
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams])

  // 所有ASMR类型的扁平化列表（用于向后兼容）
  const allAsmrTypes = asmrCategories.flatMap(category => 
    category.types.map(type => ({
      ...type,
      category: category.id,
      categoryName: category.name
    }))
  )

  // 当选择ASMR类型时更新提示词
  const handleASMRTypeChange = (typeId: string) => {
    setSelectedASMRType(typeId)
    
    if (typeId === 'default') {
      // 默认选项，清空提示词让用户自由编辑
      setPrompt('')
    } else {
      const selectedType = allAsmrTypes.find(type => type.id === typeId)
      if (selectedType) {
        setPrompt(selectedType.prompt)
      }
    }
  }

  // 移除错误的免费试用逻辑，完全基于积分系统
  // const [freeTrialsLeft, setFreeTrialsLeft] = useState(2)
  // const [isSubscribed, setIsSubscribed] = useState(false)
  
  const { generationStatus, generateVideo, getVideoDetails, get1080PVideo, resetGeneration, isGenerating } = useVideoGeneration()

  const handleGenerate = async () => {
    // 全面的安全检查
    if (!user) {
      alert('Please sign in to generate videos.')
      return
    }
    
    if (!userSynced) {
      alert('User synchronization in progress. Please wait a moment and try again.')
      return
    }
    
    if (creditsLoading) {
      alert('Credits information is loading. Please wait a moment and try again.')
      return
    }
    
    if (!credits) {
      alert('Unable to load credits information. Please refresh the page and try again.')
      return
    }
    
    // 检查积分是否足够 - 这是唯一的判断标准
    if (!CREDITS_CONFIG.canCreateVideo(credits.remainingCredits)) {
      alert(`Insufficient credits! Video generation requires ${CREDITS_CONFIG.VIDEO_COST} credits, you currently have ${credits.remainingCredits} credits remaining. Please visit the pricing page to purchase more credits.`)
      return
    }
    
    try {
      // 直接使用用户编辑的提示词（用户可以修改ASMR类型的默认提示词）
      await generateVideo({
        prompt: prompt,
        aspectRatio: '16:9',
        duration: '8',
      })
      
      // 生成成功后立即刷新积分
      if (user) {
        setTimeout(() => {
          refetchCredits()
        }, 1000) // 延迟1秒刷新，确保数据库已更新
      }
    } catch (error) {
      console.error('生成视频失败:', error)
      alert('Video generation failed, please try again')
    }
  }

  // 处理下载按钮
  const handleDownload = () => {
    if (generationStatus.videoUrl) {
      const link = document.createElement('a')
      link.href = generationStatus.videoUrl
      link.download = `asmr-video-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // 处理1080p下载按钮
  const handleDownload1080p = () => {
    if (generationStatus.videoUrl1080p) {
      const link = document.createElement('a')
      link.href = generationStatus.videoUrl1080p
      link.download = `asmr-video-1080p-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // 处理历史视频按钮 - 跳转到profile页面
  const handleOpenAssets = () => {
    router.push('/profile')
  }

  // 处理点击外部区域关闭移动端菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileMenu) {
        const target = event.target as HTMLElement
        if (!target.closest('header')) {
          setShowMobileMenu(false)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMobileMenu])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <SEOHead
        title="ASMR Creator Tools - Veo3 AI ASMR Maker | Best AI Video Generator for Creators"
        description="ASMR creator tools for YouTube channels! AI ASMR creator software with glass cutting, fruit videos. How to become ASMR creator with Google Veo3 AI. Relaxing video maker for content creators."
        canonical="https://cuttingasmr.org"
        keywords="asmr creator tools, asmr maker software, best asmr generator, ai asmr creator, relaxing video maker, how to become asmr creator, asmr youtube channel, ai content creator tools, veo3 asmr, Google veo 3 ai, best ai video generator, ai video generator, YouTube shorts, tiktok shorts, content creator"
      />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/favicon.ico" 
                  alt="CuttingASMR - Google Veo3 AI ASMR Generator Logo for YouTube Content Creators" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CuttingASMR.org</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/pricing" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </button>
              
              {/* 积分显示 */}
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                    {creditsLoading ? (
                      <span className="text-sm text-emerald-600">Loading...</span>
                    ) : credits ? (
                      <span className="text-sm text-emerald-700 font-medium">
                        Credits: {credits.remainingCredits}
                      </span>
                    ) : (
                      <span className="text-sm text-emerald-600">--</span>
                    )}
                  </div>
                  <button
                    onClick={forceRefreshCredits}
                    disabled={creditsLoading}
                    className="p-1 text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition-colors"
                    title="Force refresh credits (fetch from database)"
                  >
                    <svg className={`w-4 h-4 ${creditsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              )}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Profile
                  </Link>
                  <span className="text-sm text-gray-600 max-w-[150px] truncate">
                    Welcome, {user.fullName || user.primaryEmailAddress?.emailAddress}
                  </span>
                  <SignOutButton>
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              {/* 移动端积分显示 */}
              {user && (
                <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-xs text-emerald-700 font-medium">
                    {creditsLoading ? '...' : credits?.remainingCredits || 0}
                  </span>
                </div>
              )}
              
              {/* 汉堡菜单按钮 */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  href="/pricing" 
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Pricing
                </Link>
                <button className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                  Blog
                </button>
                
                {user ? (
                  <>
                    <Link 
                      href="/profile" 
                      className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Profile
                    </Link>
                    <div className="px-3 py-2 text-sm text-gray-500 truncate">
                      {user.fullName || user.primaryEmailAddress?.emailAddress}
                    </div>
                    <SignOutButton>
                      <button 
                        className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Sign Out
                      </button>
                    </SignOutButton>
                  </>
                ) : (
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <button 
                      className="block w-full text-left px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-md transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 min-h-screen relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* New User Credits Badge */}
            <div className="mb-6 flex justify-center">
              {!user ? (
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="group inline-flex items-center bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
                    <span className="mr-2 bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                    <Sparkles className="w-4 h-4 mr-1" />
                    FREE credits for new users!
                  </button>
                </SignInButton>
              ) : (
                <button 
                  onClick={() => {
                    const showcaseElement = document.getElementById('video-showcase');
                    if (showcaseElement) {
                      showcaseElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group inline-flex items-center bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                >
                  <span className="mr-2 bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                    ✨
                  </span>
                  <Video className="w-4 h-4 mr-1" />
                  View Video Examples
                </button>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Create Stunning <span className="font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent">ASMR Video</span> with
              <span className="block">our AI-powered Veo3 generator</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              FREE credits for new users! Perfect for YouTube, TikTok creators and ASMR makers. 
              Generate professional AI videos in minutes with advanced Google Veo3 AI technology. 
              Best AI video generator - no editing skills required.
            </p>
            

            

          </div>

          {/* Main Content - Two Column Layout */}
          <div id="main-generator" className="grid lg:grid-cols-2 gap-8 items-start mb-20">
            {/* Left Panel - ASMR Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/50 overflow-hidden h-fit">
              
              {/* ASMR Type Selection */}
              <div className="p-8 border-b border-stone-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose ASMR Type</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">Select a template or create your own custom ASMR scene</p>
                
                {/* Quick Selection - Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {/* Default Custom Option */}
                  <button
                    onClick={() => handleASMRTypeChange('default')}
                    className={`p-2 sm:p-3 rounded-xl border transition-all text-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center ${
                      selectedASMRType === 'default'
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-gray-700'
                    }`}
                  >
                    Default
                  </button>

                  {/* Featured ASMR Types */}
                  {['glass-fruit-cutting', 'ice-cube-carving', 'metal-sheet-cutting', 'fireplace', 'squeeze-toy', 'minecraft-block-cutting'].map((typeId) => {
                    const type = allAsmrTypes.find(t => t.id === typeId)
                    if (!type) return null
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleASMRTypeChange(type.id)}
                        className={`p-2 sm:p-3 rounded-xl border transition-all text-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center ${
                          selectedASMRType === type.id
                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                            : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-gray-700'
                        }`}
                      >
                        <span className="block leading-tight">{type.name}</span>
                      </button>
                    )
                  })}
                  
                  {/* View All Button */}
                  <button
                    onClick={() => setShowAllTypesModal(true)}
                    className="p-2 sm:p-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-gray-700 transition-all text-center flex items-center justify-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem]"
                  >
                    <span className="mr-1">⋯</span> All
                  </button>
                </div>
              </div>

              {/* Prompt Input Section */}
              <div className="p-8 border-b border-stone-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Customize Your ASMR Video</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedASMRType === 'default' 
                    ? 'Describe your ideal ASMR scene in detail'
                    : 'Edit the template or use it as-is'
                  }
                </p>
                
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={selectedASMRType === 'default' 
                    ? "Describe your ASMR scene: lighting, camera angles, sounds, textures, and visual elements. Be specific about what you want to see and hear..."
                    : "Edit the template prompt below or use it as-is..."
                  }
                  className="w-full h-32 p-4 border border-stone-300 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-stone-50/50 focus:bg-white transition-colors"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    {prompt.length}/500 characters
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>~3-5 minutes generation time</span>
                  </div>
                </div>
              </div>

              {/* Generate Button Section */}
              <div className="p-8">
                {user ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleGenerate}
                      disabled={
                        !user || 
                        !userSynced || 
                        creditsLoading || 
                        !credits || 
                        !prompt.trim() || 
                        isGenerating || 
                        !CREDITS_CONFIG.canCreateVideo(credits?.remainingCredits || 0)
                      }
                                              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        !user || 
                        !userSynced || 
                        creditsLoading || 
                        !credits || 
                        !prompt.trim() || 
                        isGenerating || 
                        !CREDITS_CONFIG.canCreateVideo(credits?.remainingCredits || 0)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300'
                      }`}
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Generating Video...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Play className="w-5 h-5" />
                          <span>
                            {!user 
                              ? 'Sign In Required'
                              : !userSynced 
                              ? 'Syncing Account...'
                              : creditsLoading 
                              ? 'Loading Credits...'
                              : !credits 
                              ? 'Credits Unavailable'
                              : !CREDITS_CONFIG.canCreateVideo(credits.remainingCredits) 
                              ? `Insufficient Credits (Need ${CREDITS_CONFIG.VIDEO_COST})`
                              : `Generate ASMR Video (10 Credits)`
                            }
                          </span>
                        </div>
                      )}
                    </button>
                    
                    {/* Loading state notice */}
                    {user && (!userSynced || creditsLoading || !credits) && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-600 border-t-transparent"></div>
                          </div>
                          <div>
                            <h4 className="font-medium text-amber-800 mb-1">
                              {!userSynced 
                                ? 'Syncing Account'
                                : creditsLoading 
                                ? 'Loading Credits'
                                : 'Loading Account Data'
                              }
                            </h4>
                            <p className="text-sm text-amber-700 leading-relaxed">
                              Please wait while we load your account information...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Sign in to Generate Videos</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Create your account to start generating AI ASMR videos with our advanced tools.
                    </p>
                    <SignInButton mode="modal" fallbackRedirectUrl="/">
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                        Sign In to Continue
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Video Result */}
            <div className="lg:sticky lg:top-8">
              <ASMRVideoResult 
                isGenerating={isGenerating}
                progress={generationStatus.progress}
                videoUrl={generationStatus.videoUrl}
                videoUrl1080p={generationStatus.videoUrl1080p}
                thumbnailUrl={generationStatus.thumbnailUrl}
                videoId={generationStatus.videoId}
                details={generationStatus.details}
                onDownload={handleDownload}
                onDownload1080p={handleDownload1080p}
                onOpenAssets={handleOpenAssets}
              />
            </div>
          </div>

          {/* Video Showcase Section - 新增 */}
          <div id="video-showcase" className="scroll-mt-20">
            <VideoShowcase 
              maxVideos={6}
              showHeader={true}
              showViewMore={true}
              columns={2}
            />
          </div>

          {/* How to Create ASMR Video Section - Natural Style */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How to Create an ASMR Video<br />
                <span className="text-gray-700">with Veo3 AI</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Generate a relaxing ASMR video in just three simple steps with our<br />
                AI-powered Veo3 platform:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {/* Step 1 */}
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose ASMR Scene</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Select from pre-built templates or create your own custom ASMR concept
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customize Your Prompt</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Describe your ideal ASMR scene with specific details about sounds, visuals, and mood
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-lg font-semibold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Generate & Share</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  AI creates your video in 3-5 minutes. Download and share on YouTube, TikTok, or any platform
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="#main-generator">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  Create ASMR Video Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>



          {/* Collapsible Overlap Sections */}
          <CollapsibleOverlapSection sections={[
            {
              id: 'asmr-guide',
              title: 'What is ASMR and How Our AI Generator Works',
              subtitle: 'Learn about ASMR technology and discover how Google Veo3 AI creates therapeutic content automatically.',
              bgGradient: 'bg-white',
              titleColor: 'text-gray-800',
              borderColor: 'border-gray-200',
              collapsedContent: (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800 mb-2">ASMR Science</h3>
                    <p className="text-sm text-gray-600">Autonomous Sensory Meridian Response triggers relaxation</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800 mb-2">AI Generation</h3>
                    <p className="text-sm text-gray-600">Google Veo3 creates professional ASMR videos automatically</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800 mb-2">Social Media</h3>
                    <p className="text-sm text-gray-600">Perfect for YouTube Shorts and TikTok content</p>
                  </div>
                </div>
              ),
              expandedContent: (
                <div className="space-y-3">
                  <div className="prose max-w-none text-gray-700 space-y-2">
                    <p className="leading-relaxed">
                      ASMR (Autonomous Sensory Meridian Response) is a relaxing sensation that helps millions of people fall asleep, reduce stress, and find peace. Our Google Veo3 AI technology creates professional ASMR videos automatically - from glass cutting and fruit slicing to ice cube carving and metal sheet cutting sounds.
                    </p>
                    <p className="leading-relaxed">
                      Perfect for content creators building YouTube channels and TikTok shorts. Our AI video generator understands prompts like "glass fruit cutting," "knife sounds," "lava effects," and "magma flow" to create viral-ready content.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-sm font-bold text-blue-600">1</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Choose ASMR Style</h3>
                      <p className="text-gray-600 text-xs">Select from glass cutting, fruit slicing, or custom prompts.</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-sm font-bold text-emerald-600">2</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">AI Generation</h3>
                      <p className="text-gray-600 text-xs">Google Veo3 creates professional ASMR videos automatically.</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-sm font-bold text-purple-600">3</span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Download & Share</h3>
                      <p className="text-gray-600 text-xs">Download high quality videos for YouTube and TikTok.</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm">Perfect for Content Creators</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Our AI ASMR generator helps YouTube creators and TikTok influencers build successful channels with Google Veo3 technology that performs well on social media platforms.
                    </p>
                  </div>
                </div>
              )
            },
            {
              id: 'veo3-technology',
              title: 'Google Veo3 AI: The Future of ASMR Content Creation',
              subtitle: 'Discover the cutting-edge AI technology that powers professional ASMR video generation.',
              bgGradient: 'bg-white',
              titleColor: 'text-gray-800',
              borderColor: 'border-gray-200',
              collapsedContent: (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Advanced AI</h3>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Growth Results</h3>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Perfect Audio</h3>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Global Impact</h3>
                  </div>
                </div>
              ),
              expandedContent: (
                <div className="space-y-4">
                  <div className="prose max-w-none text-gray-700 space-y-3">
                    <p className="leading-relaxed">
                      Google Veo3 represents cutting-edge AI video generation technology, specifically optimized for therapeutic ASMR content. 
                      Our AI ASMR generator understands effective ASMR content nuances - from precise glass cutting sounds to visual lava effects.
                    </p>
                    
                    <p className="leading-relaxed">
                      Content creators report significant growth in YouTube and TikTok followers. 
                      The AI generates videos that perform well on social media algorithms, creating genuinely relaxing content for all platforms.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular ASMR Video Types:</h3>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          Glass cutting and fruit slicing
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          Ice cube carving and metal cutting
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          Knife sounds and blade effects
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                          Lava flow and magma simulations
                        </li>
                      </ul>
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Sleep meditation videos
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Stress relief content
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          AI voices with sound effects
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Custom text-to-video
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none text-gray-700">
                    <p className="leading-relaxed">
                      Google Veo3 integration ensures our ASMR generator stays at the forefront of AI technology. 
                      Content creators input simple prompts and receive professional results, democratizing ASMR creation for anyone wanting to help others relax and reduce stress.
                    </p>
                  </div>
                </div>
              )
            },
            {
              id: 'why-choose-cutting-asmr',
              title: 'Why Choose CuttingASMR.org AI ASMR Video Generation?',
              subtitle: 'Discover the advantages of using our platform for creating therapeutic ASMR content that helps people sleep, relax, and reduce stress.',
              bgGradient: 'bg-white',
              titleColor: 'text-gray-800',
              borderColor: 'border-gray-200',
              collapsedContent: (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Quick Creation</h3>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Audience Growth</h3>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Perfect Audio</h3>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">Therapeutic Value</h3>
                  </div>
                </div>
              ),
              expandedContent: (
                <div className="space-y-4">
                  <div className="prose max-w-none text-gray-700">
                    <p className="leading-relaxed">
                      CuttingASMR.org stands out as the premier platform for AI-generated ASMR content creation. Our Google Veo3 integration provides unmatched quality, making us the top choice for content creators worldwide.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Quick Creation</h3>
                      <p className="text-xs text-gray-600">Generate professional ASMR videos in minutes.</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Audience Growth</h3>
                      <p className="text-xs text-gray-600">Content performs well on YouTube and TikTok.</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Volume2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Perfect Sound</h3>
                      <p className="text-xs text-gray-600">Google Veo3 creates realistic ASMR sounds.</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Headphones className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Therapeutic Value</h3>
                      <p className="text-xs text-gray-600">Helps with sleep and stress relief.</p>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Why CuttingASMR.org Leads</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          Free credits for new users
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          Advanced Google Veo3 integration
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          Social media optimized
                        </li>
                      </ul>
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          User-friendly interface
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          Fast generation times
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          Extensive template library
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]} />

          {/* FAQ Section */}
          <FAQAccordion 
            title="Frequently Asked Questions"
            faqs={faqData}
          />

          {/* Advanced AI Video Generation Technology Section - Collapsible */}
          <CollapsibleTechSection />

        </div>
      </div>

      {/* Footer - 全宽布局 */}
      <footer className="bg-gradient-to-r from-stone-800 via-gray-800 to-stone-800 text-white relative">
        {/* Subtle footer pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src="/logo.svg" 
                    alt="CuttingASMR - Best AI ASMR Video Generator Powered by Google Veo3 for Content Creators" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold">CuttingASMR.org</span>
              </div>
              <p className="text-gray-400">
                Create Stunning ASMR Video with our AI-powered Veo3 generator. Perfect for YouTube creators and ASMR makers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund</Link></li>
                <li><a href="mailto:supportadmin@cuttingasmr.org" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CuttingASMR.org. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ASMR Types Modal */}
      {showAllTypesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Choose ASMR Type</h3>
                <button
                  onClick={() => setShowAllTypesModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-500 text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-8">
                {/* 默认选项 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <span className="text-lg">✏️</span>
                    <h4 className="font-semibold text-gray-900">Custom</h4>
                  </div>
                  <button
                    onClick={() => {
                      handleASMRTypeChange('default')
                      setShowAllTypesModal(false)
                    }}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${
                      selectedASMRType === 'default'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <h5 className={`font-medium ${
                        selectedASMRType === 'default' ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {defaultOption.name}
                      </h5>
                      <p className={`text-sm leading-relaxed ${
                        selectedASMRType === 'default' ? 'text-emerald-700' : 'text-gray-600'
                      }`}>
                        {defaultOption.description}
                      </p>
                    </div>
                  </button>
                </div>

                {/* 所有分类 */}
                {asmrCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                      <span className="text-lg">{category.icon}</span>
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.types.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            handleASMRTypeChange(type.id)
                            setShowAllTypesModal(false)
                          }}
                          className={`p-4 rounded-xl border transition-all text-left ${
                            selectedASMRType === type.id
                              ? 'border-emerald-500 bg-emerald-50 shadow-md'
                              : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="space-y-1">
                            <h5 className={`font-medium ${
                              selectedASMRType === type.id ? 'text-emerald-800' : 'text-gray-800'
                            }`}>
                              {type.name}
                            </h5>
                            <p className={`text-sm leading-relaxed ${
                              selectedASMRType === type.id ? 'text-emerald-700' : 'text-gray-600'
                            }`}>
                              {type.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
