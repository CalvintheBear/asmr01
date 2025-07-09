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
                  src="/logo.svg" 
                  alt="CuttingASMR - AI ASMR Video Generator Privacy Policy Logo" 
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
              <li><strong>Service</strong> refers to the AI-powered ASMR video generation platform and related tools that we offer. These tools are designed for creating personalized ASMR content, including video generation, sound enhancement, and content customization, to provide you with innovative relaxation solutions.</li>
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
              The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Service:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Google</li>
            </ul>
            <p className="mb-6">
              If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal Data that is already associated with Your third-party account, such as Your name, Your email address, Your activities, or Your contact list.
            </p>

            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Tracking Technologies and Cookies</h4>
            <p className="mb-6">
              We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.
            </p>
            <p className="mb-6">
              <strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of Our Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Use of Your Personal Data</h3>
            <p className="mb-4">The Company may use Personal Data for the following purposes:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>To provide and maintain our Service</strong>, including monitoring the usage of our Service and ASMR video generation features.</li>
              <li><strong>To manage Your Account</strong>: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
              <li><strong>To provide personalized ASMR content</strong>: to customize video generation based on your preferences and usage patterns.</li>
              <li><strong>To provide You with news, special offers and general information</strong> about other ASMR content, services and features that we offer that are similar to those that you have already used or enquired about, unless You have opted not to receive such information.</li>
              <li><strong>To manage Your requests</strong>: To attend and manage Your requests to Us.</li>
              <li><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our ASMR content recommendations, as well as evaluating and improving our Service, products, services, marketing, and your overall experience.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Retention of Your Personal Data</h3>
            <p className="mb-6">
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p className="mb-6">
              The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Deletion of Your Personal Data</h3>
            <p className="mb-6">
              You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
            </p>
            <p className="mb-6">
              Our Service may give You the ability to delete certain information about You from within the Service. This includes, for example, the option to delete your ASMR preferences and video generation history.
            </p>
            <p className="mb-6">
              You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Security of Your Personal Data</h3>
            <p className="mb-6">
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Content Restrictions</h2>
            <p className="mb-6">
              To maintain a safe, ethical, and responsible platform, we have established the following content restrictions for all users of our AI-generated ASMR content website. These restrictions apply to any content that is generated, uploaded, or shared on our platform.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Prohibited Content</h3>
            <p className="mb-4">We prohibit the following types of content:</p>
                          <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li><strong>Illegal Content</strong>: Any content that promotes, facilitates, or engages in illegal activities, including but not limited to fraud, violence, or the sale of illegal goods or services.</li>
              <li><strong>Harmful Content</strong>: Content that incites hatred, violence, or discrimination based on race, religion, gender, sexual orientation, or other protected characteristics.</li>
              <li><strong>Explicit or Adult Content</strong>: Pornographic, excessively violent, or otherwise inappropriate content, including depictions of sexual abuse, child exploitation, or animal abuse.</li>
              <li><strong>Intellectual Property Infringement</strong>: Content that infringes on the copyright, trademark, or other intellectual property rights of others.</li>
              <li><strong>False or Misleading Content</strong>: Content that is intentionally false, misleading, or deceptive, particularly when presented as factual.</li>
              <li><strong>Privacy Violations</strong>: Content that discloses personal information without consent or violates the privacy of others.</li>
              <li><strong>Hate Speech</strong>: Content that promotes hatred, discrimination, or hostility toward individuals or groups based on protected characteristics.</li>
              <li><strong>Harassment and Bullying</strong>: Content that targets individuals or groups with the intent to harass, threaten, or bully.</li>
              <li><strong>Self-Harm and Suicide</strong>: Content that promotes or glorifies self-harm, suicide, or other dangerous behaviors.</li>
              <li><strong>Spam and Malware</strong>: Spam content, content containing malware, or content designed to phish, scam, or harm users.</li>
              <li><strong>Impersonation</strong>: Content that impersonates individuals, organizations, or entities in a misleading or deceptive manner.</li>
              <li><strong>Prohibited Uses</strong>: Using our service for any illegal or prohibited purposes, including but not limited to illegal gambling, virus distribution, or interference with our service.</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Additional Restrictions for AI-Generated ASMR Content</h3>
            <p className="mb-4">
              Since our platform utilizes AI to generate ASMR content, we have additional restrictions to ensure ethical and responsible use of this technology:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>No Misrepresentation</strong>: You may not claim AI-generated content as your own creation without proper disclosure.</li>
              <li><strong>No Sensitive Data Input</strong>: You may not input sensitive personal data (such as racial or ethnic origin, political opinions, religious beliefs, health data, or sexual orientation) into our AI tools.</li>
              <li><strong>No Harmful Output</strong>: You may not use our AI tools to generate harmful, offensive, or content that violates the above prohibitions.</li>
              <li><strong>Appropriate ASMR Content</strong>: Generated content must be suitable for relaxation and wellness purposes and maintain the therapeutic nature of ASMR content.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Enforcement</h3>
            <p className="mb-6">
              We reserve the right to remove any content that violates these restrictions and take appropriate action, including suspension or termination of accounts. We may also report illegal activities to relevant authorities.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Opt-Out of Information Use</h2>
            <p className="mb-6">
              CuttingASMR.org collects and uses personal information to provide and enhance our ASMR generation services, personalize your experience, and provide relevant content recommendations. We respect your privacy and outline various ways you can opt out of certain personal information use. Please review the following information to exercise your rights:
            </p>

            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Browser Settings</strong>: You can configure your browser settings to refuse the use of cookies. Please note that doing so may affect the full functionality of our website and the ASMR generation services we provide.</li>
              <li><strong>Opt-Out of Personalized Content</strong>: If you wish to opt out of personalized ASMR content recommendations, please contact us at supportadmin@cuttingasmr.org.</li>
              <li><strong>Account Deactivation</strong>: You can request deactivation of your account at any time by contacting us. Please send an email to supportadmin@cuttingasmr.org with your request. Once your account is deactivated, we will ensure your personal information is processed in accordance with applicable privacy regulations.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Changes to This Privacy Policy</h2>
            <p className="mb-6">
              We may update Our Privacy Policy from time to time. We advise You to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. We may also communicate significant updates directly through notifications on the website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Contact Us</h2>
            <p className="mb-6">
              If you have any questions or concerns about this Privacy Policy, you can contact us by email: supportadmin@cuttingasmr.org
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 
