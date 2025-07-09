'use client'

// 在Cloudflare Pages中必须使用Edge Runtime
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { Play, Sparkles, Video, Download, Settings, Zap, Heart, Star, Clock, Users, Volume2, Headphones, Check, X, MessageCircle } from 'lucide-react'
import { asmrCategories, defaultOption } from '@/config/asmr-types'
import Link from 'next/link'
import ASMRVideoResult from '@/components/ASMRVideoResult'
import VideoShowcase from '@/components/VideoShowcase'
import CreemPaymentButton from '@/components/CreemPaymentButton'
import SEOHead from '@/components/SEOHead'
import FAQAccordion from '@/components/FAQAccordion'
import CollapsibleTechSection from '@/components/CollapsibleTechSection'
import FeedbackModal from '@/components/FeedbackModal'
import EnhancedFeedbackButton from '@/components/EnhancedFeedbackButton'
import { useVideoGeneration } from '@/hooks/useVideoGeneration'
import { useCredits } from '@/hooks/useCredits'
import { CREDITS_CONFIG } from '@/lib/credits-config'
import StructuredData from '@/components/StructuredData'

export default function ASMRVideoStudio() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedASMRType, setSelectedASMRType] = useState('default')
  const [prompt, setPrompt] = useState('')
  const [showAllTypesModal, setShowAllTypesModal] = useState(false)
  const [userSynced, setUserSynced] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  
  // 使用积分钩子
  const { credits, loading: creditsLoading, refetch: refetchCredits, forceRefresh: forceRefreshCredits } = useCredits(!!user && userSynced)

  // SEO-optimized FAQ data based on the provided keyword list
  const faqData = [
    {
      id: 'what-is-ai-asmr-generator',
      question: 'What is an ASMR Video Generator? How is it related to VEO3?',
      answer: 'Our ASMR Video Generator is an online tool powered by Google\'s latest VEO3 technology. It allows you to easily create captivating ASMR videos using simple "text to video" commands. Whether you want to make relaxing YouTube videos or viral TikTok shorts, our tool can help.'
    },
    {
      id: 'how-to-make-ai-asmr-video',
      question: 'How do I make an ASMR video? Do I need to write complex prompts?',
      answer: 'Making videos is very simple! Just choose a scene, like "glass cutting" or "lava flow," and enter a simple description. Our video maker will handle the rest. We have optimized the prompt generation logic for VEO3 (prompt veo3), so you don\'t need to be an expert to create professional-grade videos.'
    },
    {
      id: 'best-ai-video-generator',
      question: 'Why is this considered one of the best video generators on the market?',
      answer: 'Our platform is considered one of the best video generators because it\'s specifically optimized for ASMR content and is driven by the powerful Google VEO 3 and Gemini models. We focus on audio-visual synchronization to ensure that scenes like "knife cutting fruit" have extremely realistic physics and sound.'
    },
    {
      id: 'asmr-content-types',
      question: 'What types of ASMR content can I create? For example, glass or lava?',
      answer: 'Absolutely! Our platform supports a wide range of creative ideas, including but not limited to "glass cutting," "glass fruit" art, flowing "lava" and "magma" visuals, and scenes of various knives cutting objects. You can also generate unique sounds and ASMR sound effects.'
    },
    {
      id: 'create-videos-for-social-media',
      question: 'Is this tool suitable for creating videos for TikTok and YouTube Shorts?',
      answer: 'Definitely! Our video generator is made for social media. You can easily create vertical short videos that fit the style of TikTok and YouTube Shorts. Whether you want to post on TikTok, YouTube, Facebook, or Instagram, you can quickly generate eye-catching video content.'
    },
    {
      id: 'cost-for-creators',
      question: 'How much does it cost for content creators?',
      answer: 'Each generated ASMR video costs just 10 credits (less than $1). For content creators, our packages start at $9.90 for 115 credits - creating 11+ videos. Much more cost-effective than traditional video production.'
    },
    {
      id: 'what-is-veo3-ai',
      question: 'What is VEO3? How is it related to Google AI?',
      answer: 'VEO3 (also known as Google VEO) is a cutting-edge video generation model developed by Google AI Labs (Google AI Studio) as part of its Gemini program. It represents a breakthrough in understanding natural language and generating high-quality, realistic videos, and it\'s especially good at handling complex physical interactions and visual effects.'
    },
    {
      id: 'text-to-video-difference',
      question: 'How is your "text to video" tool different from others?',
      answer: 'Unlike other generic "text to video" tools, we specialize in the ASMR niche. This means our system not only generates visuals but also creates matching voices and sound effects designed to trigger ASMR tingles. From subtle cutting sounds to flowing noises, everything is designed for the optimal ASMR experience.'
    },
    {
      id: 'how-to-get-started',
      question: 'As a video creator, how can I start using this to grow my channel?',
      answer: 'This is a powerful tool for YouTube or TikTok video creators. You can quickly generate multiple high-quality ASMR videos daily to keep your channel active. In just a few minutes, you can turn a simple idea into a publishable video, significantly boosting your content creation efficiency.'
    },
    {
      id: 'text-to-video-different',
      question: 'What makes our text to video generator different from others?',
      answer: 'Our text to video generator specializes in ASMR content creation with superior audio-visual synchronization. Unlike generic text to video tools, our platform understands ASMR triggers and creates videos that deliver authentic relaxation experiences with perfect timing and realistic physics.'
    },
    {
      id: 'video-generation-speed',
      question: 'How long does it take to generate a video?',
      answer: 'Speed is one of our strengths. Typically, a standard ASMR video is generated in just 3-5 minutes. This means you can quickly respond to trending topics or batch-create content for your YouTube Shorts or TikTok channel in a short amount of time.'
    },
    {
      id: 'voice-dubbing-feature',
      question: 'Can I use AI for voice dubbing (voice dubbing AI)?',
      answer: 'Currently, our core feature revolves around generating visuals and ASMR trigger sounds. While our videos include highly synchronized sound effects, a dedicated voice dubbing feature is under development. Our goal is to eventually achieve a perfect combination of visuals, sound effects, and narration.'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <SEOHead
        title="CuttingASMR - Veo3 Video & Prompt Generator |Al Video Prompt Tool for Creators"
        description="Create stunning AI videos with veo3 video prompt templates! Professional ai video prompt generator using Google Veo3 AI. Perfect for ASMR creators, YouTube Shorts, and TikTok content makers."
        canonical="https://cuttingasmr.org"
        keywords="veo3 video prompt, ai video prompt, google veo3 prompts, ai video generator, asmr video prompts, veo3 ai generator, ai video prompt maker, video prompt templates, ai content creator tools, best ai video generator, YouTube shorts, tiktok shorts, veo3 examples"
      />
      
      {/* 添加结构化数据 */}
      <StructuredData 
        type="homepage"
        faqs={faqData}
        pageUrl="https://cuttingasmr.org"
      />
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
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
              <div className="text-xl font-bold text-white">CuttingASMR.org</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/pricing" className="px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors">
                Pricing
              </Link>
              <EnhancedFeedbackButton onClick={() => setShowFeedbackModal(true)} />
              
              {/* 积分显示 */}
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-lg">
                    {creditsLoading ? (
                      <span className="text-sm text-cyan-400">Loading...</span>
                    ) : credits ? (
                      <span className="text-sm text-cyan-300 font-medium">
                        Credits: {credits.remainingCredits}
                      </span>
                    ) : (
                      <span className="text-sm text-cyan-400">--</span>
                    )}
                  </div>
                  <button
                    onClick={forceRefreshCredits}
                    disabled={creditsLoading}
                    className="p-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
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
                  <Link href="/profile" className="text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                    Profile
                  </Link>
                  <span className="text-sm text-slate-300 max-w-[150px] truncate">
                    Welcome, {user.fullName || user.primaryEmailAddress?.emailAddress}
                  </span>
                  <SignOutButton>
                    <button className="px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              {/* 移动端积分显示 */}
              {user && (
                <div className="px-2 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-lg">
                  <span className="text-xs text-cyan-300 font-medium">
                    {creditsLoading ? '...' : credits?.remainingCredits || 0}
                  </span>
                </div>
              )}
              
              {/* 汉堡菜单按钮 */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-slate-300 hover:text-cyan-400 transition-colors"
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
            <div className="md:hidden border-t border-slate-700/50 bg-slate-800/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  href="/pricing" 
                  className="block px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Pricing
                </Link>
                <EnhancedFeedbackButton 
                  onClick={() => {
                    setShowFeedbackModal(true)
                    setShowMobileMenu(false)
                  }}
                  isMobile={true}
                />
                
                {user ? (
                  <>
                    <Link 
                      href="/profile" 
                      className="block px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Profile
                    </Link>
                    <div className="px-3 py-2 text-sm text-slate-400 truncate">
                      {user.fullName || user.primaryEmailAddress?.emailAddress}
                    </div>
                    <SignOutButton>
                      <button 
                        className="block w-full text-left px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Sign Out
                      </button>
                    </SignOutButton>
                  </>
                ) : (
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <button 
                      className="block w-full text-left px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-md transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-blue-900/80 to-slate-800 min-h-screen relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.15),transparent_50%)]"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(168,85,247,0.1),transparent_70%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* New User Credits Badge */}
            <div className="mb-6 flex justify-center">
              {!user ? (
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="group inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
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
                  className="group inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                >
                  <span className="mr-2 bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                    ✨
                  </span>
                  <Video className="w-4 h-4 mr-1" />
                  View Video Examples
                </button>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Create Stunning <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">ASMR Video</span> with
              <span className="block">our AI-powered <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Veo3 generator</span></span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              FREE credits for new users! Master ai video prompt creation with proven veo3 video prompt templates. 
              Generate professional AI videos in minutes using Google Veo3 AI technology. 
              Perfect for YouTube, TikTok creators and content makers - no editing skills required.
            </p>
            

            

          </div>

          {/* Main Content - Two Column Layout */}
          <div id="main-generator" className="grid lg:grid-cols-2 gap-8 items-stretch mb-20">
            {/* Left Panel - ASMR Controls */}
            <div className="bg-gradient-to-br from-stone-800 to-gray-900 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-700 overflow-hidden">
              
              {/* ASMR Type Selection */}
              <div className="p-8 border-b border-stone-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">Choose Video Prompt</h2>
                  <Link 
                    href="/video-showcase"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Video className="w-4 h-4" />
                    Video & Prompt Examples
                  </Link>
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">Select a proven ai video prompt template or create your own custom veo3 video prompt</p>
                
                {/* Quick Selection - Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {/* Default Custom Option */}
                  <button
                    onClick={() => handleASMRTypeChange('default')}
                    className={`p-2 sm:p-3 rounded-xl border transition-all text-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                      ${selectedASMRType === 'default'
                        ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                        : 'border-stone-600 hover:border-stone-500 bg-stone-700/50 hover:bg-stone-600/50 text-slate-300'
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
                        className={`p-2 sm:p-3 rounded-xl border transition-all text-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem] flex items-center justify-center
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                          ${selectedASMRType === type.id
                            ? 'border-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                            : 'border-stone-600 hover:border-stone-500 bg-stone-700/50 hover:bg-stone-600/50 text-slate-300'
                          }`}
                      >
                        <span className="block leading-tight">{type.name}</span>
                      </button>
                    )
                  })}
                  
                  {/* View All Button */}
                  <button
                    onClick={() => setShowAllTypesModal(true)}
                    className="p-2 sm:p-3 rounded-xl border border-stone-600 hover:border-stone-500 bg-stone-700/50 hover:bg-stone-600/50 text-slate-300 transition-all text-center flex items-center justify-center font-medium text-xs sm:text-sm min-h-[3rem] sm:min-h-[3.5rem]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
                  >
                    <span className="mr-1">⋯</span> All
                  </button>
                </div>
              </div>

              {/* Prompt Input Section */}
              <div className="p-8 border-b border-stone-700/50">
                <h3 className="text-xl font-semibold text-white mb-3">Customize Your Video Prompt</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {selectedASMRType === 'default' 
                    ? 'Create your own veo3 video prompt or ai video prompt for custom scenes'
                    : 'Edit this proven ai video prompt template or use it as-is'
                  }
                </p>
                
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={selectedASMRType === 'default' 
                    ? "Create your ai video prompt: describe lighting, camera angles, sounds, textures, and visual elements. Write a detailed veo3 video prompt for best results..."
                    : "Edit this ai video prompt template or use it as-is..."
                  }
                  className="w-full h-32 p-4 border border-stone-600 rounded-xl resize-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-stone-700/50 focus:bg-stone-600/70 text-white placeholder-slate-400 transition-colors"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-400">
                    {prompt.length}/500 characters
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
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
                          ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300'
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
                              ? `