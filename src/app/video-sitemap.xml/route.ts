import { showcaseVideos } from '@/data/showcase-videos'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// 生成符合 Google Video Sitemap 规范的 XML
export async function GET() {
  const baseUrl = 'https://cuttingasmr.org'

  const itemsXml = showcaseVideos
    .map((video) => {
      const thumbnailUrl = video.thumbnailUrl.replace(/\s/g, '%20')
      const contentUrl = video.videoUrl.replace(/\s/g, '%20')
      const uploadDate = new Date(video.createdAt).toISOString()
      const durationSeconds = (() => {
        const parts = video.duration.split(':')
        if (parts.length === 2) {
          return parseInt(parts[0]) * 60 + parseInt(parts[1])
        }
        return 60
      })()

      return `
  <url>
    <loc>${baseUrl}/video-showcase/${video.id}</loc>
    <video:video>
      <video:thumbnail_loc>${thumbnailUrl}</video:thumbnail_loc>
      <video:title><![CDATA[${video.title}]]></video:title>
      <video:description><![CDATA[${video.description}]]></video:description>
      <video:content_loc>${contentUrl}</video:content_loc>
      <video:duration>${durationSeconds}</video:duration>
      <video:publication_date>${uploadDate}</video:publication_date>
    </video:video>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${itemsXml}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
} 