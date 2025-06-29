import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

// 强制动态渲染 - 解决Railway构建问题
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CuttingASMR - Google Veo3 AI ASMR Generator | Best ASMR Creator Tools 2025',
  description: 'Google Veo3 powered ASMR creator tools for YouTube channels! Best Veo3 ASMR generator with AI technology. Professional ASMR maker software for content creators. Create relaxing videos, sleep ASMR, stress relief content.',
  keywords: 'google veo3, veo3, google veo3 asmr, veo3 asmr generator, asmr creator tools, best asmr generator, asmr maker software, asmr youtube channel, relaxing video maker, sleep asmr generator, ai content creator tools, content creator, stress relief videos, meditation video creator',
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
    <html lang="en">
      <head>
        {/* Website favicon configuration - Using real ICO file only */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Schema.org structured data for better SEO */}
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
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CuttingASMR AI ASMR Generator",
              "url": "https://cuttingasmr.org",
              "description": "Professional AI ASMR generator powered by Google Veo3. Create relaxing videos, sleep ASMR, and stress relief content for YouTube and TikTok.",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free credits for new users"
              },
              "author": {
                "@type": "Organization",
                "name": "CuttingASMR Team"
              },
              "keywords": "google veo3, veo3 asmr generator, ai video generator, asmr creator tools, best asmr generator, ai asmr video, relaxing video maker, sleep asmr generator, content creator tools, youtube shorts, tiktok shorts"
            })
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "CuttingASMR - Veo3 AI ASMR Generator",
              "applicationCategory": "VideoEditing",
              "operatingSystem": "Web",
              "description": "AI-powered ASMR video generator using Google Veo3 technology. Create professional ASMR content for YouTube channels and TikTok with glass cutting, fruit slicing, and relaxation videos.",
              "url": "https://cuttingasmr.org",
              "author": {
                "@type": "Organization",
                "name": "CuttingASMR",
                "url": "https://cuttingasmr.org"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "description": "Free credits for new users to try AI ASMR generation"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "127",
                "bestRating": "5"
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
        <ClerkProvider publishableKey={publishableKey}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
} 
