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

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CuttingASMR.org ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use CuttingASMR.org for personal and commercial viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>attempt to decompile or reverse engineer any software contained on CuttingASMR.org</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2>3. Generated Content Rights</h2>
            <p>
              You retain all rights to videos generated through our service. You may use generated videos for personal and commercial purposes.
            </p>

            <h2>4. Payment Terms</h2>
            <p>
              All payments are processed securely through Creem. Credits purchased do not expire. Refunds may be available within 30 days of purchase.
            </p>

            <h2>5. Disclaimer</h2>
            <p>
              The materials on CuttingASMR.org are provided on an 'as is' basis. CuttingASMR.org makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>6. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at support@cuttingasmr.org
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
