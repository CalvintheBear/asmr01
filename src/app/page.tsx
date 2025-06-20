'use client'

import { useState } from 'react'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { Play, Sparkles, Video, Download, Settings, Zap, Heart, Star, Clock, Users, Volume2, Headphones } from 'lucide-react'
import Link from 'next/link'
import ASMRVideoResult from '@/components/ASMRVideoResult'
import CreemPaymentButton from '@/components/CreemPaymentButton'
import { useVideoGeneration } from '@/hooks/useVideoGeneration'

export default function ASMRVideoStudio() {
  const { user, isLoaded } = useUser()
  const [selectedASMRType, setSelectedASMRType] = useState('keyboard')
  const [prompt, setPrompt] = useState('Professional close-up of fingers typing on premium mechanical keyboard with individual key switches. Camera: Side and overhead angles capturing finger precision and key movement. Lighting: Clean desk lighting highlighting keyboard details. Audio: Satisfying tactile clicks, key depression sounds, typing rhythm patterns.')
  const [showAllTypes, setShowAllTypes] = useState(false)

  // ASMR类型分类定义
  const asmrCategories = [
    {
      id: 'cutting',
      name: 'Cutting & Slicing',
      icon: '🔪',
      types: [
        {
          id: 'ice-cutting',
          name: 'Ice Cutting ASMR',
          description: 'Satisfying ice block cutting with crystal clear sounds',
          prompt: 'Extreme close-up of sharp knife slicing through crystal-clear ice cubes on marble cutting board. Camera: Overhead and side angles capturing ice fragments scattering. Lighting: Bright studio lighting highlighting ice transparency and knife blade sharpness. Audio: Crisp cracking sounds, ice fragments hitting surface, knife cutting through solid ice with precision.'
        },
        {
          id: 'hot-iron',
          name: 'Hot Iron Forging',
          description: 'Industrial blade cutting glowing hot metal with sparks and heat',
          prompt: 'Close-up of glowing red-hot metal being shaped by blacksmith hammer on anvil. Camera: Side angle capturing hammer strikes and sparks flying. Lighting: Dramatic forge lighting with glowing metal illumination. Audio: Rhythmic hammer strikes, metal ringing, crackling fire, and sizzling sounds of hot metal cooling.'
        },
        {
          id: 'golden-apple',
          name: 'Golden Apple Cutting',
          description: 'Slicing metallic golden apple with satisfying crack sounds',
          prompt: 'Macro shot of sharp knife cutting through golden metallic apple with crystalline interior. Camera: Close-up focusing on knife blade and fruit texture with metallic reflections. Lighting: Warm golden lighting enhancing metallic surface and juice droplets. Audio: Satisfying metallic cutting sounds, crisp breaking, and liquid dripping onto cutting board.'
        },
        {
          id: 'lime-cutting',
          name: 'Lime Cutting ASMR',
          description: 'Fresh lime being sliced with juice squirting and citrus oil',
          prompt: 'Macro shot of sharp knife cutting through fresh lime, revealing juicy interior and releasing citrus oils. Camera: Close-up focusing on knife blade and fruit texture. Lighting: Natural bright lighting enhancing lime green color and juice droplets. Audio: Clean cutting sounds, citrus squirting, juice dripping onto cutting board.'
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
    
    const selectedType = allAsmrTypes.find(type => type.id === typeId)
    if (selectedType) {
      setPrompt(selectedType.prompt)
    }
  }

  const [freeTrialsLeft, setFreeTrialsLeft] = useState(2)
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const { generationStatus, generateVideo, getVideoDetails, get1080PVideo, resetGeneration, isGenerating } = useVideoGeneration()

  const handleGenerate = async () => {
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
      
      // 减少免费试用次数
      if (!isSubscribed && freeTrialsLeft > 0) {
        setFreeTrialsLeft(prev => prev - 1)
      }
    } catch (error) {
      console.error('生成视频失败:', error)
      alert('视频生成失败，请重试')
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
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    个人信息
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
            Generate professional ASMR content with our advanced AI technology. Perfect for TikTok &amp; YouTube creators, ASMR enthusiasts, and content makers. Start with 2 free trials, then purchase credit packs for unlimited generations.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Generator */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate ASMR Video</h2>
              
              {/* ASMR Type Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Choose ASMR Type</h3>
                  <button
                    onClick={() => setShowAllTypes(!showAllTypes)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
                  >
                    <span>{showAllTypes ? 'Simple View' : 'All Categories'}</span>
                  </button>
                </div>
                
                {!showAllTypes ? (
                  // 简化视图 - 显示每个分类的第一个选项 + All按钮
                  <div className="grid grid-cols-2 gap-3">
                    {asmrCategories.map((category) => (
                      <button
                        key={category.types[0].id}
                        onClick={() => handleASMRTypeChange(category.types[0].id)}
                        className={`relative p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          selectedASMRType === category.types[0].id
                            ? 'border-purple-500 bg-purple-600 text-white shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span className="truncate">{category.types[0].name}</span>
                        </div>
                      </button>
                    ))}
                    
                    {/* All按钮 */}
                    <button
                      onClick={() => setShowAllTypes(true)}
                      className="relative p-3 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-400 text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all text-sm font-medium col-span-2"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>📋</span>
                        <span>View All ASMR Types</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  // 完整分类视图
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {asmrCategories.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                          <span className="text-lg">{category.icon}</span>
                          <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {category.types.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => handleASMRTypeChange(type.id)}
                              className={`relative p-3 rounded-lg border transition-all text-left ${
                                selectedASMRType === type.id
                                  ? 'border-purple-500 bg-purple-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                              }`}
                            >
                              <div className="space-y-1">
                                <h5 className={`font-medium text-sm ${
                                  selectedASMRType === type.id ? 'text-purple-900' : 'text-gray-900'
                                }`}>
                                  {type.name}
                                </h5>
                                <p className={`text-xs leading-relaxed ${
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
                )}
              </div>

              {/* Prompt Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Prompt</h3>
                  <span className="text-sm text-gray-500">(Click to edit)</span>
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
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>
                      {generationStatus.status === 'generating' ? 'Generating...' : 
                       generationStatus.status === 'polling' ? `Generating... ${generationStatus.progress}%` : 
                       'Processing...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Generate Video (30 credits)
                    </span>
                  </>
                )}
              </button>

              {/* Progress Info */}
              {isGenerating && (
                <div className="text-center mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationStatus.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600">
                    AI 视频生成需要 2-5 分钟，请不要关闭此页面
                    {generationStatus.estimatedTime && (
                      <span className="text-purple-600 font-medium">
                        （预计 {Math.ceil(generationStatus.estimatedTime / 60)} 分钟）
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Error Display */}
              {generationStatus.status === 'failed' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-red-900">生成失败</h4>
                      <p className="text-red-700">{generationStatus.error}</p>
                    </div>
                    <button
                      onClick={resetGeneration}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      重试
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Panel - Video Result */}
          <div>
            <ASMRVideoResult
              isGenerating={isGenerating}
              progress={generationStatus.progress}
              videoUrl={generationStatus.videoUrl}
              videoUrl1080p={generationStatus.videoUrl1080p}
              thumbnailUrl={generationStatus.thumbnailUrl}
              videoId={generationStatus.videoId}
              details={generationStatus.details}
              onDownload={() => {
                if (generationStatus.videoUrl) {
                  const link = document.createElement('a');
                  link.href = generationStatus.videoUrl;
                  link.download = 'asmr-video-720p.mp4';
                  link.click();
                }
              }}
              onDownload1080p={async () => {
                if (generationStatus.videoUrl1080p) {
                  const link = document.createElement('a');
                  link.href = generationStatus.videoUrl1080p;
                  link.download = 'asmr-video-1080p.mp4';
                  link.click();
                } else if (generationStatus.videoId) {
                  try {
                    const result = await get1080PVideo(generationStatus.videoId);
                    if (result.videoUrl1080p) {
                      const link = document.createElement('a');
                      link.href = result.videoUrl1080p;
                      link.download = 'asmr-video-1080p.mp4';
                      link.click();
                    }
                  } catch (error) {
                    alert('获取1080P视频失败，请稍后重试');
                  }
                }
              }}
              onGetDetails={async (videoId) => {
                try {
                  await getVideoDetails(videoId);
                } catch (error) {
                  alert('获取视频详细信息失败');
                }
              }}
              onOpenAssets={() => {
                // 这里可以添加打开资产库的逻辑
                console.log('打开我的资产');
              }}
            />
          </div>
        </div>
      </section>

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
              success: 'Most Relaxing'
            },
            { 
              title: 'AI Keyboard ASMR', 
              description: 'Mechanical keyboard typing sounds with perfect rhythm. AI-generated productivity and focus ASMR.', 
              duration: '0:40',
              success: 'Creator Favorite'
            },
            { 
              title: 'AI Crystal Cutting', 
              description: 'Unique crystal cutting with magical sounds. Fantasy ASMR content perfect for YouTube and TikTok.', 
              duration: '0:35',
              success: 'Trending Now'
            }
          ].map((example, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <Play className="w-12 h-12 text-purple-600" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{example.title}</h3>
                  <span className="text-sm text-purple-600 font-medium">{example.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {example.success}
                  </span>
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                    Try Similar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
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
            每10个Credits = 1个AI ASMR视频 • Credits永不过期
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                Create professional AI ASMR videos with cutting-edge technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI ASMR Generator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ASMR Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CuttingASMR.org. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
