'use client'

// 强制动态渲染 - 解决构建时预渲染500页面的错误
export const dynamic = 'force-dynamic'

// 全局错误页面 - 处理500等服务器错误
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)',
      color: '#e2e8f0'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '1rem' }}>500</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#cbd5e1' }}>服务器内部错误</p>
        <button
          onClick={() => reset()}
          style={{
            background: 'linear-gradient(to right, #0891b2, #2563eb)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '12px',
            fontWeight: '500'
          }}
        >
          重试
        </button>
        <a href="/" style={{
          color: '#06b6d4',
          textDecoration: 'none',
          padding: '12px 24px',
          background: 'linear-gradient(to right, #0891b2, #2563eb)',
          borderRadius: '8px',
          display: 'inline-block',
          fontWeight: '500'
        }}>
          返回首页
        </a>
      </div>
    </div>
  )
} 