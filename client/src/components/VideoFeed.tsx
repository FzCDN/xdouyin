import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VideoItem from "@/components/VideoItem";
import Spinner from "@/components/ui/spinner";
import { apiResponseSchema, Video } from "@shared/schema";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videosData, setVideosData] = useState<Video[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch videos from our backend API
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ['/api/videos'],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Process data when it arrives
  useEffect(() => {
    if (data) {
      try {
        const validatedData = apiResponseSchema.parse(data);
        setVideosData(prevVideos => {
          // Add only new videos to avoid duplicates
          const newVideos = validatedData.data.filter(
            video => !prevVideos.some(prevVideo => prevVideo.id === video.id)
          );
          return [...prevVideos, ...newVideos];
        });
      } catch (error) {
        console.error("Invalid data format:", error);
      }
    }
  }, [data]);

  // Setup intersection observer for infinite loading
  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isFetching) {
          refetch();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, isFetching, refetch]);

  // Setup scroll snap functionality
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container) {
        const scrollTop = container.scrollTop;
        const itemHeight = container.clientHeight;
        const index = Math.round(scrollTop / itemHeight);
        
        if (index !== currentIndex) {
          setCurrentIndex(index);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [currentIndex]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#121212] text-white p-4">
        <AlertCircle className="h-16 w-16 text-[#FE2C55] mb-4" />
        <h2 className="text-xl mb-2 font-medium">Failed to load videos</h2>
        <p className="text-center text-[#AAAAAA] mb-6">
          {error instanceof Error ? error.message : "Something went wrong while fetching videos."}
        </p>
        <Button 
          onClick={() => refetch()} 
          className="bg-[#FE2C55] hover:bg-[#FE2C55]/90 rounded-full px-6"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="video-container h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {videosData.length === 0 && isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {videosData.map((video, index) => (
            <VideoItem
              key={`${video.id}-${index}`}
              video={video}
              isActive={currentIndex === index}
              index={index}
            />
          ))}
          
          {/* Loading indicator at the end of the list */}
          <div 
            ref={loadMoreRef} 
            className="h-20 flex items-center justify-center"
          >
            {isFetching && <Spinner />}
          </div>
        </>
      )}
    </div>
  );
}
