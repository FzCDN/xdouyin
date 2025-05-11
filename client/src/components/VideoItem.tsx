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
      
      {/* Volume indicator */}
      {isPlaying && (
        <div 
          className="volume-icon absolute top-20 right-5 bg-black/50 rounded-full p-2 z-20"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-x">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="22" x2="16" y1="9" y2="15"/>
              <line x1="16" x2="22" y1="9" y2="15"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          )}
        </div>
      )}
      

      
      {/* Video controls */}
      <VideoControls 
        video={video}
        isLiked={isLiked}
        onLike={() => setIsLiked(!isLiked)}
      />
    </div>
  );
}
