import { showcaseVideos } from '@/data/showcase-videos'
import { notFound } from 'next/navigation'
import VideoDetailPage from '@/components/VideoDetailPage'
import type { Metadata } from 'next'

interface PageProps {
  params: {
    id: string
  }
}

// 动态生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const video = showcaseVideos.find((v) => v.id === params.id)
  if (!video) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.',
    }
  }

  const seoTitle = `${video.title} - AI Video Prompt`
  const seoDescription = video.seoDescription || `Explore the prompt for "${video.title}". Use this powerful ai video prompt with our Veo3-powered AI ASMR video generator to create your own unique asmr content.`
  const canonicalUrl = `https://cuttingasmr.org/video-showcase/${video.id}`

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      type: 'video.other',
      images: [
        {
          url: video.thumbnailUrl,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },
  }
}

export default function Page({ params }: PageProps) {
  const video = showcaseVideos.find((v) => v.id === params.id)
  if (!video) return notFound()
  return <VideoDetailPage video={video} />
} 