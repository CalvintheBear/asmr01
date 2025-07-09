import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - CuttingASMR.org | AI ASMR Video Generator',
  description: 'Read our comprehensive privacy policy to understand how CuttingASMR.org collects, uses, and protects your personal data while using our AI ASMR video generation service.',
  keywords: 'privacy policy, data protection, personal information, ASMR privacy, AI video privacy',
  openGraph: {
    title: 'Privacy Policy - CuttingASMR.org',
    description: 'Comprehensive privacy policy for our AI ASMR video generation platform.',
    url: 'https://cuttingasmr.org/privacy',
    type: 'website',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/favicon.ico" 
                  alt="CuttingASMR Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold text-white">CuttingASMR.org</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 md:p-12 border border-slate-700/50">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none text-slate-300 prose-headings:text-white prose-strong:text-white prose-ul:text-slate-300 prose-li:text-slate-300 prose-ol:text-slate-300">
            <p className="text-sm text-slate-400 mb-8">Effective Date: January 8, 2025</p>
            
            <p className="mb-6">
              This Privacy Policy of CuttingASMR.org ("We," "Us," or "Our") describes Our policies and procedures on how we might collect, store, use, and/or share Your information when You use our Service. This includes use of our website at https://cuttingasmr.org/ (the "Website"). The Privacy Policy also tells You about Your privacy rights and how the law protects You.
            </p>

            <p className="mb-8">
              We use Your Personal Data to provide and improve the Service. By using the Website, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>

            <p className="mb-8">
              Should you have any questions or concerns regarding this Privacy Policy and our services, please check our Terms and Conditions, or contact us directly via supportadmin@cuttingasmr.org.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Interpretation and Definitions</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Interpretation</h3>
            <p className="mb-6">
              The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Definitions</h3>
            <p className="mb-4">For the purposes of this Privacy Policy:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Website</strong> refers to CuttingASMR.org, accessible from https://cuttingasmr.org/</li>
              <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Company</strong> (referred to as either "the Company", "we", "us" or "our" in this Agreement) refers to CuttingASMR.org.</li>
              <li><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
              <li><strong>Service</strong> refers to the AI-powered ASMR video generation platform and related tools that we offer. These tools are designed for creating personalized ASMR content, including video generation, sound enhancement, and content customization.</li>
              <li><strong>Third-party Social Media Service</strong> refers to any website or any social network website through which a User can log in or create an account to use the Service.</li>
              <li><strong>You</strong> refers to the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Collecting and Using Your Personal Data</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Types of Data Collected</h3>

            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Personal Data</h4>
            <p className="mb-4">
              While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Email address</li>
              <li>Usage Data</li>
              <li>Social Media Information</li>
              <li>Web Cookies</li>
              <li>ASMR preferences and content selections</li>
              <li>Video generation history and preferences</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Information from Third-Party Social Media Services</h4>
            <p className="mb-4">
              The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Google</li>
              <li>Facebook</li>
              <li>Twitter</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Tracking Technologies and Cookies</h4>
            <p className="mb-6">
              We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Use of Your Personal Data</h3>
            <p className="mb-4">The Company may use Personal Data for the following purposes:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
              <li><strong>To manage Your Account</strong>: to manage Your registration as a user of the Service.</li>
              <li><strong>To provide personalized ASMR content</strong>: to customize video generation based on your preferences.</li>
              <li><strong>To contact You</strong>: To contact You by email regarding updates or informative communications.</li>
              <li><strong>To manage Your requests</strong>: To attend and manage Your requests to Us.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Retention of Your Personal Data</h3>
            <p className="mb-6">
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Delete Your Personal Data</h3>
            <p className="mb-6">
              You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. Our Service may give You the ability to delete certain information about You from within the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Security of Your Personal Data</h3>
            <p className="mb-6">
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Content Restrictions</h2>
            <p className="mb-6">
              To maintain a safe, ethical, and responsible platform, we have established the following content restrictions for all users of our AI-generated ASMR content website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Prohibited Content</h3>
            <p className="mb-4">We prohibit the following types of content:</p>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li><strong>Illegal Content</strong>: Any content that promotes, facilitates, or engages in illegal activities.</li>
              <li><strong>Harmful Content</strong>: Content that incites hatred, violence, or discrimination.</li>
              <li><strong>Explicit or Adult Content</strong>: Pornographic, excessively violent, or otherwise inappropriate content.</li>
              <li><strong>Intellectual Property Infringement</strong>: Content that infringes upon copyrights, trademarks, or other intellectual property rights.</li>
              <li><strong>False or Misleading Content</strong>: Content that is intentionally false, misleading, or deceptive.</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Additional Restrictions for AI-Generated ASMR Content</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>No Misrepresentation</strong>: You must not represent AI-generated content as being created by you without proper disclosure.</li>
              <li><strong>No Sensitive Data Input</strong>: You must not input sensitive personal data into our AI tools.</li>
              <li><strong>No Harmful Outputs</strong>: You must not use our AI tools to generate harmful or offensive content.</li>
              <li><strong>Appropriate ASMR Content</strong>: Generated content must be suitable for relaxation and wellness purposes.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Changes to this Privacy Policy</h2>
            <p className="mb-6">
              We may update Our Privacy Policy from time to time. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Contact Us</h2>
            <p className="mb-6">
              If you have any questions or concerns about this Privacy Policy, you can contact us by email at: supportadmin@cuttingasmr.org
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 
