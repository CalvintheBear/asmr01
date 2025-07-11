'use client'

// 在Cloudflare Pages中必须使用Edge Runtime
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { Play, Sparkles, Video, Download, Settings, Zap, Heart, Star, Clock, Users, Volume2, Headphones, Check, X, MessageCircle, HelpCircle } from 'lucide-react'
import { asmrCategories, defaultOption } from '@/config/asmr-types'
import Link from 'next/link'
import ASMRVideoResult from '@/components/ASMRVideoResult'
import VideoShowcase from '@/components/VideoShowcase'
import VideoCard from '@/components/VideoCard'
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
import { showcaseVideos } from '@/data/showcase-videos'
import { QuickMode, ModularMode } from '@/components/PromptModes'
import Footer from '@/components/Footer'

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
  const [promptMode, setPromptMode] = useState('quick') // 'quick' 或 'modular'
  
  // Modular Mode State - v2 with detailed prompts
  const modularOptions: Record<string, Array<{ label: string; prompt: string }>> = {
    'Scene': [
      { label: 'Cozy Room', prompt: 'A cozy and inviting room, soft ambient lighting' },
      { label: 'Minimalist Workspace', prompt: 'A clean, minimalist workspace with neutral tones' },
      { label: 'Softbox Studio', prompt: 'A professional softbox studio setting, neutral background, perfect lighting' },
      { label: 'Zen Garden Table', prompt: 'A serene Zen garden tabletop with raked sand' },
      { label: 'Rustic Kitchen', prompt: 'A rustic kitchen with wooden countertops and warm tones' },
      { label: 'Candlelit Nook', prompt: 'A cozy nook illuminated by the warm, flickering glow of candles' },
      { label: 'Frosty Window Sill', prompt: 'A frosty window sill on a cold winter day, soft natural light' },
      { label: 'Artisan Workshop', prompt: 'An artisan workshop, tools and materials neatly organized' },
      { label: 'Forest Clearing Table', prompt: 'A wooden table in a sun-dappled forest clearing' },
      { label: 'Seaside Workbench', prompt: 'A weathered workbench overlooking the sea, salty air atmosphere' },
      { label: 'Vintage Attic', prompt: 'A dusty, vintage attic filled with forgotten treasures, shafts of light' },
      { label: 'Marble Sculptor\'s Den', prompt: 'A marble sculptor\'s den, white dust covering surfaces' },
    ],
    'Subject': [
      { label: 'Soap Bar', prompt: 'a glistening bar of soap' },
      { label: 'Kinetic Sand', prompt: 'a mound of colorful kinetic sand' },
      { label: 'Green Apple', prompt: 'a crisp, green apple with water droplets' },
      { label: 'Hard Cheese', prompt: 'a block of aged hard cheese' },
      { label: 'Soft Sponge', prompt: 'a soft, porous sponge' },
      { label: 'Glass Orb', prompt: 'a clear glass orb reflecting light' },
      { label: 'Wax Block', prompt: 'a solid block of wax' },
      { label: 'Paper & Fabric', prompt: 'sheets of paper and soft fabric' },
      { label: 'Wood Block', prompt: 'a smooth, polished block of wood' },
      { label: 'Nut Shell', prompt: 'a cracked nut shell' },
      { label: 'Honey Sponge', prompt: 'a sponge dripping with golden honey' },
      { label: 'Layered Paper', prompt: 'a stack of layered, colored paper' },
      { label: 'Frozen Strawberries', prompt: 'bright red frozen strawberries with ice crystals' },
      { label: 'Rubber Eraser', prompt: 'a soft rubber eraser' },
      { label: 'Jelly Cube', prompt: 'a wobbly, translucent jelly cube' },
      { label: 'Metallic Slime', prompt: 'a pool of shimmering metallic slime' },
      { label: 'Cucumber Soap', prompt: 'a bar of soap with cucumber slices embedded' },
      { label: 'Artificial Snow', prompt: 'a pile of fluffy, artificial snow' },
      { label: 'Wax Clay', prompt: 'a malleable piece of wax clay' },
      { label: 'Ice Block', prompt: 'a clear, solid block of ice' },
      { label: 'Marshmallow Foam', prompt: 'a cloud of soft marshmallow foam' },
      { label: 'Memory Foam', prompt: 'a block of memory foam' },
      { label: 'Sand Balloon', prompt: 'a balloon filled with fine sand' },
      { label: 'Gel Wax', prompt: 'a clear, viscous gel wax' },
      { label: 'Chalky Pastel', prompt: 'a stick of soft, chalky pastel' },
      { label: 'Felt or Leather', prompt: 'a piece of soft felt or supple leather' },
      { label: 'Wax Ring', prompt: 'a ring carved from wax' },
      { label: 'LED Gel', prompt: 'a glowing LED-infused gel' },
      { label: 'Gummy Stack', prompt: 'a colorful stack of gummy candies' },
      { label: 'Silicone Sponge', prompt: 'a flexible silicone sponge' },
      { label: 'Plastic Wrap', prompt: 'a sheet of crinkling plastic wrap' },
      { label: 'Chalk', prompt: 'a piece of white chalk' },
      { label: 'Colored Soap', prompt: 'a bar of brightly colored soap' },
      { label: 'Cucumber', prompt: 'a fresh, green cucumber' },
      { label: 'Walnut Shell', prompt: 'a hard walnut shell' },
    ],
    'Action & Trigger Audio': [
      { label: 'Macro Slicing', prompt: 'being sliced with a sharp knife. Audio: crisp, satisfying slicing sounds' },
      { label: 'Slow Cutting', prompt: 'being slowly and deliberately cut. Audio: a deep, methodical cutting sound' },
      { label: 'Precision Slicing', prompt: 'being sliced with extreme precision. Audio: sharp, clean cutting noises' },
      { label: 'Spiral Carving', prompt: 'being carved into a spiral. Audio: rhythmic scraping and carving sounds' },
      { label: 'Shearing', prompt: 'being sheared with sharp scissors. Audio: a clean shearing sound' },
      { label: 'Micro Sawing', prompt: 'being sawn with a micro-saw. Audio: a fine, buzzing sawing sound' },
      { label: 'Cleaving', prompt: 'being cleaved in half with a heavy blade. Audio: a solid, resonant thud' },
      { label: 'Hot Knife Cutting', prompt: 'being cut by a sizzling hot knife. Audio: a hissing and melting sound' },
      { label: 'Chilled Knife Slicing', prompt: 'being sliced by an ice-cold knife. Audio: a frosty, brittle slicing sound' },
      { label: 'Tearing', prompt: 'being slowly torn apart. Audio: a stressed tearing and ripping sound' },
      { label: 'Peeling', prompt: 'being peeled in a continuous strip. Audio: a soft, satisfying peeling sound' },
      { label: 'Dicing', prompt: 'being diced into small cubes. Audio: rapid, rhythmic dicing sounds' },
      { label: 'Shaving', prompt: 'being shaved into thin curls. Audio: a delicate shaving sound' },
      { label: 'Breaking', prompt: 'being cleanly broken or snapped. Audio: a sharp, crisp breaking sound' },
    ],
    'Background Audio': [
        { label: 'Crisp Crunch', prompt: 'Audio: Crisp crunching' },
        { label: 'Squish Pop', prompt: 'Audio: Squish and pop sounds' },
        { label: 'Brittle Snap', prompt: 'Audio: Brittle snapping noises' },
        { label: 'Granular Fall', prompt: 'Audio: The sound of falling grains' },
        { label: 'Icy Crackle', prompt: 'Audio: Icy crackling' },
        { label: 'Sticky Ooze', prompt: 'Audio: Sticky, oozing sounds' },
        { label: 'Paper Flap', prompt: 'Audio: Flapping paper' },
        { label: 'Squeaky Peel', prompt: 'Audio: A squeaky peeling sound' },
        { label: 'Metallic Resonance', prompt: 'Audio: A metallic resonance' },
        { label: 'Static Crunch', prompt: 'Audio: A static crunch' },
        { label: 'Soft Scrape', prompt: 'Audio: Soft scraping' },
        { label: 'Sizzling Hiss', prompt: 'Audio: Sizzling and hissing' },
        { label: 'Air Release', prompt: 'Audio: A slow release of air' },
        { label: 'Dusty Crumble', prompt: 'Audio: Dusty crumbling sounds' },
        { label: 'Textured Grit', prompt: 'Audio: The sound of textured grit' },
        { label: 'Crystal Chime', prompt: 'Audio: A soft crystal chime' },
        { label: 'Crinkling Rustle', prompt: 'Audio: Crinkling and rustling' },
        { label: 'Water Splatter', prompt: 'Audio: Gentle water splatters' },
    ],
    'Visual Style': [
        { label: 'Warm & Soft', prompt: 'Warm and soft lighting, creating a gentle and inviting mood' },
        { label: 'Cool & Crisp', prompt: 'Cool, crisp lighting, emphasizing details and textures' },
        { label: 'Macro Detail', prompt: 'Extreme close-up, macro photography style, revealing intricate details' },
        { label: 'Softbox Clarity', prompt: 'Shot in a professional softbox studio, clean and clear visuals' },
        { label: 'Glowing Ambient', prompt: 'A glowing, ambient light that creates a magical atmosphere' },
    ],
    'Camera Movement': [
        { label: 'Close-up', prompt: 'A tight close-up shot' },
        { label: 'Macro Shot', prompt: 'An extreme macro shot, focusing on minute details' },
        { label: 'Slow Motion', prompt: 'filmed in stunning slow motion' },
        { label: 'Steady Pan', prompt: 'A smooth, steady pan across the subject' },
    ],
    'Additional Settings': [
        { label: 'No Dialogue', prompt: 'no dialogue, ASMR audio focus' },
        { label: 'High Fidelity Audio', prompt: 'ultra high-fidelity binaural audio' },
        { label: 'Slow Motion Effect', prompt: 'with a subtle slow-motion effect' },
        { label: 'Binaural Audio', prompt: 'enhanced with binaural audio for a 3D sound experience' },
    ],
  }

  const [selectedModules, setSelectedModules] = useState(
    Object.keys(modularOptions).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  )
  // 新增：标记用户是否手动编辑了提示词
  const [hasUserEditedPrompt, setHasUserEditedPrompt] = useState(false)

  // 高度对齐相关状态和引用
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaHeight, setTextareaHeight] = useState(128) // 默认 h-32 = 128px
  
  // 使用积分钩子
  const { credits, loading: creditsLoading, refetch: refetchCredits, forceRefresh: forceRefreshCredits } = useCredits(!!user && userSynced)

  // SEO-optimized FAQ data based on the provided keyword list
  const faqData = [
    {
      id: 'what-is-ai-asmr-generator',
      question: 'What is an AI ASMR Video Generator? How is it related to VEO3?',
      answer: 'Our AI ASMR Video Generator is an online tool powered by Google\'s latest VEO3 AI technology. It allows you to easily create captivating ASMR videos using simple "text to video" commands. Whether you want to make relaxing YouTube videos or viral TikTok shorts, our tool can help.'
    },
    {
      id: 'how-to-make-ai-asmr-video',
      question: 'How do I make an AI ASMR video? Do I need to write complex prompts?',
      answer: 'Making AI videos is very simple! Just choose a scene, like "glass cutting" or "lava flow," and enter a simple description. Our AI video maker will handle the rest. We have optimized the prompt generation logic for VEO3 (prompt veo3), so you don\'t need to be an expert to create professional-grade AI videos.'
    },
    {
      id: 'best-ai-video-generator',
      question: 'Why is this considered one of the best AI video generators on the market?',
      answer: 'Our platform is considered one of the best AI video generators because it\'s specifically optimized for ASMR content and is driven by the powerful Google VEO 3 AI and Gemini models. We focus on audio-visual synchronization to ensure that scenes like "knife cutting fruit" have extremely realistic physics and sound.'
    },
    {
      id: 'asmr-content-types',
      question: 'What types of ASMR content can I create? For example, glass or lava?',
      answer: 'Absolutely! Our AI supports a wide range of creative ideas, including but not limited to "AI glass cutting," "glass fruit" art, flowing "lava" and "magma" visuals, and scenes of various knives cutting objects. You can also generate unique AI sounds and ASMR sound effects.'
    },
    {
      id: 'create-videos-for-social-media',
      question: 'Is this tool suitable for creating videos for TikTok and YouTube Shorts?',
      answer: 'Definitely! Our AI video generator is made for social media. You can easily create vertical short videos that fit the style of TikTok and YouTube Shorts. Whether you want to post on TikTok, YouTube, Facebook, or Instagram, you can quickly generate eye-catching AI video content.'
    },
    {
      id: 'cost-for-creators',
      question: 'How much does it cost for content creators?',
      answer: 'Each AI-generated ASMR video costs just 10 credits (less than $1). For content creators, our packages start at $9.90 for 115 credits - creating 11+ videos. Much more cost-effective than traditional video production.'
    },
    {
      id: 'what-is-veo3-ai',
      question: 'What is VEO3? How is it related to Google AI?',
      answer: 'VEO3 (also known as Google VEO) is a cutting-edge video generation model developed by Google AI Labs (Google AI Studio) as part of its Gemini program. It represents a breakthrough in understanding natural language and generating high-quality, realistic videos, and it\'s especially good at handling complex physical interactions and visual effects.'
    },
    {
      id: 'text-to-video-difference',
      question: 'How is your "text to video" AI different from other tools?',
      answer: 'Unlike other generic "text to video" tools, we specialize in the ASMR niche. This means our AI not only generates visuals but also creates matching AI voices and sound effects designed to trigger ASMR tingles. From subtle cutting sounds to flowing noises, everything is designed for the optimal ASMR experience.'
    },
    {
      id: 'how-to-get-started',
      question: 'As a video creator, how can I start using this to grow my channel?',
      answer: 'This is a powerful tool for YouTube or TikTok video creators. You can quickly generate multiple high-quality ASMR videos daily to keep your channel active. In just a few minutes, you can turn a simple idea into a publishable video, significantly boosting your content creation efficiency.'
    },
    {
      id: 'text-to-video-different',
      question: 'What makes our text to video generator different from others?',
      answer: 'Our text to video AI specializes in ASMR content creation with superior audio-visual synchronization. Unlike generic text to video tools, our platform understands ASMR triggers and creates videos that deliver authentic relaxation experiences with perfect timing and realistic physics.'
    },
    {
      id: 'video-generation-speed',
      question: 'How long does it take to generate an AI video?',
      answer: 'Speed is one of our strengths. Typically, a standard AI ASMR video is generated in just 3-5 minutes. This means you can quickly respond to trending topics or batch-create content for your YouTube Shorts or TikTok channel in a short amount of time.'
    },
    {
      id: 'voice-dubbing-feature',
      question: 'Can I use AI for voice dubbing (voice dubbing AI)?',
      answer: 'Currently, our core feature revolves around generating visuals and ASMR trigger sounds. While our videos include highly synchronized AI sound effects, a dedicated AI voice dubbing feature is under development. Our goal is to eventually achieve a perfect combination of visuals, sound effects, and narration.'
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

  // 当模块化选项变化时，更新总提示词
  useEffect(() => {
    if (promptMode === 'modular' && !hasUserEditedPrompt) {
      const promptParts = Object.entries(selectedModules).map(([category, selectedLabel]) => {
        if (!selectedLabel) return null
        const option = (modularOptions[category] as Array<{ label: string; prompt: string }>).find(opt => opt.label === selectedLabel)
        return option ? option.prompt : null
      })
      const newPrompt = promptParts.filter(Boolean).join('. ')
      setPrompt(newPrompt)
    }
  }, [selectedModules, promptMode, modularOptions, hasUserEditedPrompt])

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
  
  const { generationStatus, generateVideo, getVideoDetails, get1080PVideo, resetGeneration, isGenerating } = useVideoGeneration()

  // 动态高度调整逻辑 - 在视频生成钩子之后
  useEffect(() => {
    const adjustHeight = () => {
      if (leftPanelRef.current && rightPanelRef.current && textareaRef.current) {
        const leftPanelHeight = leftPanelRef.current.offsetHeight
        const rightPanelHeight = rightPanelRef.current.offsetHeight
        
        // 如果右侧面板比左侧矮，则增加textarea高度来匹配
        if (rightPanelHeight > leftPanelHeight) {
          const heightDifference = rightPanelHeight - leftPanelHeight
          const newTextareaHeight = Math.max(128, 128 + heightDifference - 40) // 减去40px的缓冲
          setTextareaHeight(newTextareaHeight)
        } else {
          // 如果左侧已经够高或更高，保持默认高度
          setTextareaHeight(128)
        }
      }
    }

    // 延迟执行以确保DOM完全渲染
    const timer = setTimeout(adjustHeight, 100)

    // 监听窗口大小变化
    window.addEventListener('resize', adjustHeight)
    
    // 监听DOM变化（如视频生成状态变化）
    const observer = new MutationObserver(adjustHeight)
    if (rightPanelRef.current) {
      observer.observe(rightPanelRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      })
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', adjustHeight)
      observer.disconnect()
    }
  }, [generationStatus, isGenerating]) // 依赖状态变化时重新调整

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

  // 模块化选择处理器
  const handleModuleChange = (category: string, value: string) => {
    setSelectedModules(prev => ({
      ...prev,
      [category]: value,
    }))
    // 当用户更改模块时，表示新的自动拼接即将生成，重置手动编辑标记
    setHasUserEditedPrompt(false)
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
        keywords="ai prompt template, ai video prompt, google veo3 prompts, ai video generator, ai asmr prompts, ai prompt,text to video, create ai asmr videos,create ai yeti vlog videos,how to create ai asmr videos ,create asmr by voe3, ai sound, create bread spread videos"
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
          <div className="flex items-center h-16 justify-center md:justify-between">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
              <Link href="/video-showcase" className="px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors">
                Template
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors">
                Pricing
              </Link>
              <Link href="/make-money-with-ai" className="px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors">
                Guide
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
                  href="/video-showcase" 
                  className="block px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Template
                </Link>

                <Link 
                  href="/pricing" 
                  className="block px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/make-money-with-ai" 
                  className="block px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Guide
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
              Create Viral <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">ASMR Video</span> with
              <span className="block">our AI-powered <span className="font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Veo3 generator</span></span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              FREE credits for new users! Master ai video prompt creation with proven veo3 video prompt templates. 
              Generate professional AI videos in minutes using Google Veo3 AI technology. 
              Perfect for YouTube, TikTok creators and content makers - no editing skills required.
            </p>
            

            

          </div>

          {/* Main Content - Two Column Layout */}
          <div id="main-generator" className="grid lg:grid-cols-2 gap-8 items-start mb-20">
            {/* Left Panel - ASMR Controls */}
            <div ref={leftPanelRef} className="bg-gradient-to-br from-stone-800 to-gray-900 backdrop-blur-sm rounded-3xl shadow-xl border border-stone-700 overflow-hidden">
              
              {/* ASMR Type Selection */}
              <div className="p-8 border-b border-stone-700/50">
                {/* Mode Tabs */}
                <div className="flex border-b border-stone-600 mb-6">
                  <button
                    onClick={() => setPromptMode('quick')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ease-in-out -mb-px border-b-2 ${
                      promptMode === 'quick'
                        ? 'border-cyan-400 text-white'
                        : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                  >
                    Quick Mode
                  </button>
                      <button
                    onClick={() => setPromptMode('modular')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ease-in-out -mb-px border-b-2 ${
                      promptMode === 'modular'
                        ? 'border-cyan-400 text-white'
                        : 'border-transparent text-slate-400 hover:text-white'
                          }`}
                      >
                    Modular Mode
                      </button>
                </div>
                  
                {/* Conditional Content */}
                <div>
                  {promptMode === 'quick' ? (
                    <QuickMode 
                      selectedASMRType={selectedASMRType}
                      handleASMRTypeChange={handleASMRTypeChange}
                      setShowAllTypesModal={setShowAllTypesModal}
                    />
                  ) : (
                    <ModularMode 
                      options={modularOptions}
                      selectedValues={selectedModules}
                      onChange={handleModuleChange}
                    />
                  )}
                </div>
              </div>

              {/* Prompt Input Section */}
              <div className="p-8 border-b border-stone-700/50 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-3">Customize Your Video Prompt</h3>
                
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value)
                    if (promptMode === 'modular') {
                      setHasUserEditedPrompt(true)
                    }
                  }}
                  placeholder={selectedASMRType === 'default' 
                    ? "Create your ai video prompt: describe lighting, camera angles, sounds, textures, and visual elements. Write a detailed veo3 video prompt for best results..."
                    : "Edit this ai video prompt template or use it as-is..."
                  }
                  style={{ height: `${textareaHeight}px` }}
                  className="w-full p-4 border border-stone-600 rounded-xl resize-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-stone-700/50 focus:bg-stone-600/70 text-white placeholder-slate-400 transition-all duration-300"
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
                              ? `Insufficient Credits (Need ${CREDITS_CONFIG.VIDEO_COST})`
                              : `Generate AI Video (10 Credits)`
                            }
                          </span>
                        </div>
                      )}
                    </button>
                    
                    {/* Loading state notice */}
                    {user && (!userSynced || creditsLoading || !credits) && (
                      <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-5">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
                          </div>
                          <div>
                            <h4 className="font-medium text-cyan-300 mb-1">
                              {!userSynced 
                                ? 'Syncing Account'
                                : creditsLoading 
                                ? 'Loading Credits'
                                : 'Loading Account Data'
                              }
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              Please wait while we load your account information...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Sign in to Generate Videos</h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      Create your account to start generating AI ASMR videos with our advanced tools.
                    </p>
                    <SignInButton mode="modal" fallbackRedirectUrl="/">
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                        Sign In to Continue
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Video Result and Video Card */}
            <div ref={rightPanelRef} className="flex flex-col space-y-6">
              {/* ASMR Video Result - 固定较小高度 */}
              <div className="flex-shrink-0">
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
              
              {/* Featured Video Card - 占据剩余空间 */}
              <div className="flex-grow">
                <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl shadow-xl border border-stone-700 p-6 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">Featured Example</h3>
                    <Link 
                      href="/video-showcase"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="w-4 h-4" />
                      Video & Prompt Examples
                    </Link>
                  </div>
                  <VideoCard 
                    video={showcaseVideos.find(v => v.id === 'glass-fruit-cutting-1')!}
                  />
                </div>
              </div>
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

          {/* Success Stories Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 mt-32">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                Success Stories
              </div>
              <div className="flex justify-center items-center gap-2">
              <h2 className="text-4xl font-bold text-white mb-4">
                ASMR Creators Earning <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">$50K+/Month</span>
              </h2>
                <Link href="/make-money-with-ai-asmr" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 -mt-3">
                  <HelpCircle className="w-6 h-6" />
                </Link>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Story 1 */}
              <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl border border-stone-700">
                <div className="flex items-center mb-6">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-6 leading-relaxed">
                  "From zero to 500K subscribers in 2 months! The Veo3 AI creates content that's impossible to distinguish from real ASMR artists."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-xl">Luna Chen</h4>
                    <p className="text-stone-300">ASMR YouTuber</p>
                  </div>
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg">
                    $45K/month
                  </div>
                </div>
              </div>

              {/* Story 2 */}
              <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl border border-stone-700">
                <div className="flex items-center mb-6">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-6 leading-relaxed">
                  "My AI-generated soap cutting videos get 10M+ views each. The quality is so realistic, nobody believes it's AI!"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-xl">Marcus Williams</h4>
                    <p className="text-stone-300">TikTok ASMR Creator</p>
                  </div>
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg">
                    $62K/month
                  </div>
                </div>
              </div>

              {/* Story 3 */}
              <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl border border-stone-700">
                <div className="flex items-center mb-6">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-6 leading-relaxed">
                  "I produce 50 ASMR videos daily across all platforms. The 3D audio quality is better than my $5K microphone setup!"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-xl">Sophie Anderson</h4>
                    <p className="text-stone-300">Multi-Platform Creator</p>
                  </div>
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg">
                    $78K/month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI vs Traditional Comparison Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                AI vs Traditional
              </div>
              <div className="flex justify-center items-center gap-2">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why AI is the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">ASMR Content Creation</span>
              </h2>
                <Link href="/ai-vs-traditional-asmr" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 -mt-3">
                  <HelpCircle className="w-6 h-6" />
                </Link>
              </div>

              <p className="text-slate-300 max-w-3xl mx-auto text-lg leading-relaxed">
                See how Google Veo3 AI revolutionizes ASMR content creation compared to traditional methods
              </p>
            </div>

            <div className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-600">
                      <th className="text-left p-6 text-white font-semibold text-lg">Feature</th>
                      <th className="text-center p-6 text-stone-300 font-medium">Traditional ASMR Creation</th>
                      <th className="text-center p-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 font-semibold">AI-Powered with Veo3</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Equipment Cost</td>
                      <td className="p-6 text-center text-stone-400">$2,000 - $10,000</td>
                      <td className="p-6 text-center font-bold text-purple-400">$0</td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Time to Create Video</td>
                      <td className="p-6 text-center text-stone-400">4-8 hours</td>
                      <td className="p-6 text-center font-bold text-purple-400">30-60 seconds</td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Audio Quality</td>
                      <td className="p-6 text-center text-stone-400">Depends on equipment</td>
                      <td className="p-6 text-center font-bold text-purple-400">Studio-grade 3D spatial</td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Video Quality</td>
                      <td className="p-6 text-center text-stone-400">Up to 4K (with camera)</td>
                      <td className="p-6 text-center font-bold text-purple-400">4K HDR guaranteed</td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">ASMR Styles Available</td>
                      <td className="p-6 text-center text-stone-400">Limited by skills</td>
                      <td className="p-6 text-center font-bold text-purple-400">200+ instant styles</td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Background Noise</td>
                      <td className="p-6 text-center">
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      </td>
                      <td className="p-6 text-center">
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Consistency</td>
                      <td className="p-6 text-center text-stone-400">Varies by mood/energy</td>
                      <td className="p-6 text-center font-bold text-purple-400">Perfect every time</td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Scalability</td>
                      <td className="p-6 text-center text-stone-400">1-2 videos/day max</td>
                      <td className="p-6 text-center font-bold text-purple-400">50+ videos/day</td>
                    </tr>
                    <tr className="border-b border-stone-700/50">
                      <td className="p-6 font-medium text-stone-200">Viral Optimization</td>
                      <td className="p-6 text-center">
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      </td>
                      <td className="p-6 text-center">
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-6 font-medium text-stone-200">Multiple Languages</td>
                      <td className="p-6 text-center">
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      </td>
                      <td className="p-6 text-center">
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* How to Create ASMR Video Section - Natural Style */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                How to Create an ASMR Video<br />
                <span className="text-slate-300">with Veo3 AI</span>
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Generate a relaxing ASMR video in just three simple steps with our<br />
                AI-powered Veo3 platform:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {/* Step 1 */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-sm border border-slate-700/50 hover:shadow-md hover:border-cyan-400/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 text-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    <circle cx="8" cy="8" r="2" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Choose ASMR Scene</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Select from pre-built templates or create your own custom ASMR concept
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-sm border border-slate-700/50 hover:shadow-md hover:border-cyan-400/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-400/10 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Customize Your Prompt</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Describe your ideal ASMR scene with specific details about sounds, visuals, and mood
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-sm border border-slate-700/50 hover:shadow-md hover:border-cyan-400/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-400/10 text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3l-6 18M9 9l10.5-3M20 6l-18 6" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6l1-1M18 18l1 1M6 18l-1 1M18 6l1-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Generate & Share</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  AI creates your video in 3-5 minutes. Download and share on YouTube, TikTok, or any platform
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="#main-generator">
                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  Create AI Video Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>





          {/* FAQ Section */}
          <FAQAccordion 
            title="Frequently Asked Questions"
            faqs={faqData}
          />

          {/* Advanced AI Video Generation Technology Section - Collapsible */}
          <CollapsibleTechSection />

        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* 弹出式模态框 - 显示所有ASMR类型 */}
      {showAllTypesModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-700">
            <div className="flex justify-between items-center p-5 border-b border-slate-700 sticky top-0 bg-slate-800/90 backdrop-blur-sm z-10">
              <h3 id="modal-title" className="text-xl font-bold text-white">Choose Video Prompt Template</h3>
              <button
                onClick={() => setShowAllTypesModal(false)}
                className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              {/* Custom Prompt Option */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-700">
                  <span className="text-lg">✏️</span>
                  <h4 className="font-semibold text-white">Custom</h4>
                </div>
                <button
                  onClick={() => {
                    handleASMRTypeChange('default')
                    setShowAllTypesModal(false)
                  }}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedASMRType === 'default'
                      ? 'border-cyan-500 bg-cyan-500/20 shadow-md'
                      : 'border-slate-600 hover:border-slate-500 bg-slate-700/50 hover:bg-slate-600/50'
                  }`}
                >
                  <div className="space-y-1">
                    <h5 className={`font-medium ${
                      selectedASMRType === 'default' ? 'text-cyan-300' : 'text-white'
                    }`}>
                      {defaultOption.name}
                    </h5>
                    <p className={`text-sm leading-relaxed ${
                      selectedASMRType === 'default' ? 'text-cyan-400' : 'text-slate-300'
                    }`}>
                      {defaultOption.description}
                    </p>
                  </div>
                </button>
              </div>

              {/* 所有分类 */}
              {asmrCategories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-700">
                    <span className="text-lg">{category.icon}</span>
                    <h4 className="font-semibold text-white">{category.name}</h4>
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
                            ? 'border-cyan-500 bg-cyan-500/20 shadow-md'
                            : 'border-slate-600 hover:border-slate-500 bg-slate-700/50 hover:bg-slate-600/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <h5 className={`font-medium ${
                            selectedASMRType === type.id ? 'text-cyan-300' : 'text-white'
                          }`}>
                            {type.name}
                          </h5>
                          <p className={`text-sm leading-relaxed ${
                            selectedASMRType === type.id ? 'text-cyan-400' : 'text-slate-300'
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
      )}

      {/* 反馈模态框 */}
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </div>
  )
} 
