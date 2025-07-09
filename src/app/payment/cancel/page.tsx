import SEOHead from '@/components/SEOHead'

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <SEOHead
        title="Payment Cancelled - CuttingASMR.org | Return to Purchase ASMR Credits"
        description="Payment was cancelled. You can retry purchasing AI ASMR credits anytime. Secure payment powered by Creem with instant credit delivery."
        canonical="https://cuttingasmr.org/payment/cancel"
        keywords="payment cancelled, retry purchase, ASMR credits"
      />
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          You have cancelled this payment. If this was a mistake, you can try purchasing credits again.
        </p>
        
        <div className="space-y-3">
          <a
            href="/pricing"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors inline-block"
          >
            Purchase Credits Again
          </a>
          
          <a
            href="/"
            className="w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors inline-block"
          >
            Back to Home
          </a>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            If you have any questions, please contact our support team for assistance
          </p>
        </div>
      </div>
    </div>
  );
} 