import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy - CuttingASMR.org | AI ASMR Video Generator',
  description: 'Read our refund policy to understand the terms and conditions for requesting refunds on CuttingASMR.org AI ASMR video generation service.',
  keywords: 'refund policy, money back guarantee, refund terms, ASMR refund, AI video refund',
  openGraph: {
    title: 'Refund Policy - CuttingASMR.org',
    description: 'Comprehensive refund policy for our AI ASMR video generation platform.',
    url: 'https://cuttingasmr.org/refund',
    type: 'website',
  },
}

export default function RefundPolicy() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">Effective Date: January 8, 2025</p>
            
            <p className="mb-8 text-lg leading-relaxed">
              At CuttingASMR.org, we strive to provide our users with the best experience possible. We understand that circumstances may change, and you might need to request a refund. Please read our refund policy carefully before making a purchase.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700 font-medium">
                    Important Notice: Please understand our refund conditions before making a purchase to ensure you meet the eligibility requirements.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Refund Eligibility</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                             <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                 <div className="flex items-center mb-3">
                   <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                     <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                   <h3 className="text-lg font-semibold text-red-800">Time Limit</h3>
                 </div>
                 <p className="text-red-700">
                   Refund requests must be made within <strong>3 days</strong> of your purchase. After this period, we cannot process any refund requests.
                 </p>
               </div>

               <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                 <div className="flex items-center mb-3">
                   <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                     <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                     </svg>
                   </div>
                   <h3 className="text-lg font-semibold text-orange-800">Credit Usage</h3>
                 </div>
                 <p className="text-orange-700">
                   If you have used more than <strong>10 credits</strong>, you are not eligible for a refund, regardless of the time since purchase.
                 </p>
               </div>
            </div>

                         <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">How to Request a Refund</h2>
             <p className="mb-6">
               If you meet the eligibility criteria and wish to request a refund, please follow these steps:
             </p>

             <div className="space-y-6 mb-8">
               <div className="flex items-start space-x-4">
                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                   <span className="text-purple-600 font-bold text-sm">1</span>
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
                   <p className="text-gray-700">
                     Reach out to our support team at <a href="mailto:j2983236233@gmail.com" className="text-purple-600 hover:text-purple-700 underline font-medium">j2983236233@gmail.com</a>.
                   </p>
                 </div>
               </div>

               <div className="flex items-start space-x-4">
                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                   <span className="text-purple-600 font-bold text-sm">2</span>
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Provide Details</h3>
                   <p className="text-gray-700 mb-3">Include the following information in your email:</p>
                   <ul className="list-disc pl-6 space-y-1 text-gray-700">
                     <li>Your account details</li>
                     <li>Order number</li>
                     <li>Purchase date</li>
                     <li>Reason for the refund request</li>
                   </ul>
                 </div>
               </div>

               <div className="flex items-start space-x-4">
                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                   <span className="text-purple-600 font-bold text-sm">3</span>
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Within 3 Days</h3>
                   <p className="text-gray-700">
                     Ensure your request is submitted within 3 days of your purchase.
                   </p>
                 </div>
               </div>
             </div>

                         <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Processing Refunds</h2>
             <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
               <p className="text-green-800">
                 Once we receive your refund request, we will review it and notify you of the outcome soon. If approved, your refund will be processed to your original payment method.
               </p>
             </div>



                         <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Special Circumstances</h2>
             <div className="space-y-4 mb-8">
               <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                 <h4 className="font-semibold text-yellow-800 mb-2">Technical Issues</h4>
                 <p className="text-yellow-700">
                   If our platform experiences technical problems that prevent normal service usage, we will prioritize your refund request without regular limitation constraints.
                 </p>
               </div>

               <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                 <h4 className="font-semibold text-blue-800 mb-2">Service Interruption</h4>
                 <p className="text-blue-700">
                   If our service experiences extended interruption (over 24 hours) that affects your normal usage, you may request a proportional refund.
                 </p>
               </div>
             </div>

             <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Non-Eligible Situations</h2>
             <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
               <p className="text-red-800 mb-4 font-medium">The following situations are not eligible for refunds:</p>
               <ul className="space-y-2 text-red-700">
                 <li>• Requesting refund after 3 days from purchase</li>
                 <li>• Having used more than 10 video generation credits</li>
                 <li>• Change of mind for personal reasons (after normal service usage)</li>
                 <li>• Requesting refund after violating our terms of service</li>
                 <li>• Requesting refund after malicious use or abuse of service</li>
               </ul>
             </div>

                         <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Changes to This Policy</h2>
             <p className="mb-6">
               We reserve the right to update our refund policy at any time. Any changes will be reflected on this page, and we encourage you to review it periodically. Major changes will be communicated to users in advance via email or website notifications.
             </p>

             <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
               <h3 className="text-lg font-semibold text-purple-800 mb-3">Need Help?</h3>
               <p className="text-purple-700 mb-3">
                 If you have any questions about our refund policy or need to request a refund, please don't hesitate to contact us:
               </p>
               <div className="flex items-center space-x-2">
                 <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
                 <a href="mailto:j2983236233@gmail.com" className="text-purple-600 hover:text-purple-700 underline font-medium">
                   j2983236233@gmail.com
                 </a>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
