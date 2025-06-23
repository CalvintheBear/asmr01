'use client'

import { useState, useEffect } from 'react'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { Play, Sparkles, Video, Download, Settings, Zap, Heart, Star, Clock, Users, Volume2, Headphones, Check } from 'lucide-react'
import Link from 'next/link'
import ASMRVideoResult from '@/components/ASMRVideoResult'
import CreemPaymentButton from '@/components/CreemPaymentButton'
import { useVideoGeneration } from '@/hooks/useVideoGeneration'
import { useCredits } from '@/hooks/useCredits'
import { CREDITS_CONFIG } from '@/lib/credits-config'

export default function ASMRVideoStudio() {
  const { user, isLoaded } = useUser()
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

  // 默认选项（自由编辑）
  const defaultOption = {
    id: 'default',
    name: 'Custom Prompt',
    description: 'Create your own ASMR scene with custom description',
    prompt: ''
  }

  // ASMR类型分类定义
  const asmrCategories = [
    {
      id: 'texture-therapy',
      name: 'Texture & Aromatherapy',
      icon: '🌿',
      types: [
        {
          id: 'ice-texture',
          name: 'Ice Crystallization ASMR',
          description: 'Peaceful ice formation and natural crystal sounds for relaxation',
          prompt: 'Gentle close-up of ice crystals forming naturally on glass surface. Camera: Macro lens capturing crystalline patterns and light refraction. Lighting: Soft studio lighting highlighting ice transparency and natural formations. Audio: Gentle crystallization sounds, peaceful settling noises, calming natural ice formation sounds for stress relief and meditation.'
        },
        {
          id: 'hot-iron',
          name: 'Hot Iron Forging',
          description: 'Industrial blade cutting glowing hot metal with sparks and heat',
          prompt: 'Close-up of glowing red-hot metal being shaped by blacksmith hammer on anvil. Camera: Side angle capturing hammer strikes and sparks flying. Lighting: Dramatic forge lighting with glowing metal illumination. Audio: Rhythmic hammer strikes, metal ringing, crackling fire, and sizzling sounds of hot metal cooling.'
        },
        {
          id: 'golden-apple-texture',
          name: 'Golden Apple Texture ASMR',
          description: 'Therapeutic golden fruit textures with gentle natural sounds',
          prompt: 'Peaceful macro view of golden apple with natural texture transitions and gentle surface changes. Camera: Close-up focusing on fruit texture with warm metallic reflections and natural patterns. Lighting: Soft golden lighting enhancing surface details and creating calming ambiance. Audio: Gentle texture sounds, peaceful natural settling, therapeutic audio for relaxation and mindfulness.'
        },
        {
          id: 'lime-texture',
          name: 'Lime Aromatherapy ASMR',
          description: 'Therapeutic citrus textures and natural aromatherapy sounds',
          prompt: 'Peaceful macro view of fresh lime with natural texture exploration and gentle citrus oil release. Camera: Close-up focusing on fruit surface textures and natural juice formation. Lighting: Natural bright lighting enhancing vibrant green colors and droplet formations. Audio: Gentle texture sounds, natural citrus aromatherapy audio, peaceful dripping sounds for stress relief and mindfulness.'
        },
        {
          id: 'red-crystal-sphere',
          name: 'Red Crystal Sphere Cutting',
          description: 'Knife cutting translucent red crystal with bubble chambers',
          prompt: 'Surreal scene of knife cutting through translucent red crystal sphere with internal bubble chambers. Camera: Macro lens capturing light refraction through crystal materials. Lighting: Red ambient lighting creating prismatic effects. Audio: Unique crystal chiming sounds, delicate breaking noises, and satisfying cutting through crystalline textures.'
        },
        {
          id: 'crystal-apple',
          name: 'Crystal Apple Cutting',
          description: 'Slicing translucent green crystal apple with prismatic effects',
          prompt: 'Artistic scene of knife cutting through transparent green crystal apple with prismatic light effects. Camera: Macro lens capturing rainbow light refraction. Lighting: Multi-colored lighting creating spectacular visual effects. Audio: Crystal chiming sounds, delicate breaking, and magical tinkling noises.'
        },
        {
          id: 'crystal-pineapple',
          name: 'Crystal Pineapple Cutting',
          description: 'Cutting golden crystal pineapple with honeycomb structure',
          prompt: 'Fantasy scene of knife cutting through golden crystal pineapple with honeycomb internal structure. Camera: Close-up capturing geometric patterns and light reflections. Lighting: Golden ambient lighting highlighting crystal facets. Audio: Geometric breaking sounds, crystal resonance, and satisfying structural collapse.'
        },
        {
          id: 'crystal-burger',
          name: 'Crystal Burger Cutting',
          description: 'Slicing layered crystal burger with rainbow light effects',
          prompt: 'Surreal scene of knife cutting through transparent crystal burger with layers of colorful crystal ingredients. Camera: Macro lens capturing light refraction through crystal materials. Lighting: Rainbow lighting creating prismatic effects. Audio: Unique crystal chiming sounds, delicate breaking noises, and satisfying cutting through crystalline textures.'
        }
      ]
    },
    {
      id: 'nature',
      name: 'Natural Environment',
      icon: '🌿',
      types: [
        {
          id: 'rain-window',
          name: 'Rain on Window',
          description: 'Raindrops hitting window with sliding water droplets',
          prompt: 'Close-up of raindrops hitting window glass with sliding water droplets and atmospheric lighting. Camera: Macro lens capturing water droplet formation and movement. Lighting: Soft natural lighting from window. Audio: Gentle rain tapping, water sliding sounds, and peaceful ambient atmosphere.'
        },
        {
          id: 'forest-rain',
          name: 'Forest Rain',
          description: 'Rain falling on leaves in a lush forest',
          prompt: 'Serene forest scene with rain falling on lush green leaves and forest floor. Camera: Various angles capturing rain droplets on leaves and ground. Lighting: Natural forest lighting filtered through canopy. Audio: Gentle rain on leaves, distant thunder, forest ambiance, and peaceful nature sounds.'
        },
        {
          id: 'rain-umbrella',
          name: 'Rain on Umbrella',
          description: 'Close-up rain drops hitting umbrella surface',
          prompt: 'Intimate view of rain droplets hitting umbrella surface with water running down edges. Camera: Overhead and side angles capturing water patterns. Lighting: Soft overcast lighting. Audio: Rhythmic rain tapping on umbrella fabric, water dripping, and ambient rain sounds.'
        },
        {
          id: 'ocean-waves',
          name: 'Ocean Waves',
          description: 'Gentle waves lapping against the shore',
          prompt: 'Peaceful ocean scene with gentle waves lapping against sandy shore and rocks. Camera: Low angle capturing wave movement and foam patterns. Lighting: Natural beach lighting with sun reflections. Audio: Soft wave sounds, water flowing over rocks, and distant ocean ambiance.'
        },
        {
          id: 'fireplace',
          name: 'Fireplace Crackling',
          description: 'Wood burning with crackling sounds and visual flames',
          prompt: 'Warm close-up of wooden logs burning in stone fireplace with dancing orange flames. Camera: Steady shot focusing on flame movement and glowing embers. Lighting: Natural fire lighting creating warm ambiance. Audio: Wood crackling, logs settling, gentle popping sounds, and soft whooshing of flames.'
        },
        {
          id: 'flowing-water',
          name: 'Flowing Water',
          description: 'Water flowing over stones and rocks',
          prompt: 'Serene water stream flowing over smooth stones and rocks in natural setting. Camera: Various angles capturing water movement and stone textures. Lighting: Natural outdoor lighting with water reflections. Audio: Gentle water flowing, bubbling sounds, and peaceful stream ambiance.'
        },
        {
          id: 'forest-ambiance',
          name: 'Forest Ambiance',
          description: 'Bird songs, wind through leaves, and nature sounds',
          prompt: 'Peaceful forest environment with sunlight filtering through trees and gentle wind movement. Camera: Steady shots of forest canopy and tree details. Lighting: Natural dappled sunlight through leaves. Audio: Bird songs, wind through leaves, rustling sounds, and serene nature ambiance.'
        }
      ]
    },
    {
      id: 'objects',
      name: 'Object Interaction',
      icon: '🔊',
      types: [
        {
          id: 'wood-tapping',
          name: 'Wood Tapping',
          description: 'Gentle tapping on wooden surfaces',
          prompt: 'Close-up of fingers gently tapping on various wooden surfaces with different textures. Camera: Macro lens capturing finger movement and wood grain. Lighting: Warm lighting highlighting wood textures. Audio: Soft wooden tapping sounds, finger nail clicks, and rhythmic patterns.'
        },
        {
          id: 'metal-tapping',
          name: 'Metal Tapping',
          description: 'Soft tapping on metal objects',
          prompt: 'Detailed view of fingers tapping on various metal objects and surfaces. Camera: Close-up capturing finger movements and metal reflections. Lighting: Clean lighting highlighting metal surfaces. Audio: Gentle metallic tapping, resonant sounds, and rhythmic metal percussion.'
        },
        {
          id: 'glass-tapping',
          name: 'Glass Tapping',
          description: 'Delicate tapping on glass surfaces',
          prompt: 'Artistic view of fingers delicately tapping on various glass surfaces and objects. Camera: Macro lens capturing finger precision and glass clarity. Lighting: Bright lighting creating glass reflections. Audio: Crystal clear glass tapping, resonant chimes, and delicate percussion sounds.'
        },
        {
          id: 'texture-scratching',
          name: 'Texture Scratching',
          description: 'Scratching different textured materials',
          prompt: 'Close-up of fingers scratching various textured materials including fabric, wood, and stone. Camera: Macro lens capturing texture details and finger movement. Lighting: Directional lighting emphasizing texture patterns. Audio: Diverse scratching sounds, material friction, and tactile audio textures.'
        },
        {
          id: 'page-turning',
          name: 'Page Turning',
          description: 'Turning book pages with paper rustling sounds',
          prompt: 'Intimate view of hands turning pages in an old book with visible paper texture. Camera: Close-up capturing page movement and paper details. Lighting: Soft reading light creating paper shadows. Audio: Gentle page turning, paper rustling, book spine sounds, and quiet reading ambiance.'
        },
        {
          id: 'package-unwrapping',
          name: 'Package Unwrapping',
          description: 'Unwrapping paper and plastic packages',
          prompt: 'Detailed view of hands carefully unwrapping packages with various materials including paper, plastic, and tape. Camera: Close-up capturing unwrapping motion and material textures. Lighting: Clean lighting highlighting package details. Audio: Paper crinkling, plastic rustling, tape peeling, and satisfying unwrapping sounds.'
        },
        {
          id: 'small-objects',
          name: 'Small Objects',
          description: 'Arranging wooden blocks, beads, and small items',
          prompt: 'Artistic arrangement of small wooden blocks, beads, and miniature objects on clean surface. Camera: Overhead and close-up angles capturing object details. Lighting: Soft ambient lighting highlighting object textures. Audio: Gentle object placement, wooden clicks, bead rolling, and quiet arrangement sounds.'
        },
        {
          id: 'keyboard',
          name: 'Keyboard Typing',
          description: 'Gentle typing sounds on different keyboards',
          prompt: 'Professional close-up of fingers typing on premium mechanical keyboard with individual key switches. Camera: Side and overhead angles capturing finger precision and key movement. Lighting: Clean desk lighting highlighting keyboard details. Audio: Satisfying tactile clicks, key depression sounds, typing rhythm patterns.'
        }
      ]
    },
    {
      id: 'personal-care',
      name: 'Personal Care',
      icon: '💆',
      types: [
        {
          id: 'hair-brushing',
          name: 'Hair Brushing',
          description: 'Hair cutting, washing, brushing, and blow drying',
          prompt: 'Relaxing hair care routine with brushing, washing, and styling. Camera: Close-up capturing hair movement and brush strokes. Lighting: Soft beauty lighting highlighting hair texture. Audio: Gentle brushing sounds, water flowing, hair movement, and peaceful grooming ambiance.'
        },
        {
          id: 'nail-care',
          name: 'Nail Care',
          description: 'Nail trimming, polishing, and hand massage',
          prompt: 'Detailed view of manicure process with nail file shaping fingernails on elegant hands. Camera: Macro lens capturing nail texture and filing motion. Lighting: Soft beauty lighting highlighting hand elegance. Audio: Gentle filing sounds, nail clippers clicking, cuticle care, and soft brushing noises.'
        },
        {
          id: 'medical-exam',
          name: 'Medical Examination',
          description: 'Gentle medical checkup with stethoscope sounds',
          prompt: 'Professional medical examination scene with gentle checkup procedures using stethoscope and medical tools. Camera: Close-up capturing medical instruments and gentle movements. Lighting: Clean clinical lighting. Audio: Stethoscope sounds, gentle medical procedures, and calming healthcare ambiance.'
        }
      ]
    },
    {
      id: 'relaxation',
      name: 'Sleep & Relaxation',
      icon: '😴',
      types: [
        {
          id: 'white-noise',
          name: 'White Noise',
          description: 'Fan sounds, air conditioner, and ambient noise',
          prompt: 'Calming white noise environment with fan rotating and air conditioning ambiance. Camera: Steady shots of fan movement and ambient lighting. Lighting: Soft ambient lighting creating peaceful atmosphere. Audio: Consistent fan sounds, air conditioner humming, and relaxing white noise patterns.'
        },
        {
          id: 'guided-relaxation',
          name: 'Guided Relaxation',
          description: 'Soft-spoken relaxation and meditation guidance',
          prompt: 'Peaceful meditation environment with soft ambient lighting and calming visuals. Camera: Steady, serene shots creating meditative atmosphere. Lighting: Warm, dim lighting promoting relaxation. Audio: Gentle guided meditation, soft-spoken relaxation instructions, and peaceful ambient sounds.'
        },
        {
          id: 'rhythmic-sounds',
          name: 'Rhythmic Sounds',
          description: 'Regular gentle tapping and rhythmic patterns',
          prompt: 'Artistic arrangement creating gentle rhythmic patterns with various soft objects. Camera: Close-up capturing rhythmic movements and pattern details. Lighting: Soft ambient lighting highlighting rhythmic motion. Audio: Regular gentle tapping, rhythmic patterns, and soothing repetitive sounds.'
        }
      ]
    }
  ]

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

  const [freeTrialsLeft, setFreeTrialsLeft] = useState(2)
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const { generationStatus, generateVideo, getVideoDetails, get1080PVideo, resetGeneration, isGenerating } = useVideoGeneration()

  const handleGenerate = async () => {
    // 检查积分是否足够
    if (user && credits && !CREDITS_CONFIG.canCreateVideo(credits.remainingCredits)) {
      alert(`Insufficient credits! Video generation requires ${CREDITS_CONFIG.VIDEO_COST} credits, you currently have ${credits.remainingCredits} credits remaining. Please visit the pricing page to purchase more credits.`)
      return
    }
    
    if (!isSubscribed && freeTrialsLeft <= 0) {
      alert('You have used all your free trials. Please subscribe to continue generating AI ASMR videos.')
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
      
      // 减少免费试用次数
      if (!isSubscribed && freeTrialsLeft > 0) {
        setFreeTrialsLeft(prev => prev - 1)
      }
    } catch (error) {
      console.error('生成视频失败:', error)
      alert('Video generation failed, please try again')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/logo.svg" 
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
                  <div className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-lg">
                    {creditsLoading ? (
                      <span className="text-sm text-purple-600">Loading...</span>
                    ) : credits ? (
                      <span className="text-sm text-purple-700 font-medium">
                        Credits: {credits.remainingCredits}
                      </span>
                    ) : (
                      <span className="text-sm text-purple-600">--</span>
                    )}
                  </div>
                  <button
                    onClick={forceRefreshCredits}
                    disabled={creditsLoading}
                    className="p-1 text-purple-600 hover:text-purple-700 disabled:opacity-50 transition-colors"
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
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-purple-50 via-indigo-50 via-pink-50 to-cyan-50 min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-300/15 to-purple-300/15 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              AI ASMR Generator
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powered by Gemini Veo3
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create professional AI ASMR videos using cutting-edge Gemini Veo3 artificial intelligence. 
              Our advanced AI video generator transforms your ideas into therapeutic ASMR content automatically.
              <span className="block mt-2 text-green-600 font-semibold">
                FREE credits for new users!
              </span>
            </p>
            
            {/* Credits Display */}
            {user && (
              <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200 mb-8">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                                 <span className="font-medium text-gray-900">
                   {creditsLoading ? 'Loading...' : `${credits?.remainingCredits || 0} Credits Available`}
                 </span>
                 <span className="text-gray-500 ml-2">• 10 credits per video</span>
              </div>
            )}
          </div>

          {/* Main Content - Two Column Layout */}
          <div id="main-generator" className="grid lg:grid-cols-2 gap-8 items-start mb-12">
            {/* Left Panel - ASMR Controls */}
            <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden h-fit transform hover:scale-[1.02] transition-all duration-300">
              
              {/* ASMR Type Selection */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choose ASMR Type</h2>
                <p className="text-gray-600 mb-6">Select a template or create your own custom ASMR scene</p>
                
                {/* Quick Selection - Grid Layout */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {/* Default Custom Option */}
                  <button
                    onClick={() => handleASMRTypeChange('default')}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      selectedASMRType === 'default'
                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Default
                  </button>

                  {/* Quick Template Examples - Show more in grid */}
                  {asmrCategories.slice(0, 3).map((category) => 
                    category.types.slice(0, category === asmrCategories[0] ? 3 : 2).map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleASMRTypeChange(type.id)}
                        className={`p-3 rounded-lg border transition-all text-center ${
                          selectedASMRType === type.id
                            ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))
                  )}
                  
                  {/* View All Button */}
                  <button
                    onClick={() => setShowAllTypesModal(true)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-all text-center flex items-center justify-center"
                  >
                    <span className="mr-1">⋯</span> All
                  </button>
                </div>
              </div>

              {/* Prompt Input Section */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Your ASMR Video</h3>
                <p className="text-gray-600 mb-4">
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
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <div className="p-6">
                {user ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating}
                                              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        !prompt.trim() || isGenerating
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 relative overflow-hidden group'
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
                          <span>Generate ASMR Video (10 Credits)</span>
                        </div>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Sign in to Generate Videos</h3>
                    <p className="text-blue-700 mb-4">
                      Create your account to start generating AI ASMR videos with our advanced tools.
                    </p>
                    <SignInButton mode="modal" fallbackRedirectUrl="/">
                      <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
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
              />
            </div>
          </div>

          {/* How to Create ASMR Video Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Create an ASMR Video with Veo3 AI</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Generate a relaxing ASMR video in just three simple steps with our AI-powered Veo3 platform:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-center shadow-lg border border-purple-200/50 transform group-hover:scale-105 transition-all duration-300">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    1
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose ASMR Scene</h3>
                  <p className="text-gray-600 text-sm">Select from pre-built templates or create your own custom ASMR concept</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-indigo-100/80 to-cyan-100/80 backdrop-blur-sm rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-center shadow-lg border border-indigo-200/50 transform group-hover:scale-105 transition-all duration-300">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    2
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Customize Your Prompt</h3>
                  <p className="text-gray-600 text-sm">Describe your ideal ASMR scene with specific details about sounds, visuals, and mood</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-emerald-100/80 to-teal-100/80 backdrop-blur-sm rounded-2xl p-8 h-64 flex flex-col items-center justify-center text-center shadow-lg border border-emerald-200/50 transform group-hover:scale-105 transition-all duration-300">
                  <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    3
                  </div>
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Generate & Share</h3>
                  <p className="text-gray-600 text-sm">AI creates your video in 3-5 minutes. Download and share on YouTube, TikTok, or any platform</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="#main-generator">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                  Create ASMR Video Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Therapeutic Benefits Section */}
          <div className="bg-gradient-to-br from-white via-cyan-50/30 to-indigo-50/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced AI Video Generation Technology</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Powered by Gemini Veo3 artificial intelligence, our AI ASMR generator creates professional therapeutic videos 
                automatically. The AI analyzes your prompts and generates high-quality ASMR content with precision.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Gemini Veo3 AI Engine</h3>
                <p className="text-sm text-gray-600">Advanced artificial intelligence that understands ASMR triggers and generates professional videos</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Customization</h3>
                <p className="text-sm text-gray-600">Intelligent AI algorithms adapt to your prompts and create personalized ASMR experiences</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Automated Video Production</h3>
                <p className="text-sm text-gray-600">AI-driven video generation that produces high-quality ASMR content in minutes</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Intelligent Scene Recognition</h3>
                <p className="text-sm text-gray-600">AI understands ASMR concepts and automatically creates therapeutic audio-visual experiences</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Advanced AI Technology Powered by Gemini Veo3</h4>
                  <p className="text-sm text-blue-800">
                    Our AI ASMR generator utilizes cutting-edge Gemini Veo3 artificial intelligence to create therapeutic content automatically. 
                    The AI analyzes your prompts and generates professional ASMR videos for wellness and relaxation purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section for SEO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-br from-white via-gray-50/30 to-slate-50/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/40">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect for YouTube & TikTok content creators?</h3>
                <p className="text-gray-600">Absolutely! Our AI generates ASMR videos optimized for social media platforms. Create engaging content for YouTube, TikTok, Instagram, and other platforms with professional quality that drives views and subscriber growth.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How can content creators scale their ASMR channel?</h3>
                <p className="text-gray-600">Content creators can generate multiple ASMR videos daily using our AI. Create consistent, high-quality content for your audience without the time-consuming setup, filming, and editing process. Perfect for building a profitable ASMR channel.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do AI-generated videos perform well on social media?</h3>
                <p className="text-gray-600">Yes! Our AI creates professional-quality ASMR content that engages audiences across platforms. Many content creators use our generated videos to boost their posting frequency and grow their follower base on YouTube and TikTok.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much does it cost for content creators?</h3>
                <p className="text-gray-600">Each AI-generated ASMR video costs just 10 credits (less than $1). For content creators, our packages start at $9.90 for 115 credits - creating 11+ videos. Much more cost-effective than traditional video production.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How quickly can I create content for my channel?</h3>
                <p className="text-gray-600">Generate professional ASMR videos in just 3-5 minutes! Perfect for content creators who need to maintain consistent posting schedules. Create daily content for TikTok or weekly uploads for YouTube effortlessly.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I customize videos for my brand/niche?</h3>
                <p className="text-gray-600">Absolutely! Content creators can customize every aspect through detailed prompts. Create unique ASMR content that matches your channel's style, branding, and audience preferences. Perfect for building a distinctive content creator identity.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm rounded-xl border border-purple-200/50 shadow-lg">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">AI Content Creation for Social Media Success</h4>
                <p className="text-purple-800">
                  Powered by advanced Gemini Veo3 AI, our generator helps content creators build successful YouTube and TikTok channels. 
                  Create viral-ready ASMR content that engages audiences and grows your subscriber base automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Floating decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing ASMR Videos?</h2>
          <p className="text-xl mb-8 opacity-90">
            Choose from our flexible credit packages and start generating AI ASMR videos today
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">115+ Credits</div>
              <div className="text-sm opacity-75">From $9.9</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 border-2 border-white/30">
              <div className="text-2xl font-bold">355+ Credits</div>
              <div className="text-sm opacity-75">From $30</div>
              <div className="text-xs mt-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full inline-block">Most Popular</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">1450+ Credits</div>
              <div className="text-sm opacity-75">From $99</div>
            </div>
          </div>
          <Link 
            href="/pricing"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            View All Pricing Plans
          </Link>
          <p className="text-sm mt-4 opacity-75">
            10 Credits = 1 AI ASMR Video • Credits Never Expire
          </p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
        {/* Footer background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
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
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      selectedASMRType === 'default'
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <h5 className={`font-medium ${
                        selectedASMRType === 'default' ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {defaultOption.name}
                      </h5>
                      <p className={`text-sm leading-relaxed ${
                        selectedASMRType === 'default' ? 'text-purple-700' : 'text-gray-600'
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
                          className={`p-4 rounded-lg border transition-all text-left ${
                            selectedASMRType === type.id
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="space-y-1">
                            <h5 className={`font-medium ${
                              selectedASMRType === type.id ? 'text-purple-900' : 'text-gray-900'
                            }`}>
                              {type.name}
                            </h5>
                            <p className={`text-sm leading-relaxed ${
                              selectedASMRType === type.id ? 'text-purple-700' : 'text-gray-600'
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
