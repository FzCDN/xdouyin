import { useState, useRef, useCallback } from "react";

export default function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Changed from true to false to unmute videos by default
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [isMuted]);
  
  const setSpeed = useCallback((rate: number) => {
    if (!videoRef.current) return;
    
    // Clamp rate between 0.5 and 3
    const clampedRate = Math.max(0.5, Math.min(3, rate));
    videoRef.current.playbackRate = clampedRate;
    setPlaybackRate(clampedRate);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    if (video.duration) {
      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent);
    }
    
    setIsPlaying(!video.paused);
  }, []);

  return {
    videoRef,
    isPlaying,
    isMuted,
    progress,
    playbackRate,
    togglePlay,
    toggleMute,
    setSpeed,
    handleTimeUpdate
  };
}
