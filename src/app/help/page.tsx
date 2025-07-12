import Link from 'next/link'
import { ArrowLeft, Mail, Clock, Shield } from 'lucide-react'
import SEOHead from '@/components/SEOHead'
import StructuredData from '@/components/StructuredData'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center & FAQ | CuttingASMR',
  description: 'Find answers to frequently asked questions about our AI ASMR video generator, credits, Veo3 technology, and more.',
  keywords: ['help center', 'faq', 'support', 'contact us', 'how to use', 'questions', 'asmr generator help']
};


export default function HelpPage() {
  // 帮助页面FAQ数据
  const helpFaqData = [
    {
      id: 'how-to-get-started',
      question: 'How do I get started with CuttingASMR.org?',
      answer: 'Simply sign up for a free account, choose an ASMR type from our templates, write your prompt, and click generate. New users get free credits to try our AI ASMR generator powered by Google Veo3.'
    },
    {
      id: 'payment-billing',
      question: 'How does billing and payment work?',
      answer: 'We use a credit-based system. Purchase credits once and use them anytime - they never expire. Each video generation costs 10 credits. We accept major credit cards through our secure payment processor.'
    },
    {
      id: 'video-quality',
      question: 'What video quality do you provide?',
      answer: 'All videos are generated in high definition (720p) by default, with 1080p available for download. Videos are optimized for YouTube Shorts, TikTok, and other social media platforms.'
    },
    {
      id: 'technical-support',
      question: 'How can I get technical support?',
      answer: 'Contact our support team at supportadmin@cuttingasmr.org for technical issues, billing questions, or general help. We typically respond within 24 hours.'
    },
    {
      id: 'commercial-use',
      question: 'Can I use generated videos commercially?',
      answer: 'Yes! All videos generated with paid credits include commercial usage rights. You can monetize your ASMR videos on YouTube, TikTok, and other platforms without restrictions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <SEOHead
        title="Help & Support - AI ASMR Generator | CuttingASMR.org"
        description="Get help with CuttingASMR.org AI ASMR video generator. FAQ, support contact, billing help, and technical assistance for Gemini Veo3 powered platform."
        canonical="https://cuttingasmr.org/help"
        keywords="ASMR help, AI video support, CuttingASMR support, ASMR FAQ, technical help"
      />
      
      {/* 添加结构化数据 */}
      <StructuredData 
        type="faq"
        faqs={helpFaqData}
        pageUrl="https://cuttingasmr.org/help"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-slate-700/50">
          <h1 className="text-4xl font-bold text-white mb-8">Help & Support</h1>
          
          <div className="prose prose-lg max-w-none">
            {/* Platform Information */}
            <div className="bg-blue-500/20 rounded-xl p-6 mb-8 border border-blue-500/30">
              <h2 className="text-xl font-bold text-white mb-3">About Our Platform</h2>
              <p className="text-slate-300 mb-3">
                CuttingASMR.org is an independent AI wrapper platform that provides enhanced access to Google's VEO3 AI model through our custom interface. We are not affiliated with, endorsed by, or sponsored by Google.
              </p>
              <p className="text-xs text-slate-400">
                <strong>Disclaimer:</strong> This platform is not affiliated with, endorsed by, or sponsored by Google. VEO3 is a trademark of Google LLC.
              </p>
            </div>

            {/* Contact Support */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-500/20 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-lg font-bold text-white">Email Support</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Get help with your account, billing, or technical issues
                </p>
                                 <a 
                   href="mailto:supportadmin@cuttingasmr.org"
                   className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                 >
                   supportadmin@cuttingasmr.org
                 </a>
              </div>

              <div className="bg-green-500/20 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-lg font-bold text-white">Response Time</h3>
                </div>
                <p className="text-slate-300 mb-4">
                  We respond to all support requests within 3 business days
                </p>
                <div className="text-sm text-green-400 font-medium">
                  ✓ Fast & Reliable Support
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border border-slate-600/50 rounded-lg p-6 bg-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-2">How does the AI video generation work?</h3>
                <p className="text-slate-300">
                  Our platform uses Google's VEO3 AI model to generate ASMR videos based on your prompts. We provide a custom interface with specialized templates and enhanced user experience.
                </p>
              </div>

                            <div className="border border-slate-600/50 rounded-lg p-6 bg-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-2">How can I manage my payments and subscriptions?</h3>
                <p className="text-slate-300 mb-3">
                  You can manage your payments and subscriptions in several ways:
                </p>
                <ul className="text-slate-300 text-sm space-y-1 mb-3">
                  <li>• Visit your <a href="/profile" rel="nofollow" className="text-cyan-400 hover:text-cyan-300 underline">Profile page</a> and click "管理支付方式"</li>
                  <li>• This will open the secure Creem Customer Portal</li>
                  <li>• Update payment methods, view billing history, and manage subscriptions</li>
                  <li>• Contact our support team at supportadmin@cuttingasmr.org for assistance</li>
                </ul>
                <p className="text-xs text-slate-400">
                  Note: All payment processing is handled securely through Creem's customer portal.
                </p>
              </div>

              <div className="border border-slate-600/50 rounded-lg p-6 bg-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-2">Do my credits expire?</h3>
                <p className="text-slate-300">
                  No! Your credits never expire. Use them whenever inspiration strikes, at your own pace.
                </p>
              </div>

              <div className="border border-slate-600/50 rounded-lg p-6 bg-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-2">Can I use generated videos commercially?</h3>
                <p className="text-slate-300">
                  Yes! All videos generated through our platform come with full commercial usage rights. You can use them for YouTube, client projects, or any commercial purpose.
                </p>
              </div>

              <div className="border border-slate-600/50 rounded-lg p-6 bg-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-2">What is an AI wrapper service?</h3>
                <p className="text-slate-300">
                  An AI wrapper service provides a custom interface and additional features on top of existing AI models. We enhance Google's VEO3 with specialized ASMR templates, user-friendly interface, and workflow improvements.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
              <p className="text-slate-300 mb-6">
                Our support team is here to help you succeed with your ASMR content creation
              </p>
                             <a 
                 href="mailto:supportadmin@cuttingasmr.org"
                 className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
               >
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 