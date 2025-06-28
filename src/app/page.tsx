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
  
  // 使用积分钩子
  const { credits, loading: creditsLoading, refetch: refetchCredits, forceRefresh: forceRefreshCredits } = useCredits(!!user && userSynced)

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
      
      // 清理URL参数（可选）
      window.history.replaceState({}, '', window.location.pathname + '#main-generator')
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/favicon.ico" 
                  alt="CuttingASMR Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CuttingASMR.org</h1>
            </div>
            <div className="flex items-center space-x-4">
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
                  <span className="text-sm text-gray-600">
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
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
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
          <div className="text-center mb-20">
            {/* New User Credits Badge */}
            <div className="mb-6 flex justify-center">
              {!user ? (
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <button className="group inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
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
                  className="group inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <span className="mr-2 bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                    ✨
                  </span>
                  <Video className="w-4 h-4 mr-1" />
                  View Video Examples
                </button>
              )}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              AI ASMR Generator
              <span className="block text-emerald-700">
                Powered by Veo3
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              FREE credits for new users! Perfect for YouTube, TikTok creators and ASMR makers. 
              Generate professional AI videos in minutes with advanced Google Veo3 AI technology. 
              Best AI video generator - no editing skills required.
            </p>
            
            {/* Credits Display */}
            {user && (
              <div className="inline-flex items-center bg-white rounded-2xl px-6 py-4 shadow-lg border border-stone-200 mb-12">
                <Zap className="w-5 h-5 text-amber-600 mr-2" />
                                 <span className="font-medium text-gray-800">
                   {creditsLoading ? 'Loading...' : `${credits?.remainingCredits || 0} Credits Available`}
                 </span>
                 <span className="text-gray-500 ml-2">• 10 credits per video</span>
              </div>
            )}
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
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {/* Default Custom Option */}
                  <button
                    onClick={() => handleASMRTypeChange('default')}
                    className={`p-4 rounded-xl border transition-all text-center font-medium ${
                      selectedASMRType === 'default'
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                        : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-gray-700'
                    }`}
                  >
                    Default
                  </button>

                  {/* Featured ASMR Types */}
                  {['glass-fruit-cutting', 'ice-cube-carving', 'metal-sheet-cutting', 'fireplace', 'squeeze-toy', 'minecraft-block-cutting', 'electronic-device-cutting'].map((typeId) => {
                    const type = allAsmrTypes.find(t => t.id === typeId)
                    if (!type) return null
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleASMRTypeChange(type.id)}
                        className={`p-4 rounded-xl border transition-all text-center font-medium ${
                          selectedASMRType === type.id
                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                            : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-gray-700'
                        }`}
                      >
                        {type.name}
                      </button>
                    )
                  })}
                  
                  {/* View All Button */}
                  <button
                    onClick={() => setShowAllTypesModal(true)}
                    className="p-4 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-gray-700 transition-all text-center flex items-center justify-center font-medium"
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
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300'
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
                    
                    {/* Credits insufficient notice */}
                    {user && userSynced && !creditsLoading && credits && !CREDITS_CONFIG.canCreateVideo(credits.remainingCredits) && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-orange-800 mb-1">Credits Needed</h4>
                            <p className="text-sm text-orange-700 mb-3 leading-relaxed">
                              You need {CREDITS_CONFIG.VIDEO_COST} credits to generate a video. 
                              You currently have {credits.remainingCredits} credits remaining.
                            </p>
                            <Link href="/pricing" className="inline-block">
                              <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                                Get More Credits
                              </button>
                            </Link>
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
                      <button className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
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

          {/* How to Create ASMR Video Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/50 p-12 mb-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">How to Create an ASMR Video with Veo3 AI</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Generate a relaxing ASMR video in just three simple steps with our AI-powered Veo3 platform:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-center shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">
                    1
                  </div>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Choose ASMR Scene</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Select from pre-built templates or create your own custom ASMR concept</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-center shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">
                    2
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Customize Your Prompt</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Describe your ideal ASMR scene with specific details about sounds, visuals, and mood</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-center shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">
                    3
                  </div>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Generate & Share</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">AI creates your video in 3-5 minutes. Download and share on YouTube, TikTok, or any platform</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="#main-generator">
                <button className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  Create ASMR Video Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>


                </div>
              </div>
              
      {/* FAQ Section for SEO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-stone-200/50">
                      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-16">Frequently Asked Questions</h2>
              
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is ASMR generator with Veo3 AI technology?</h3>
                <p className="text-gray-600">Our AI video generator uses advanced Google Veo3 AI technology to transform prompts into high-quality, relaxing ASMR videos. Best AI video maker for creators - generate professional therapeutic content without traditional recording equipment or editing skills.</p>
              </div>
              
                <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How to make AI ASMR videos without equipment?</h3>
                <p className="text-gray-600">Yes! Our AI video maker creates professional ASMR content instantly without microphones or editing skills. Transform simple prompts into 4K quality ASMR videos with spatial audio and realistic physics effects - perfect for content creators!</p>
      </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect AI video generator for YouTube Shorts & TikTok Shorts?</h3>
                <p className="text-gray-600">Absolutely! Our Google Veo AI generates ASMR videos optimized for YouTube Shorts, TikTok Shorts, and social media platforms. Create engaging video content that drives views and subscriber growth for content creators.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How can content creators scale their ASMR YouTube channel with Veo3 AI?</h3>
                <p className="text-gray-600">Content creators can generate multiple ASMR videos daily using our best AI video generator. Create consistent ASMR content ideas for your YouTube channel without time-consuming setup - perfect for building a profitable ASMR creator business with meditation and sleep content.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What ASMR content ideas can Google Veo3 AI create?</h3>
                <p className="text-gray-600">Our AI video generator creates amazing content: glass cutting, fruit slicing, knife cutting, lava effects, magma visuals, crystal breaking, and water sounds. Transform any ASMR video idea into reality with our best AI video generator - perfect for stress relief videos and sleep ASMR content.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do AI-generated videos perform well on YouTube and TikTok?</h3>
                <p className="text-gray-600">Yes! Our AI video generator creates the best ASMR videos that engage audiences across platforms. Many content creators use our Veo3 AI to boost their posting frequency with glass cutting and fruit slicing content, growing their follower base on YouTube Shorts and TikTok Shorts.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Best video length for TikTok Shorts and YouTube Shorts?</h3>
                <p className="text-gray-600">For TikTok Shorts, 10-15 second video loops work best for maximum engagement. For YouTube Shorts, our AI video generator creates seamless loops perfect for longer immersive content and meditation videos. Our best AI video maker optimizes duration automatically.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is your ASMR video generator free to use?</h3>
                <p className="text-gray-600">We offer free credits for new users to get started, plus flexible paid plans for extensive use. Our transparent credit system means you only pay for rendered videos - no subscriptions required. Perfect for testing before committing.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much does it cost for content creators?</h3>
                <p className="text-gray-600">Each AI-generated ASMR video costs just 10 credits (less than $1). For content creators, our packages start at $9.90 for 115 credits - creating 11+ videos. Much more cost-effective than traditional video production.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How quickly can I create AI content for my ASMR channel?</h3>
                <p className="text-gray-600">Generate professional ASMR videos in just 3-5 minutes! Perfect for content creators who need consistent ASMR video ideas. Transform prompts into daily content for TikTok Shorts or weekly uploads for YouTube channels effortlessly.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Does Veo3 AI create best ASMR videos with binaural audio?</h3>
                <p className="text-gray-600">Yes! Our Veo3 AI generates the best ASMR videos with built-in 3D spatial audio and binaural sound generation. Create immersive therapeutic audio that provides authentic ASMR tingles - perfect for sleep ASMR generator needs.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I customize AI-generated ASMR content for my brand?</h3>
                <p className="text-gray-600">Absolutely! Content creators can customize every aspect through detailed prompts. Our Google AI creates unique ASMR content ideas with glass cutting, lava effects, and magma visuals that match your YouTube channel's style and audience preferences. Perfect for building a distinctive ASMR creator identity.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-emerald-800 mb-2">Best AI Video Generator for Content Creators & Social Media Success</h4>
                <p className="text-emerald-700 leading-relaxed">
                  Powered by advanced Google Veo3 AI, our AI ASMR generator helps content creators build successful YouTube Shorts and TikTok Shorts channels. 
                  Create viral-ready ASMR content with glass cutting, fruit slicing, and stress relief videos that engage audiences and grow your subscriber base automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced AI Video Generation Technology Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-200/50 p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Advanced AI Video Generation Technology with Veo3</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powered by Google Veo3 AI, our ASMR generator creates professional therapeutic videos 
              automatically. The best AI video generator technology analyzes your prompts and transforms them into high-quality ASMR content with precision - perfect for content creators and stress relief videos.
            </p>
            </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-emerald-600" />
            </div>
              <h3 className="font-semibold text-gray-800 mb-3">Google Veo3 AI Video Engine</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Advanced Google AI technology that transforms prompts into professional ASMR videos with sleep-inducing effects</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-7 h-7 text-blue-600" />
          </div>
              <h3 className="font-semibold text-gray-800 mb-3">Smart AI Video Creator Tools</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Intelligent AI algorithms adapt to your ASMR content ideas and create personalized experiences for content creators</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Best AI Video Maker for YouTube & TikTok</h3>
              <p className="text-sm text-gray-600 leading-relaxed">AI video production optimized for YouTube Shorts and TikTok Shorts - creates viral-ready ASMR content in minutes</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Advanced ASMR Content Ideas Generator</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Veo3 AI understands glass cutting, fruit slicing, lava effects, and knife sounds - automatically creates meditation and stress relief experiences</p>
            </div>
          </div>
          
          <div className="bg-stone-50 rounded-xl p-6 mt-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best AI Video Technology Powered by Google Veo3</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our ASMR generator utilizes cutting-edge Google Veo3 AI technology to transform prompts into therapeutic content automatically. 
                  Perfect for content creators - the AI analyzes your ASMR video ideas and generates professional stress relief videos, sleep ASMR content, and meditation videos for wellness purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Footer */}
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
                    alt="CuttingASMR Logo" 
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
