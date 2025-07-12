'use client'

// 在Cloudflare Pages中必须使用Edge Runtime（CreemPaymentButton使用useUser）
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeft, Check, Sparkles, Video, Star, Users, Shield, Zap, Clock, Crown, Headphones, Play, Heart } from 'lucide-react'
import CreemPaymentButton from '@/components/CreemPaymentButton'
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'



export default function PricingPage() {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      originalPrice: '$12',
      price: '$9.9',
      credits: 115,
      videos: 11.5,
      description: 'Perfect for getting started with AI ASMR video generation.',
      badge: '',
      features: [
        '115 credits, never expire',
        'Generate 11+ stunning ASMR videos',
        'Access to all 50+ ASMR templates'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard',
      originalPrice: '$40',
      price: '$30',
      credits: 355,
      videos: 35.5,
      description: 'For creators who need more freedom and power to produce high-quality ASMR content.',
      badge: 'Most Popular',
      features: [
        '355 credits, never expire',
        'Generate 35+ premium ASMR videos',
        'Access to all 50+ ASMR templates',
        'Faster generation processing',
        'Commercial usage included'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      originalPrice: '$120',
      price: '$99',
      credits: 1450,
      videos: 145,
      description: 'The ultimate toolkit for professionals and power users creating top-tier ASMR videos.',
      badge: 'Best Value',
      features: [
        '1450 credits, never expire',
        'Generate 145+ professional ASMR videos',
        'Access to ALL 50+ ASMR templates',
        'Priority generation processing',
        'Commercial usage included',
        'Premium customer support'
      ],
      popular: false
    }
  ]

  const features = [
    {
      icon: Video,
      title: 'Google Veo3 AI',
      description: 'Powered by the latest Google Veo3 technology for ultra-realistic ASMR videos'
    },
    {
      icon: Clock,
      title: 'Never Expire Credits',
      description: 'Your credits never expire - use them at your own pace, anytime'
    },
    {
      icon: Sparkles,
      title: 'All ASMR Types',
      description: 'Access to cutting, nature, objects, and personal care ASMR templates'
    },
    {
      icon: Shield,
      title: 'Commercial License',
      description: 'Use generated videos for commercial purposes without restrictions'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Generate high-quality ASMR videos in minutes, not hours'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team'
    }
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <SEOHead
        title="Best ASMR Generator Pricing - AI Content Creator Tools & ASMR Maker Software"
        description="Best ASMR generator pricing for creators! AI content creator tools starting $9.9. ASMR maker software for YouTube channels. Create relaxing videos with AI technology."
        canonical="https://cuttingasmr.org/pricing"
        keywords="best asmr generator, asmr maker software, ai content creator tools, asmr creator tools, relaxing video maker, YouTube, tiktok, content creator, asmr youtube channel, veo3 ai, ai video generator, meditation video creator"
      />
      
      {/* 添加结构化数据 */}
      <StructuredData 
        type="pricing"
        pageUrl="https://cuttingasmr.org/pricing"
      />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <Link 
            href="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-sm text-cyan-400 font-medium text-center">
            🔥 Limited Time Offer - Save up to 25%
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">CuttingASMR.org Pricing</h1>
              <p className="text-lg sm:text-xl text-cyan-400 font-medium">Powered by Google Veo3 AI</p>
            </div>
          </div>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-8">
            Generate stunning ASMR videos with our advanced AI. Choose the plan that best fits your creative needs.
          </p>
          

        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-slate-800/90 backdrop-blur-sm rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg flex flex-col h-full ${
                plan.popular 
                  ? 'border-cyan-500 shadow-md' 
                  : plan.id === 'premium'
                  ? 'border-purple-400 shadow-md'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={`px-4 py-1 rounded-full text-sm font-medium text-white ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                      : plan.id === 'premium'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                      : 'bg-slate-600'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-slate-300 text-xs">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-1">
                  <span className="text-slate-400 line-through text-base mr-2">{plan.originalPrice}</span>
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                </div>
                <p className={`font-medium text-xs ${
                  plan.id === 'premium' 
                    ? 'text-purple-400' 
                    : 'text-cyan-400'
                }`}>
                  Save ${(parseFloat(plan.originalPrice.replace('$', '')) - parseFloat(plan.price.replace('$', ''))).toFixed(1)}
                </p>
              </div>

              {/* Credits Info */}
              <div className="text-center mb-4 p-3 bg-slate-700/50 rounded-lg">
                <div className="text-base font-bold text-white">{plan.credits} Credits</div>
                <div className="text-xs text-slate-300">Generate {Math.floor(plan.videos)}+ videos</div>
              </div>

              {/* Features */}
              <div className="mb-6 flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                        plan.id === 'premium' 
                          ? 'text-purple-400' 
                          : 'text-cyan-400'
                      }`} />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-auto">
                <CreemPaymentButton
                  planType={plan.id as 'starter' | 'standard' | 'premium'}
                  amount={parseFloat(plan.price.replace('$', ''))}
                  description={`${plan.name} Plan - ${plan.credits} Credits`}
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                      : plan.id === 'premium'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  Get Started
                </CreemPaymentButton>

                <p className="text-center text-xs text-slate-400 mt-2">
                  Secure payment by Creem
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Disclosure and Disclaimer */}
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 mb-8 text-center max-w-6xl mx-auto border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-3">Platform Disclosure</h3>
          <p className="text-sm text-slate-300 mb-4">
            CuttingASMR.org is an independent AI wrapper platform that provides enhanced access to Google's VEO3 AI model through our custom interface. We are not affiliated with Google and provide additional features, templates, and user experience improvements for ASMR video generation.
          </p>
          <p className="text-xs text-slate-400">
            <strong>Disclaimer:</strong> This platform is not affiliated with, endorsed by, or sponsored by Google. VEO3 is a trademark of Google LLC.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-4">Why Choose CuttingASMR.org?</h2>
          <p className="text-xl text-center text-slate-300 mb-12 max-w-3xl mx-auto">
            Experience the future of ASMR content creation with cutting-edge AI technology
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-slate-700/50">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>



        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Create Amazing ASMR Videos?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators who trust CuttingASMR.org for their ASMR content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#pricing"
                className="inline-flex items-center px-8 py-4 bg-white text-cyan-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating Today
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                See Examples
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-slate-700/50 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-cyan-400 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="mailto:supportadmin@cuttingasmr.org" className="hover:text-cyan-400 transition-colors">Contact Us</a></li>
                <li><Link href="/help" className="hover:text-cyan-400 transition-colors">Help Center</Link></li>
                <li><Link href="/video-showcase" className="hover:text-cyan-400 transition-colors">Video Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                <li><Link href="/asmr-types" className="hover:text-cyan-400 transition-colors">ASMR Types</Link></li>
                <li><Link href="/profile" rel="nofollow" className="hover:text-cyan-400 transition-colors">User Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CuttingASMR.org. All rights reserved. Powered by Google Veo3 AI.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 