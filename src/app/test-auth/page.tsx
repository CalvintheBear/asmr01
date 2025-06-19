'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function TestAuth() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>加载中...</p>

  if (session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">OAuth测试成功！</h1>
        <p className="mb-4">已登录用户: {session.user?.email}</p>
        <button 
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          退出登录
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth测试页面</h1>
      <p className="mb-4">当前未登录</p>
      <button 
        onClick={() => signIn('google')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        使用Google登录
      </button>
    </div>
  )
} 
