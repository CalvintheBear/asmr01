import { showcaseVideos } from '@/data/showcase-videos'
import { notFound } from 'next/navigation'
import VideoDetailPage from '@/components/VideoDetailPage'

interface PageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: PageProps) {
  const video = showcaseVideos.find((v) => v.id === params.id)
  if (!video) return notFound()
  return <VideoDetailPage video={video} />
} 