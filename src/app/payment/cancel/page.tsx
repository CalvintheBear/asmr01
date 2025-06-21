export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          支付已取消
        </h1>
        
        <p className="text-gray-600 mb-6">
          您已取消了此次支付。如果这是一个误操作，您可以重新尝试购买积分。
        </p>
        
        <div className="space-y-3">
          <a
            href="/pricing"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            重新购买积分
          </a>
          
          <a
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors inline-block"
          >
            返回首页
          </a>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            如有问题，请联系客服获取帮助
          </p>
        </div>
      </div>
    </div>
  );
} 