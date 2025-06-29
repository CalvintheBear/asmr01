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
