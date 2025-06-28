import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

// 强制动态渲染 - 解决Railway构建问题
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CuttingASMR - ASMR Creator Tools | Best ASMR Generator & Maker Software 2025',
  description: 'ASMR creator tools for YouTube channels! Best ASMR generator with AI technology. ASMR maker software for content creators. Create relaxing videos, sleep ASMR, stress relief content.',
  keywords: 'asmr creator tools, best asmr generator, asmr maker software, asmr youtube channel, relaxing video maker, sleep asmr generator, ai content creator tools, content creator, stress relief videos, meditation video creator',
  authors: [{ name: 'CuttingASMR Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'CuttingASMR - Veo3 AI Video Generator | Best AI ASMR Maker',
    description: 'Create glass cutting, fruit ASMR videos with Google Veo3 AI. Perfect for YouTube shorts, TikTok content creation.',
    url: 'https://cuttingasmr.org',
    siteName: 'CuttingASMR',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CuttingASMR - Veo3 AI Video Generator',
    description: 'Create AI ASMR videos with Google Veo3 technology',
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
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
      </body>
    </html>
  )
} 
