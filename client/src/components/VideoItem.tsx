import { useRef, useEffect, useState } from "react";
import { Video } from "@shared/schema";
import VideoPlayer from "@/components/VideoPlayer";
import VideoControls from "@/components/VideoControls";
import useVideoPlayer from "@/hooks/useVideoPlayer";

interface VideoItemProps {
  video: Video;
  isActive: boolean;
  index: number;
}

export default function VideoItem({ video, isActive, index }: VideoItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { videoRef, isPlaying, isMuted, progress, togglePlay, toggleMute, handleTimeUpdate } = useVideoPlayer();
  const [isLiked, setIsLiked] = useState(false);

  // Handle active state changes
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
      });
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive, videoRef]);

  // Simple click to toggle play
  const handleVideoClick = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent if tapping on controls
    if ((e.target as HTMLElement).closest('.video-controls')) {
      return;
    }
    
    togglePlay();
  };

  return (
    <div 
      ref={containerRef}
      className="video-item relative h-screen snap-start snap-always"
      onTouchEnd={handleVideoClick}
      onClick={handleVideoClick}
    >
      {/* Progress bar */}
      <div className="progress-bar absolute top-0 left-0 right-0 h-[3px] bg-white/30 z-20">
        <div 
          className="h-full bg-[#FE2C55]" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Video player */}
      <VideoPlayer 
        videoRef={videoRef}
        videoSrc={video.m3u8 || video.mp4}
        isHLS={!!video.m3u8}
        posterSrc={video.image}
        isActive={isActive}
        isMuted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onVideoClick={togglePlay}
      />
      
      {/* Video controls */}
      <VideoControls 
        video={video}
        isLiked={isLiked}
        onLike={() => setIsLiked(!isLiked)}
      />
    </div>
  );
}