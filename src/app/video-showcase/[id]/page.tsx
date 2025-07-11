import { showcaseVideos } from '@/data/showcase-videos'
import { notFound } from 'next/navigation'
import VideoDetailPage from '@/components/VideoDetailPage'
import Link from 'next/link'
import { ArrowLeft, Tag, FileText } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// 动态生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: videoId } = await params;
  const video = showcaseVideos.find((v) => v.id === videoId)

  if (!video) {
    return {
      title: 'Video Not Found',
    }
  }

  const defaultTitle = `${video.title} - AI ASMR Showcase`
  const defaultDescription = `Watch the AI-generated ASMR video "${video.title}". View the prompt used, and discover more content like ${video.asmrType}.`
  
  const keywords = [
    video.asmrType,
    'ai asmr',
    'veo3 asmr',
    `${video.asmrType.toLowerCase()} prompt`,
    'ai video prompt',
    'veo3 prompt',
    'text to video',
    ...(video.tags || []),
  ]

  return {
    title: video.seoTitle || defaultTitle,
    description: video.seoDescription || defaultDescription,
    keywords: keywords,
  }
}

export default async function VideoShowcaseDetailPage({ params }: PageProps) {
  const { id: videoId } = await params;
  const video = showcaseVideos.find((v) => v.id === videoId)

  if (!video) {
    return notFound()
  }

  return <VideoDetailPage video={video} />
} 