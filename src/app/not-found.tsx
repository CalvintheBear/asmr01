import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">页面未找到</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            返回首页
          </Link>
          
          <div className="mt-4">
            <Link 
              href="/pricing"
              className="text-purple-600 hover:underline mx-2"
            >
              查看定价
            </Link>
            <span className="text-gray-400">|</span>
            <Link 
              href="/help"
              className="text-purple-600 hover:underline mx-2"
            >
              帮助中心
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 