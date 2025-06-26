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
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>500</h1>
        <p>服务器内部错误</p>
        <button
          onClick={() => reset()}
          style={{
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          重试
        </button>
        <a href="/" style={{
          color: '#7c3aed',
          textDecoration: 'none'
        }}>
          返回首页
        </a>
      </div>
    </div>
  )
} 