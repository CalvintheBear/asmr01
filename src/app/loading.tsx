/**
 * 全局加载页面
 * 用于Next.js App Router的loading状态
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* 加载动画 */}
          <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-300 text-lg">加载中...</p>
      </div>
    </div>
  );
} 