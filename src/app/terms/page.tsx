import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | CuttingASMR',
  description: 'Please read our Terms of Service carefully before using our AI ASMR video generator. This agreement governs your use of our platform.',
  keywords: ['terms of service', 'user agreement', 'terms and conditions', 'legal', 'rules', 'usage policy']
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/pricing"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Link>

        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-slate-700/50">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-slate-300 prose-headings:text-white prose-strong:text-white prose-ul:text-slate-300 prose-li:text-slate-300">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By registering an account or accessing CuttingASMR.org ("Service"), you automatically accept and agree to be bound by these Terms of Service, our Privacy Policy, and Refund Policy. This agreement is required to use our services.
            </p>
            
            <p>
              <strong>Registration Consent</strong>: Creating an account constitutes explicit agreement to all our policies and terms. If you do not agree to these terms, you must not use our Service.
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
              <strong>Full Commercial Rights</strong>: Every ASMR video generated through our platform comes with complete commercial usage rights. Whether you're creating ASMR videos for YouTube monetization, client projects, or selling ASMR video content, you own the rights to each ASMR video. Many professional creators use our ASMR video generator for their commercial ASMR video productions.
            </p>
            
            <p>
              You retain all rights to videos generated through our service. You may use generated videos for personal and commercial purposes without restrictions or additional licensing fees.
            </p>

            <h2>4. Payment Terms</h2>
            <p>
              <strong>Cost-Effective Pricing</strong>: We offer very cost-effective pricing at just 15 credits per AI ASMR generation. New users receive free credits upon sign-up to try our Veo3 ASMR generator! We also offer various credit packs for frequent AI ASMR creators. Much more affordable than traditional production equipment using Veo3 ASMR technology.
            </p>
            
            <p>
              All payments are processed securely through Creem. Credits purchased do not expire. Refunds are available within 3 days of purchase if you have used fewer than 20 credits.
            </p>

            <h2>5. Disclaimer</h2>
            <p>
              The materials on CuttingASMR.org are provided on an 'as is' basis. CuttingASMR.org makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>6. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at supportadmin@cuttingasmr.org
            </p>

            <h2>7. Platform Disclosure and Third-Party Services</h2>
            <p>
              <strong>Independent Service:</strong> CuttingASMR.org is an independent platform that provides enhanced access to third-party AI models, specifically Google's VEO3. We are not affiliated with, endorsed by, or sponsored by Google LLC or any other AI model providers.
            </p>
            <p>
              <strong>Service Nature:</strong> Our platform functions as an AI wrapper service, providing:
            </p>
            <ul>
              <li>Custom user interface and user experience</li>
              <li>Specialized ASMR templates and prompts</li>
              <li>Credit-based access management</li>
              <li>Additional features and workflow enhancements</li>
            </ul>
            <p>
              <strong>Third-Party Dependencies:</strong> Our service depends on the availability and functionality of third-party AI models. We do not guarantee the performance or availability of underlying AI services.
            </p>
            <p>
              <strong>Disclaimer:</strong> This platform is not affiliated with, endorsed by, or sponsored by Google. VEO3 is a trademark of Google LLC.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
