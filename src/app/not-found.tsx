// 强制动态渲染 - 避免预渲染错误
export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1>404</h1>
            <p>页面未找到</p>
            <a href="/" style={{
              color: '#7c3aed',
              textDecoration: 'none'
            }}>
              返回首页
            </a>
          </div>
        </div>
      </body>
    </html>
  )
} 