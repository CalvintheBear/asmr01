import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { enUS } from "@clerk/localizations";

// 强制动态渲染 - 解决Railway构建问题
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const inter = Inter({ subsets: ['latin'] })

// 分离viewport配置 - Next.js 14+要求
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'CuttingASMR - Google Veo3 AI Video Generator | Best ASMR Creator Tools 2025',
  description: 'Free AI video generator.Google Veo3 powered video generator. Best Veo3 ASMR generator with AI technology. ',
  keywords: 'free ai video generator, earn money by AI,create AI yeti vlog, AI asmr generator,AI side jobs 2025, create AI asmr video, , ai video prompt, ai glass cutting, make money with ai, ice cutting asmr, ai asmr cutting, asmr video prompt, AI video monetization',
  alternates: {
    canonical: 'https://cuttingasmr.org'
  },
  authors: [{ name: 'CuttingASMR Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'CuttingASMR - Free Veo3 AI Video Generator | Best AI ASMR Maker',
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
    <ClerkProvider publishableKey={publishableKey} localization={enUS}>
      <html lang="en">
        <head>
          {/* Website favicon configuration - Using real ICO file only */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
          <meta name="msapplication-TileImage" content="/favicon.ico" />
          <meta name="theme-color" content="#ffffff" />
          
          {/* 基础结构化数据 - 网站级别 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "CuttingASMR",
                "url": "https://cuttingasmr.org",
                "description": "Google Veo3 powered ASMR creator tools for YouTube channels. Best AI ASMR generator with advanced technology for content creators.",
                "sameAs": [
                  "https://cuttingasmr.org"
                ],
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://cuttingasmr.org/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
          
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
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
} 
