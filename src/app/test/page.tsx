export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Railway部署测试</h1>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">状态:</span>
            <span className="text-green-600 font-medium">✅ 正常运行</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">时间:</span>
            <span className="text-gray-900">{new Date().toLocaleString('zh-CN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">环境:</span>
            <span className="text-blue-600">Production</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-center">
            Railway部署成功 🚀
          </p>
        </div>
      </div>
    </div>
  )
} 
