import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import ClientSideScript from '../components/ClientSideScript'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI ASMR Generator - Powered by Gemini Veo3 | Create ASMR Videos with AI',
  description: 'Advanced AI ASMR video generator powered by Gemini Veo3 technology. Create professional AI-generated ASMR content for relaxation, sleep, and therapeutic wellness. FREE credits for new users!',
  keywords: 'AI ASMR generator,Gemini Veo3,AI ASMR videos,AI video generator,ASMR AI,artificial intelligence ASMR,AI generated ASMR,automated ASMR creation,AI wellness videos,free ASMR credits',
  authors: [{ name: 'CuttingASMR Wellness Team' }],
  creator: 'CuttingASMR',
  openGraph: {
    title: 'AI ASMR Generator - Powered by Gemini Veo3 Technology',
    description: 'Advanced AI ASMR video generator using cutting-edge Gemini Veo3 AI. Create professional AI-generated ASMR videos for relaxation and wellness. FREE credits for new users!',
    url: 'https://cuttingasmr.org',
    siteName: 'CuttingASMR.org',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // 如果没有 publishableKey，直接渲染内容（用于构建时避免Clerk错误）
  if (!publishableKey) {
    return (
      <html lang="zh-CN">
        <head>
          {/* 网站图标设置 */}
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link rel="apple-touch-icon" href="/logo.svg" />
        </head>
        <body className={inter.className}>
          {children}
          <ClientSideScript />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="zh-CN">
        <head>
          {/* 网站图标设置 */}
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link rel="apple-touch-icon" href="/logo.svg" />
          
          {/* 结构化数据标记 - 提升SEO和防AI检测 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "CuttingASMR - AI ASMR Generator Powered by Gemini Veo3",
                "description": "Advanced AI ASMR video generator utilizing Gemini Veo3 artificial intelligence for creating professional therapeutic content and wellness videos.",
                "url": "https://cuttingasmr.org",
                "applicationCategory": "HealthApplication",
                "operatingSystem": "Web",
                "author": {
                  "@type": "Organization",
                  "name": "CuttingASMR Wellness",
                  "url": "https://cuttingasmr.org"
                },
                "applicationSubCategory": "Wellness & Meditation",
                "featureList": [
                  "Gemini Veo3 AI ASMR video generation",
                  "Advanced AI-powered content creation",
                  "Automated ASMR video production",
                  "AI-generated therapeutic wellness content",
                  "Intelligent ASMR scene customization"
                ],
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Starter Package",
                    "price": "9.90",
                    "priceCurrency": "USD",
                    "description": "115 credits for therapeutic video generation"
                  },
                  {
                    "@type": "Offer", 
                    "name": "Standard Package",
                    "price": "30.00",
                    "priceCurrency": "USD",
                    "description": "355 credits for wellness content creation"
                  },
                  {
                    "@type": "Offer", 
                    "name": "Premium Package",
                    "price": "99.00",
                    "priceCurrency": "USD",
                    "description": "1450 credits for professional therapeutic content"
                  }
                ]
              })
            }}
          />
          

        </head>
        <body className={inter.className}>
          {children}
          <ClientSideScript />
        </body>
      </html>
    </ClerkProvider>
  )
} 
