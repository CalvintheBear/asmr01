'use client'

// 在Cloudflare Pages中必须使用Edge Runtime（CreemPaymentButton使用useUser）
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowLeft, Check, Sparkles, Video, Star, Users, Shield, Zap, Clock, Crown, Headphones, Play, Heart } from 'lucide-react'
import CreemPaymentButton from '@/components/CreemPaymentButton'
import SEOHead from '@/components/SEOHead'

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
        'Full HD 1080p quality & download',
        'Access to all 50+ ASMR templates'
      ],
      popular: false,
      className: 'border-stone-200 hover:border-stone-300',
      iconColor: 'text-gray-600',
      bgGradient: 'from-stone-50 to-white'
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
        'Full HD 1080p quality & download',
        'Access to all 50+ ASMR templates',
        'Faster generation processing',
        'Commercial usage included'
      ],
      popular: true,
      className: 'border-emerald-500 ring-4 ring-emerald-200 shadow-2xl',
      iconColor: 'text-emerald-600',
      bgGradient: 'from-emerald-50 to-white'
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
        'Full HD 1080p quality & download',
        'Access to ALL 50+ ASMR templates',
        'Priority generation processing',
        'Commercial usage included',
        'Early access to new ASMR types',
        'Bulk video generation support',
        'Premium customer support'
      ],
      popular: false,
      className: 'border-amber-400 ring-2 ring-amber-200',
      iconColor: 'text-amber-600',
      bgGradient: 'from-amber-50 to-white'
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50">
      <SEOHead
        title="AI ASMR Generator Pricing - Powered by Gemini Veo3 | CuttingASMR.org"
        description="Choose from affordable AI ASMR video generation packages. Starter ($9.9), Standard ($30), Premium ($99). Credits never expire. 1080p quality downloads."
        canonical="https://cuttingasmr.org/pricing"
        keywords="AI ASMR pricing, Gemini Veo3 cost, ASMR video generation price, AI video pricing, ASMR credits"
      />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-sm text-amber-600 font-medium">
            🔥 Limited Time Offer - Save up to 25%
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-2">CuttingASMR.org Pricing</h1>
              <p className="text-xl text-emerald-600 font-medium">Powered by Google Veo3 AI</p>
            </div>
          </div>
          
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
            Generate stunning ASMR videos with our advanced AI. Choose the plan that best fits your creative needs.
          </p>
          
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 px-6 py-3 rounded-full text-lg font-bold border border-emerald-200">
            <Video className="w-5 h-5 mr-3" />
            10 Credits = 1 AI ASMR Video • Credits Never Expire • High Quality Download
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-gradient-to-br ${plan.bgGradient} rounded-2xl shadow-lg p-6 transition-all duration-300 hover:transform hover:scale-105 ${plan.className} ${
                plan.popular ? 'lg:scale-105' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`px-6 py-2 rounded-full text-sm font-bold flex items-center text-white ${
                    plan.popular ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}>
                    <Star className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  plan.popular ? 'bg-emerald-100' : plan.id === 'premium' ? 'bg-amber-100' : 'bg-stone-100'
                }`}>
                  {plan.id === 'starter' && <Play className={`w-6 h-6 ${plan.iconColor}`} />}
                  {plan.id === 'standard' && <Zap className={`w-6 h-6 ${plan.iconColor}`} />}
                  {plan.id === 'premium' && <Crown className={`w-6 h-6 ${plan.iconColor}`} />}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                
                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-gray-400 line-through text-lg mr-2">{plan.originalPrice}</span>
                    <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-600 ml-1 text-base">USD</span>
                  </div>
                  <div className="text-emerald-600 font-medium text-sm">
                    Save ${(parseFloat(plan.originalPrice.replace('$', '')) - parseFloat(plan.price.replace('$', ''))).toFixed(1)}
                  </div>
                </div>

                {/* Credits & Videos */}
                <div className={`rounded-xl p-4 mb-4 ${
                  plan.popular ? 'bg-emerald-100 border border-emerald-200' : 
                  plan.id === 'premium' ? 'bg-amber-100 border border-amber-200' : 
                  'bg-stone-100 border border-stone-200'
                }`}>
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className={`w-5 h-5 mr-2 ${plan.iconColor}`} />
                    <span className="font-bold text-xl text-gray-800">{plan.credits} Credits</span>
                  </div>
                  <div className="text-base font-medium text-gray-700">
                    Create {Math.floor(plan.videos)}+ videos
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <CreemPaymentButton
                planType={plan.id as 'starter' | 'standard' | 'premium'}
                amount={parseFloat(plan.price.replace('$', ''))}
                description={`${plan.name} Plan - ${plan.credits} Credits`}
                className={`w-full py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl'
                    : plan.id === 'premium'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                }`}
              >
                Get Started Now
              </CreemPaymentButton>

              <p className="text-center text-xs text-gray-500 mt-2">
                🔒 Secure payment by Creem
              </p>
            </div>
          ))}
        </div>

        {/* Platform Disclosure and Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Disclosure</h3>
          <p className="text-sm text-gray-600 mb-4">
            CuttingASMR.org is an independent AI wrapper platform that provides enhanced access to Google's VEO3 AI model through our custom interface. We are not affiliated with Google and provide additional features, templates, and user experience improvements for ASMR video generation.
          </p>
          <p className="text-xs text-gray-500">
            <strong>Disclaimer:</strong> This platform is not affiliated with, endorsed by, or sponsored by Google. VEO3 is a trademark of Google LLC.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Why Choose CuttingASMR.org?</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience the future of ASMR content creation with cutting-edge AI technology
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>



        {/* CTA Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Create Amazing ASMR Videos?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators who trust CuttingASMR.org for their ASMR content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#pricing"
                className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
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
        <div className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-emerald-600 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="mailto:supportadmin@cuttingasmr.org" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
                <li><Link href="/help" className="hover:text-emerald-600 transition-colors">Help Center</Link></li>
                <li><Link href="/tutorials" className="hover:text-emerald-600 transition-colors">Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-emerald-600 transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-emerald-600 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 CuttingASMR.org. All rights reserved. Powered by Google Veo3 AI.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 