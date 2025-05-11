import { Video } from "@shared/schema";
import { useState, useRef, useEffect, RefObject } from "react";

// Declare VideoRef type directly here
type VideoRef = RefObject<HTMLVideoElement>;

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
  videoRef?: VideoRef;
}

export default function VideoControls({ video, isLiked, onLike, videoRef }: VideoControlsProps) {
  // State untuk touch gestures
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubStartX, setScrubStartX] = useState(0);
  const [showFastForward, setShowFastForward] = useState(false);
  const [fastForwardRate, setFastForwardRate] = useState(1);
  
  // Ref untuk timer
  const longPressTimerRef = useRef<any>(null);
  
  // Fungsi untuk memotong text jika terlalu panjang
  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  
  // Dapatkan deskripsi yang akan ditampilkan
  const description = video.description_en || video.title_en || "No description";
  const displayText = truncateText(description, 80);

  // Handle touch start - mendeteksi long press
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setScrubStartX(touch.clientX);
    
    console.log("Touch started");
    
    // Set timer untuk long press (300ms)
    longPressTimerRef.current = setTimeout(() => {
      console.log("Long press detected");
      setIsScrubbing(true);
      setShowFastForward(true);
    }, 300);
  };
  
  // Handle touch move - untuk fast forward saat swipe
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isScrubbing) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - scrubStartX;
    
    console.log("Touch move, delta:", deltaX);
    
    // Kalkulasi rate berdasarkan jarak swipe
    // Semakin jauh ke kanan, semakin cepat
    let rate = 1 + (deltaX / 50); // Diubah dari 100 ke 50 untuk lebih responsif
    rate = Math.max(1, Math.min(rate, 3)); // Batas rate: 1x - 3x
    
    console.log("Setting playback rate to:", rate);
    setFastForwardRate(rate);
    
    // Terapkan rate ke video jika videoRef tersedia
    if (videoRef?.current) {
      videoRef.current.playbackRate = rate;
    }
  };
  
  // Handle touch end - reset semua
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    console.log("Touch ended");
    
    // Clear timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Reset state
    setIsScrubbing(false);
    setShowFastForward(false);
    
    // Reset playback rate
    if (videoRef?.current) {
      videoRef.current.playbackRate = 1;
    }
  };
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      className="video-controls absolute inset-0 z-10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Description overlay posisi lebih rendah, tepat di atas teks API */}
      <div className="absolute bottom-10 left-0 right-0 px-4 py-3">
        <p className="text-sm sm:text-base font-roboto">
          {displayText}
        </p>
      </div>
      
      {/* Fast forward indicator */}
      {showFastForward && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
          <div className="text-center">
            <p className="text-white text-3xl font-bold">{fastForwardRate.toFixed(1)}x</p>
            <p className="text-white text-sm mt-2">↓ Swipe Right to Speed Up ↓</p>
          </div>
        </div>
      )}
      
      {/* Watermark API di bagian bawah */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <p className="text-xs text-white/60">from video.imgdesu.art</p>
      </div>
    </div>
  );
}
