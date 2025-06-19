import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - CuttingASMR.org | AI ASMR Video Generator',
  description: 'Read our terms of service to understand the rules and guidelines for using CuttingASMR.org AI ASMR video generation platform.',
  keywords: 'terms of service, user agreement, service conditions, ASMR terms, AI video terms',
  openGraph: {
    title: 'Terms of Service - CuttingASMR.org',
    description: 'Terms of service for our AI ASMR video generation platform.',
    url: 'https://cuttingasmr.org/terms',
    type: 'website',
  },
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/logo.svg" 
                  alt="CuttingASMR Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">CuttingASMR.org</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">Effective Date: January 8, 2025</p>
            
            <p className="mb-6">
              Welcome to CuttingASMR.org! These Terms of Service ("Terms") govern your use of our website located at https://cuttingasmr.org/ (the "Service") operated by CuttingASMR.org ("us", "we", or "our").
            </p>

            <p className="mb-8">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms then you may not access the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Service Description</h2>
            <p className="mb-6">
              CuttingASMR.org is an AI-powered ASMR video generation platform that allows users to create personalized ASMR content. Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>AI-powered ASMR video generation</li>
              <li>Multiple ASMR types and style selections</li>
              <li>High-quality video output</li>
              <li>User account management</li>
              <li>History tracking and preference settings</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">User Accounts</h2>
            <p className="mb-6">
              When creating an account, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            <p className="mb-6">
              You must immediately notify us of any unauthorized use of your account or any other breach of security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Terms of Use</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Permitted Use</h3>
            <p className="mb-4">You may use our Service for:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Creating lawful ASMR content</li>
              <li>Personal use and entertainment</li>
              <li>Educational purposes</li>
              <li>Commercial use (according to your subscription plan)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Prohibited Use</h3>
            <p className="mb-4">You may not:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Upload or generate harmful, fraudulent, or deceptive content</li>
              <li>Interfere with or disrupt the security features of the Service</li>
              <li>Attempt unauthorized access to any part of the Service</li>
              <li>Use automated systems or software to extract data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Subscription and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Free Trial</h3>
            <p className="mb-6">
              We offer 2 free ASMR video generations for new users. The free trial does not require payment information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Paid Subscriptions</h3>
            <p className="mb-6">
              Paid subscriptions are billed monthly or annually. Subscription fees are charged at the beginning of each billing cycle. You may cancel your subscription at any time in your account settings.
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Monthly Plan</strong>: $9.99/month</li>
              <li><strong>Annual Plan</strong>: $99/year (Save $20)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Refund Policy</h3>
            <p className="mb-6">
              We offer conditional refund services for users. Refund requests must be made within 3 days of purchase and with no more than 10 credits used. Please see our <Link href="/refund" className="text-purple-600 hover:text-purple-700 underline">Refund Policy</Link> page for detailed conditions and application process.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Intellectual Property</h2>
            <p className="mb-6">
              The Service and its original content, features and functionality are and will remain the exclusive property of CuttingASMR.org and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p className="mb-6">
              Content you generate through our AI tools belongs to you, but you grant us the right to use this content to improve our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">User Generated Content</h2>
            <p className="mb-6">
              Our Service may allow you to generate, upload, or provide content. You retain all rights to any content you provide. However, by providing content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content.
            </p>
            <p className="mb-6">
              You represent and warrant that you own all necessary rights to any content you provide and that your content will not infringe upon the rights of any third party.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Privacy Policy</h2>
            <p className="mb-6">
              Your privacy is important to us. Please review our <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">Privacy Policy</Link>, which also governs your use of the Service, to understand how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mb-6">
              Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Disclaimer</h2>
            <p className="mb-6">
              Your use of our Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied.
            </p>
            <p className="mb-6">
              We make no warranty that the Service will meet your requirements, be uninterrupted, timely, secure, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall CuttingASMR.org, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Governing Law</h2>
            <p className="mb-6">
              These Terms shall be interpreted and governed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p className="mb-6">
              Continued access to or use of our Service following the posting of any changes to these Terms constitutes acceptance of those changes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please contact us at j2983236233@gmail.com
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
