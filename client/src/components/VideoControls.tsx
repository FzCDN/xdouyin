import { Video } from "@shared/schema";
import { useState } from "react";

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
}

export default function VideoControls({ video, isLiked, onLike }: VideoControlsProps) {
  const [quality, setQuality] = useState<'HD' | 'LOW'>('HD');
  
  // Handler untuk mengubah kualitas
  const handleQualityChange = (newQuality: 'HD' | 'LOW') => {
    console.log(`Changing quality to ${newQuality}`);
    setQuality(newQuality);
  };
  
  // Fungsi untuk memotong text jika terlalu panjang
  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  
  // Dapatkan deskripsi yang akan ditampilkan
  const description = video.description_en || video.title_en || "No description";
  const displayText = truncateText(description, 80); // Mengurangi sedikit untuk tampilan mobile
  
  return (
    <div className="video-controls">
      {/* Description overlay posisi lebih rendah, tepat di atas teks API */}
      <div className="absolute bottom-10 left-0 right-0 px-4 py-3 z-10">
        <p className="text-sm sm:text-base font-roboto">
          {displayText}
        </p>
      </div>
      
      {/* Quality switch langsung pilihan dengan handler yang diperbaiki */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button 
          className={`px-3 py-1 rounded-full text-xs font-medium ${quality === 'HD' ? 'bg-[#FE2C55] text-white' : 'bg-black/50 text-white'}`}
          onClick={() => handleQualityChange('HD')}
          type="button"
        >
          HD
        </button>
        <button 
          className={`px-3 py-1 rounded-full text-xs font-medium ${quality === 'LOW' ? 'bg-[#FE2C55] text-white' : 'bg-black/50 text-white'}`}
          onClick={() => handleQualityChange('LOW')}
          type="button"
        >
          LOW
        </button>
      </div>
      
      {/* Watermark API di bagian bawah */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
        <p className="text-xs text-white/60">from video.imgdesu.art</p>
      </div>
    </div>
  );
}
