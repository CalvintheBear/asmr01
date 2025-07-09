// 强制动态渲染 - 避免预渲染错误
export const dynamic = 'force-dynamic'

export default function NotFound() {
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
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#cbd5e1' }}>页面未找到</p>
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