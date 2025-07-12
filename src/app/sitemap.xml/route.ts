import { NextResponse } from 'next/server'

export const runtime = 'edge'

// 静态列出最重要的页面 URL，可按需扩充 / 自动化
const staticPaths: string[] = [
  '/',
  '/about',
  '/pricing',
  '/asmr-types',
  '/video-showcase',
  '/make-money-with-ai-asmr',
  '/ai-vs-traditional-asmr',
  '/perplexity-for-creators',
  '/earn-money-with-perplexity-ai',
  '/make-money-with-ai',
  '/help',
  '/privacy',
  '/terms',
  '/refund',
]

export async function GET() {
  const baseUrl = 'https://cuttingasmr.org'

  const urlEntries = staticPaths
    .map((path) => {
      return `  <url>\n    <loc>${baseUrl}${path}</loc>\n  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
} 