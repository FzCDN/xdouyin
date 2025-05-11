import { Video } from "@shared/schema";
import { useState } from "react";
import { Settings } from "lucide-react";

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
}

export default function VideoControls({ video, isLiked, onLike }: VideoControlsProps) {
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [quality, setQuality] = useState<'HD' | 'Save'>('HD');
  
  // Fungsi untuk memotong text jika terlalu panjang
  const truncateText = (text: string, maxLength: number) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  
  // Dapatkan deskripsi yang akan ditampilkan
  const description = video.description_en || video.title_en || "No description";
  const displayText = truncateText(description, 100);
  
  return (
    <div className="video-controls">
      {/* Description overlay yang sudah diperbaiki posisinya */}
      <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 z-10">
        <p className="text-sm font-roboto">
          {displayText}
        </p>
      </div>
      
      {/* Quality switch button */}
      <div className="absolute bottom-4 right-4 z-20">
        <button 
          onClick={() => setShowQualityOptions(!showQualityOptions)}
          className="bg-black/30 p-2 rounded-full"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
        
        {/* Quality options */}
        {showQualityOptions && (
          <div className="absolute bottom-10 right-0 bg-black/70 rounded-md overflow-hidden">
            <button 
              className={`block w-full px-4 py-2 text-left text-sm ${quality === 'HD' ? 'bg-[#FE2C55] text-white' : 'text-white/80'}`}
              onClick={() => {
                setQuality('HD');
                setShowQualityOptions(false);
              }}
            >
              HD Quality
            </button>
            <button 
              className={`block w-full px-4 py-2 text-left text-sm ${quality === 'Save' ? 'bg-[#FE2C55] text-white' : 'text-white/80'}`}
              onClick={() => {
                setQuality('Save');
                setShowQualityOptions(false);
              }}
            >
              Save Quality
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
