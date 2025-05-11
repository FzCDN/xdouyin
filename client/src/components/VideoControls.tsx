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
  const [scrubStartTime, setScrubStartTime] = useState(0);
  const [showScrubOverlay, setShowScrubOverlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
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
  
  // Format waktu ke format mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Inisialisasi durasi video
  useEffect(() => {
    if (videoRef?.current) {
      const updateDuration = () => {
        setDuration(videoRef.current?.duration || 0);
      };
      
      // Update saat metadata video tersedia
      videoRef.current.addEventListener('loadedmetadata', updateDuration);
      
      // Cek jika durasi sudah tersedia
      if (videoRef.current.duration) {
        updateDuration();
      }
      
      return () => {
        videoRef.current?.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [videoRef]);

  // Update current time saat video diputar
  useEffect(() => {
    if (videoRef?.current) {
      const updateTime = () => {
        setCurrentTime(videoRef.current?.currentTime || 0);
      };
      
      videoRef.current.addEventListener('timeupdate', updateTime);
      
      return () => {
        videoRef.current?.removeEventListener('timeupdate', updateTime);
      };
    }
  }, [videoRef]);

  // Handle touch start - mendeteksi long press untuk scrubbing
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setScrubStartX(touch.clientX);
    
    if (videoRef?.current) {
      setScrubStartTime(videoRef.current.currentTime);
    }
    
    console.log("Touch started");
    
    // Set timer untuk long press (300ms)
    longPressTimerRef.current = setTimeout(() => {
      console.log("Long press detected - ready to jump time");
      setIsScrubbing(true);
      setShowScrubOverlay(true);
    }, 300);
  };
  
  // Handle touch move - untuk melompati waktu (scrubbing) saat swipe
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isScrubbing) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - scrubStartX;
    
    console.log("Touch move, delta:", deltaX);
    
    // Hitung perubahan waktu berdasarkan swipe (1px = 0.1 detik)
    // Positif (kanan) = maju, Negatif (kiri) = mundur
    if (videoRef?.current && duration > 0) {
      // Setiap 10px = 1 detik perubahan waktu
      const timeChange = deltaX / 10; 
      let newTime = scrubStartTime + timeChange;
      
      // Pastikan waktu dalam batasan video
      newTime = Math.max(0, Math.min(newTime, duration));
      
      // Terapkan waktu baru
      videoRef.current.currentTime = newTime;
      console.log("Jumping to time:", newTime);
    }
  };
  
  // Handle touch end - berhenti scrubbing
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    console.log("Touch ended");
    
    // Clear timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Reset state scrubbing
    setIsScrubbing(false);
    setShowScrubOverlay(false);
  };
  
  // Handle click untuk pause/play
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Jika tidak dalam mode scrubbing, click = toggle play/pause
    if (!isScrubbing && videoRef?.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => console.error("Error playing video:", err));
      } else {
        videoRef.current.pause();
      }
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
      onClick={handleClick}
    >
      {/* Description overlay posisi lebih rendah, tepat di atas teks API */}
      <div className="absolute bottom-10 left-0 right-0 px-4 py-3">
        <p className="text-sm sm:text-base font-roboto">
          {displayText}
        </p>
      </div>
      
      {/* Scrubbing indicator */}
      {showScrubOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
          <div className="text-center p-4 rounded-lg bg-black/80">
            <p className="text-white text-3xl font-bold">{formatTime(currentTime)}</p>
            <div className="w-full bg-gray-700 h-1 mt-3 rounded-full">
              <div 
                className="bg-[#FE2C55] h-1 rounded-full" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <p className="text-white text-xs mt-2">{formatTime(currentTime)} / {formatTime(duration)}</p>
            <p className="text-white text-sm mt-3">↔ Swipe to Jump Time</p>
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
