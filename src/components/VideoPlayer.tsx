import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { ReactionSystem } from './ReactionSystem';
import { MediaItem } from '../data/mediaData';

interface VideoPlayerProps {
  item: MediaItem;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);

  let controlsTimeout: number;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          
          if (entry.isIntersecting) {
            // Video entered viewport -> Autoplay muted
            videoRef.current.play().catch(e => console.log('Autoplay blocked:', e));
            setIsPlaying(true);
          } else {
            // Video left viewport -> Pause automatically
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 } // Needs to be 60% visible to play
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Video Container (YouTube Style) */}
      <div 
        ref={containerRef}
        className="relative aspect-video bg-black group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={item.url}
          muted
          playsInline
          controls
          preload="metadata"
          className="w-full h-full object-contain"
          style={{ width: "100%" }}
        />

        {/* Hover play/pause effect overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-transform hover:scale-110"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={32} className="fill-white" /> : <Play size={32} className="fill-white ml-1" />}
          </button>
        </div>

        {/* Floating Controls Bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 flex items-center justify-between ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <button onClick={handleFullscreen} className="text-white hover:text-blue-400 transition-colors">
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* Video Info Footer */}
      <div className="p-4 space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">{item.caption}</h3>
        
        {/* Pass smaller initial counts so it looks a bit different than images if needed, or leave defaults */}
        <ReactionSystem 
          itemId={item.id} 
          initialCounts={{ like: 80, love: 40, haha: 500, angry: 60, wow: 20 }} 
        />
      </div>
    </div>
  );
};
