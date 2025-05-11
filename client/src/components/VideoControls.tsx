import { Video } from "@shared/schema";

interface VideoControlsProps {
  video: Video;
  isLiked: boolean;
  onLike: () => void;
}

export default function VideoControls({ video, isLiked, onLike }: VideoControlsProps) {
  return (
    <div className="video-controls">
      {/* Description overlay with fixed height */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 z-10 h-32">
        <p className="text-sm font-roboto">
          {video.description_en || video.title_en || "No description"}
        </p>
      </div>
    </div>
  );
}
