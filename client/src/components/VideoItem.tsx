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
  const [showHeart, setShowHeart] = useState(false);
  const [lastTap, setLastTap] = useState(0);

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

  // Handle double tap to like
  const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent if tapping on controls
    if ((e.target as HTMLElement).closest('.video-controls')) {
      return;
    }
    
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
      setIsLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
    
    setLastTap(currentTime);
  };

  return (
    <div 
      ref={containerRef}
      className="video-item relative h-screen snap-start snap-always"
      onTouchEnd={handleDoubleTap}
      onClick={handleDoubleTap}
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
      
      {/* Double tap heart animation */}
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#FE2C55" stroke="#FE2C55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart animate-[heartbeat_1s_ease-in-out]">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
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
