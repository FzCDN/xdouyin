import { Video } from "@shared/schema";
import { Music2Icon } from "lucide-react";

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
}

export default function VideoControls({ video, isLiked, onLike }: VideoControlsProps) {
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
    </div>
  );
}
