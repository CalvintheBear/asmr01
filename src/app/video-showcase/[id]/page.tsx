import { showcaseVideos } from '@/data/showcase-videos'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

// 使用动态导入避免 "use client" 组件在服务器打包
const VideoDetailPage = dynamic(() => import('@/components/VideoDetailPage'), {
  ssr: false,
})

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