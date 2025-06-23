import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Clock, Shield } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help & Support</h1>
          
          <div className="prose prose-lg max-w-none">
            {/* Platform Information */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About Our Platform</h2>
              <p className="text-gray-600 mb-3">
                CuttingASMR.org is an independent AI wrapper platform that provides enhanced access to Google's VEO3 AI model through our custom interface. We are not affiliated with, endorsed by, or sponsored by Google.
              </p>
              <p className="text-xs text-gray-500">
                <strong>Disclaimer:</strong> This platform is not affiliated with, endorsed by, or sponsored by Google. VEO3 is a trademark of Google LLC.
              </p>
            </div>

            {/* Contact Support */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-bold text-gray-900">Email Support</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Get help with your account, billing, or technical issues
                </p>
                                 <a 
                   href="mailto:supportadmin@cuttingasmr.org"
                   className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                 >
                   supportadmin@cuttingasmr.org
                 </a>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-bold text-gray-900">Response Time</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  We respond to all support requests within 3 business days
                </p>
                <div className="text-sm text-green-700 font-medium">
                  ✓ Fast & Reliable Support
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the AI video generation work?</h3>
                <p className="text-gray-600">
                  Our platform uses Google's VEO3 AI model to generate ASMR videos based on your prompts. We provide a custom interface with specialized templates and enhanced user experience.
                </p>
              </div>

                            <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I manage my payments and subscriptions?</h3>
                <p className="text-gray-600 mb-3">
                  You can manage your payments and subscriptions in several ways:
                </p>
                <ul className="text-gray-600 text-sm space-y-1 mb-3">
                  <li>• Visit your <a href="/profile" className="text-purple-600 hover:text-purple-700 underline">Profile page</a> and click "管理支付方式"</li>
                  <li>• This will open the secure Creem Customer Portal</li>
                  <li>• Update payment methods, view billing history, and manage subscriptions</li>
                  <li>• Contact our support team at supportadmin@cuttingasmr.org for assistance</li>
                </ul>
                <p className="text-xs text-gray-500">
                  Note: All payment processing is handled securely through Creem's customer portal.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do my credits expire?</h3>
                <p className="text-gray-600">
                  No! Your credits never expire. Use them whenever inspiration strikes, at your own pace.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use generated videos commercially?</h3>
                <p className="text-gray-600">
                  Yes! All videos generated through our platform come with full commercial usage rights. You can use them for YouTube, client projects, or any commercial purpose.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is an AI wrapper service?</h3>
                <p className="text-gray-600">
                  An AI wrapper service provides a custom interface and additional features on top of existing AI models. We enhance Google's VEO3 with specialized ASMR templates, user-friendly interface, and workflow improvements.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 text-center mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h3>
              <p className="text-gray-600 mb-6">
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