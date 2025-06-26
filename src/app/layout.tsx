import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import ClientSideScript from '../components/ClientSideScript'

// 强制动态渲染 - 解决Railway构建问题
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CuttingASMR - AI ASMR视频生成器',
  description: '使用最新的Google Veo3 AI技术生成专业的ASMR视频。完美适用于YouTube、TikTok创作者和ASMR制作者。无需编辑技能，几分钟内生成高质量的放松视频内容。',
  keywords: 'ASMR, AI视频生成, YouTube, TikTok, 放松视频, Veo3',
  authors: [{ name: 'CuttingASMR Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'CuttingASMR - AI ASMR视频生成器',
    description: '使用AI技术生成专业ASMR视频，完美适用于内容创作者',
    url: 'https://cuttingasmr.org',
    siteName: 'CuttingASMR',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CuttingASMR - AI ASMR视频生成器',
    description: '使用AI技术生成专业ASMR视频',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  return (
    <html lang="zh-CN">
      <head>
        {/* 网站图标设置 */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-X6FN29E8XC"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-X6FN29E8XC');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClerkProvider publishableKey={publishableKey}>
          {children}
        </ClerkProvider>
        <ClientSideScript />
      </body>
    </html>
  )
} 
