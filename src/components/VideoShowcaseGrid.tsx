'use client';

import { useState } from 'react';
import { ShowcaseVideo } from '@/data/video-types';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';

interface VideoShowcaseGridProps {
  videos: ShowcaseVideo[];
}

export default function VideoShowcaseGrid({ videos }: VideoShowcaseGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<ShowcaseVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video: ShowcaseVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 items-stretch">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={handleVideoClick}
          />
        ))}
      </div>

      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
} 