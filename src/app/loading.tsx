/**
 * 全局加载页面
 * 用于Next.js App Router的loading状态
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* 加载动画 */}
          <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 text-lg">加载中...</p>
      </div>
    </div>
  );
} 