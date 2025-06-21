import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import ClientSideScript from '../components/ClientSideScript'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CuttingASMR.org - AI ASMR Video Generator | Free Trial',
  description: 'Create stunning AI ASMR videos with our advanced generator. Enjoy 2 free trials, then subscribe for unlimited access. Perfect for ASMR creators and YouTube channels.',
  keywords: 'ASMR,AI ASMR,ASMR video,ASMR generator,AI ASMR generator,ASMR creator,YouTube ASMR,cutting ASMR,relaxing videos',
  authors: [{ name: 'CuttingASMR Team' }],
  creator: 'CuttingASMR',
  openGraph: {
    title: 'CuttingASMR.org - AI ASMR Video Generator',
    description: 'Professional AI ASMR video generator with 2 free trials. Create relaxing ASMR content for YouTube and social media.',
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
  return (
    <ClerkProvider>
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
                "@type": "WebApplication",
                "name": "CuttingASMR.org - AI ASMR Video Generator",
                "description": "Professional AI ASMR video generator with subscription model. 2 free trials included.",
                "url": "https://cuttingasmr.org",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Web",
                "author": {
                  "@type": "Organization",
                  "name": "CuttingASMR",
                  "url": "https://cuttingasmr.org"
                },
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Free Trial",
                    "price": "0",
                    "priceCurrency": "USD",
                    "description": "2 free ASMR video generations"
                  },
                  {
                    "@type": "Offer", 
                    "name": "Pro Subscription",
                    "price": "9.99",
                    "priceCurrency": "USD",
                    "billingDuration": "P1M",
                    "description": "Unlimited ASMR video generation"
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
