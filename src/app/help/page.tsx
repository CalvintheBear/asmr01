import Link from 'next/link'
import { ArrowLeft, Video, Sparkles, CreditCard, HelpCircle } from 'lucide-react'

export default function HelpPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-purple-50 rounded-xl p-6">
              <Video className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-gray-600 mb-4">Learn how to create your first ASMR video</p>
              <Link href="#getting-started" className="text-purple-600 hover:text-purple-700 font-medium">
                Learn More →
              </Link>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <CreditCard className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Credits & Billing</h3>
              <p className="text-gray-600 mb-4">Understand how credits work and billing</p>
              <Link href="#credits" className="text-blue-600 hover:text-blue-700 font-medium">
                Learn More →
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <section id="getting-started">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">How do I create my first ASMR video?</h3>
                  <p className="text-gray-600">
                    1. Choose an ASMR type from our categories<br/>
                    2. Customize the prompt or use our templates<br/>
                    3. Click "Generate Video"<br/>
                    4. Wait for processing (usually 2-5 minutes)<br/>
                    5. Download your video
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What ASMR types are available?</h3>
                  <p className="text-gray-600">
                    We offer 50+ ASMR types including cutting, nature sounds, object interactions, and personal care scenarios.
                  </p>
                </div>
              </div>
            </section>

            <section id="credits">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Credits & Billing</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">How do credits work?</h3>
                  <p className="text-gray-600">
                    Each video generation costs 10 credits. Credits never expire and can be used at any time.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-600">
                    We accept all major credit cards and digital payment methods through our secure payment processor Creem.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Support</h2>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <a 
                href="mailto:j2983236233@gmail.com"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Contact Support
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 