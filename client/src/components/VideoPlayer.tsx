import { useEffect, useRef, RefObject, useState } from "react";
import Hls from "hls.js";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  videoSrc: string | null;
  isHLS: boolean;
  posterSrc: string;
  isActive: boolean;
  isMuted: boolean;
  onTimeUpdate: () => void;
  onVideoClick: () => void;
}

export default function VideoPlayer({
  videoRef,
  videoSrc,
  isHLS,
  posterSrc,
  isActive,
  isMuted,
  onTimeUpdate,
  onVideoClick
}: VideoPlayerProps) {
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Tambahkan event listener untuk buffering state
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    const handleWaiting = () => {
      setIsLoading(true);
    };
    
    const handlePlaying = () => {
      setIsLoading(false);
    };
    
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    
    return () => {
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
    };
  }, [videoRef]);

  // Initialize video player and HLS if needed
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    videoElement.muted = isMuted;
    
    // If both mp4 and m3u8 are null, show error
    if (!videoSrc) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    // Setup HLS if needed and supported
    if (isHLS && videoSrc && Hls.isSupported()) {
      // Clean up previous HLS instance if it exists
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hls.loadSource(videoSrc as string);
      hls.attachMedia(videoElement);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isActive) {
          videoElement.play().catch(error => {
            console.error("Error playing video:", error);
          });
        }
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            // try to recover network error
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            // try to recover media error
            hls.recoverMediaError();
          } else {
            // cannot recover
            hls.destroy();
            setHasError(true);
          }
        }
      });
      
      hlsRef.current = hls;
      
      return () => {
        hls.destroy();
      };
    } 
    // Use native support for HLS if browser supports it
    else if (isHLS && videoSrc && videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = videoSrc;
      videoElement.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (isActive) {
          videoElement.play().catch(console.error);
        }
      });
      videoElement.addEventListener('error', () => {
        setHasError(true);
      });
    } 
    // Fallback to MP4
    else if (videoSrc) {
      videoElement.src = videoSrc;
      videoElement.addEventListener('loadeddata', () => {
        setIsLoading(false);
        if (isActive) {
          videoElement.play().catch(console.error);
        }
      });
      videoElement.addEventListener('error', () => {
        setHasError(true);
      });
    }
  }, [videoSrc, isHLS, isActive, isMuted, videoRef]);

  // Update muted state when it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, videoRef]);

  // Handle loading errors
  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle mx-auto mb-3 text-[#FE2C55]">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
          </svg>
          <p className="text-white">Failed to load video</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-[#FE2C55] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading video...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        loop
        poster={posterSrc}
        onClick={onVideoClick}
        onTimeUpdate={onTimeUpdate}
      />
    </>
  );
}
