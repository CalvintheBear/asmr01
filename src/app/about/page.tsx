import Link from 'next/link'
import { ArrowLeft, Sparkles, Users, Target, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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