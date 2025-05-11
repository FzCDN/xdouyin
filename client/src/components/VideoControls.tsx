import { Video } from "@shared/schema";
import { useState, useEffect } from "react";
import { Settings } from "lucide-react";

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
}

export default function VideoControls({ video, isLiked, onLike }: VideoControlsProps) {
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [quality, setQuality] = useState<'HD' | 'LOW'>('HD');
  
  // Tutup menu kualitas ketika user click di luar
  useEffect(() => {
    const handleClickOutside = () => {
      setShowQualityOptions(false);
    };
    
    if (showQualityOptions) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showQualityOptions]);
  
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
      {/* Description overlay dengan posisi responsif */}
      <div className="absolute bottom-[20%] left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 z-10">
        <p className="text-sm sm:text-base font-roboto">
          {displayText}
        </p>
      </div>
      
      {/* Quality switch button - posisi responsif */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowQualityOptions(!showQualityOptions);
          }}
          className="bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
        
        {/* Quality options */}
        {showQualityOptions && (
          <div className="absolute top-10 right-0 bg-black/80 rounded-md overflow-hidden shadow-lg"
               onClick={(e) => e.stopPropagation()}>
            <button 
              className={`block w-full px-4 py-2 text-center text-sm ${quality === 'HD' ? 'bg-[#FE2C55] text-white' : 'text-white hover:bg-black/60'}`}
              onClick={(e) => {
                e.stopPropagation();
                setQuality('HD');
                setShowQualityOptions(false);
              }}
            >
              HD
            </button>
            <button 
              className={`block w-full px-4 py-2 text-center text-sm ${quality === 'LOW' ? 'bg-[#FE2C55] text-white' : 'text-white hover:bg-black/60'}`}
              onClick={(e) => {
                e.stopPropagation();
                setQuality('LOW');
                setShowQualityOptions(false);
              }}
            >
              LOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
