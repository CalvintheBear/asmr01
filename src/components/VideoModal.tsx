'use client';

import { useEffect, useRef } from 'react';
import { VideoModalProps } from '@/data/video-types';
import { X, Share2 } from 'lucide-react';

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // ESC key to close modal and cleanup
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
      // Pause video when component unmounts or modal closes
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isOpen]);

  // Pause video when modal closes or video changes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen, video]);

  if (!isOpen || !video) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    // Pause video before closing
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900 truncate pr-4">
            {video.title}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Share Video"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <div className="p-6">
          <div className="mb-4">
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block">
              {video.asmrType}
            </div>

            <p className="text-gray-700 text-base leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center pt-4 border-t">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 