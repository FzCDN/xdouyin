import { Video } from "@shared/schema";
import { HeartIcon, MessageCircleIcon, ShareIcon, Music2Icon } from "lucide-react";

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
}

export default function VideoControls({ video, isLiked, onLike }: VideoControlsProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  // Generate random "like" counts for UI display
  const getCounts = () => {
    const seed = video.id;
    const likes = Math.floor((seed * 137) % 900000) + 100000;
    const comments = Math.floor((seed * 79) % 30000) + 1000;
    const shares = Math.floor((seed * 23) % 20000) + 500;
    
    return {
      likes: formatCount(likes),
      comments: formatCount(comments),
      shares: formatCount(shares)
    };
  };
  
  const counts = getCounts();
  
  return (
    <div className="video-controls">
      {/* User info and description overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 z-10">
        <h3 className="font-medium text-lg mb-1 font-roboto">@user_{video.id}</h3>
        <p className="text-sm mb-3 font-roboto">
          {video.description_en || video.title_en || "No description"}
        </p>
        <div className="flex items-center">
          <Music2Icon className="h-4 w-4 mr-2" />
          <p className="text-sm font-roboto">Original Sound - {video.id}</p>
        </div>
      </div>
      
      {/* Action buttons on the right */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center z-10">
        {/* Profile Picture */}
        <div className="action-btn mb-5">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1D1D1D] border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#FE2C55] rounded-full p-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
          </div>
        </div>
        
        {/* Like Button */}
        <div className="action-btn mb-5" onClick={onLike}>
          <div className="flex flex-col items-center">
            <HeartIcon 
              className={`w-8 h-8 mb-1 ${isLiked ? 'fill-[#FE2C55] text-[#FE2C55]' : 'text-white'}`} 
            />
            <span className="text-xs">{counts.likes}</span>
          </div>
        </div>
        
        {/* Comment Button */}
        <div className="action-btn mb-5">
          <div className="flex flex-col items-center">
            <MessageCircleIcon className="w-8 h-8 mb-1" />
            <span className="text-xs">{counts.comments}</span>
          </div>
        </div>
        
        {/* Share Button */}
        <div className="action-btn mb-5">
          <div className="flex flex-col items-center">
            <ShareIcon className="w-8 h-8 mb-1" />
            <span className="text-xs">{counts.shares}</span>
          </div>
        </div>
        
        {/* Spinning Album Cover */}
        <div className="rounded-album border-2 border-white">
          <div className="h-12 w-12 bg-gradient-to-br from-gray-700 to-gray-900 animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
