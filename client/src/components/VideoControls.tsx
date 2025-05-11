import { Video } from "@shared/schema";
import { useState } from "react";

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
}

export default function VideoControls({ video, isLiked, onLike }: VideoControlsProps) {
  const [quality, setQuality] = useState<'HD' | 'LOW'>('HD');
  
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
      {/* Description overlay dengan posisi responsif tanpa shadow */}
      <div className="absolute bottom-[20%] left-0 right-0 px-4 py-3 z-10">
        <p className="text-sm sm:text-base font-roboto">
          {displayText}
        </p>
      </div>
      
      {/* Quality switch tanpa tombol, langsung pilihan */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button 
          className={`px-3 py-1 rounded-full text-xs font-medium ${quality === 'HD' ? 'bg-[#FE2C55] text-white' : 'bg-black/50 text-white'}`}
          onClick={() => setQuality('HD')}
        >
          HD
        </button>
        <button 
          className={`px-3 py-1 rounded-full text-xs font-medium ${quality === 'LOW' ? 'bg-[#FE2C55] text-white' : 'bg-black/50 text-white'}`}
          onClick={() => setQuality('LOW')}
        >
          LOW
        </button>
      </div>
    </div>
  );
}
