import Link from 'next/link'
import { ArrowLeft, Sparkles, Users, Target, Star } from 'lucide-react'
import SEOHead from '@/components/SEOHead'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="About CuttingASMR - AI Video Creation Tutorial & ASMR Creator Platform"
        description="Learn about our AI video creation tutorial platform. How to become ASMR creator with advanced tools. Professional ASMR maker software for content creators and YouTube channels."
        canonical="https://cuttingasmr.org/about"
        keywords="ai video creation tutorial, how to become asmr creator, asmr creator tools, asmr maker software, content creator, asmr youtube channel, Google veo 3 ai, best ai video generator, ai content creator tools"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/pricing"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About CuttingASMR.org</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <p className="text-xl text-gray-600">
                Revolutionizing ASMR content creation with cutting-edge AI technology
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-600" />
              Our Mission
            </h2>
            <p className="mb-6">
              At CuttingASMR.org, we're passionate about making high-quality ASMR content accessible to everyone. 
              Using Google's revolutionary Veo3 AI technology, we empower creators, wellness professionals, 
              and ASMR enthusiasts to generate stunning, therapeutic relaxation videos featuring satisfying textures, 
              nature sounds, and calming visual content designed for stress relief and better sleep.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-600" />
              Who We Serve
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Content Creators</h3>
                <p className="text-gray-600">
                  YouTubers, TikTokers, and social media influencers who want to create engaging ASMR content
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Wellness Professionals</h3>
                <p className="text-gray-600">
                  Therapists, coaches, and wellness practitioners using ASMR for relaxation and therapy
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Star className="w-6 h-6 mr-3 text-amber-600" />
              Why Choose Us
            </h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Google Veo3 AI:</strong> Powered by the most advanced video AI technology</li>
              <li><strong>50+ ASMR Types:</strong> From cutting to nature sounds to personal care</li>
              <li><strong>Credits Never Expire:</strong> Use your credits whenever inspiration strikes</li>
              <li><strong>Commercial License:</strong> Use generated videos for any purpose</li>
              <li><strong>24/7 Support:</strong> Always here to help you succeed</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology & Transparency</h2>
            
            {/* Transparency Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 text-center">
                <strong>Transparency Notice:</strong> CuttingASMR.org is an independent platform that provides a user-friendly interface built on top of Google's VEO3 AI model. We are not affiliated with, endorsed by, or sponsored by Google. We enhance the VEO3 experience with custom features and templates for ASMR content creation.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg text-gray-900 mb-3">What We Are</h3>
              <p className="text-gray-600 mb-4">
                CuttingASMR.org is an independent AI wrapper platform that provides enhanced access to Google's VEO3 AI model. We are not affiliated with Google or any AI model providers.
              </p>
              <h3 className="font-bold text-lg text-gray-900 mb-3">What We Provide</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
                <li>Custom user interface for VEO3 AI model</li>
                <li>50+ specialized ASMR templates and prompts</li>
                <li>Credit-based pricing system</li>
                <li>Enhanced user experience and workflow</li>
                <li>Commercial licensing for generated content</li>
              </ul>
              <p className="text-xs text-gray-500">
                <strong>Disclaimer:</strong> This platform is not affiliated with, endorsed by, or sponsored by Google. VEO3 is a trademark of Google LLC.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of creators who trust CuttingASMR.org for their ASMR content needs
              </p>
              <Link 
                href="/pricing"
                className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 