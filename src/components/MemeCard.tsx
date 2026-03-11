import React, { useRef, useState, useEffect } from 'react';
import { Share2, X, ZoomIn } from 'lucide-react';
import html2canvas from 'html2canvas';
import { ReactionSystem } from './ReactionSystem';
import { MediaItem } from '../data/mediaData';

interface MemeCardProps {
  item: MediaItem;
}

export const MemeCard: React.FC<MemeCardProps> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isViewing, setIsViewing] = useState(false);

  // Close viewer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isViewing) {
        setIsViewing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewing]);

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    try {
      // Temporarily hide the share button for the screenshot
      const shareBtn = cardRef.current.querySelector('.share-button') as HTMLElement;
      if (shareBtn) shareBtn.style.display = 'none';

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      if (shareBtn) shareBtn.style.display = 'flex';

      const image = canvas.toDataURL('image/png');
      
      // Native share if supported
      if (navigator.share) {
        try {
          // Convert base64 to blob for sharing
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], 'teler-khobor-meme.png', { type: 'image/png' });
          
          await navigator.share({
            title: 'তেল লাগবে - ভাইরাল মিম',
            text: item.caption,
            files: [file]
          });
          return;
        } catch (error) {
          console.log('Share failed or was cancelled', error);
        }
      }

      // Fallback: Download
      const link = document.createElement('a');
      link.href = image;
      link.download = `teler-khobor-${item.id}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to capture meme:', err);
      alert('মিম শেয়ার করতে সমস্যা হচ্ছে, আবার চেষ্টা করুন।');
    }
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
    >
      {/* Target Image Container */}
      <div 
        className="relative aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer group"
        onClick={() => setIsViewing(true)}
      >
        <img 
          src={item.url} 
          alt={item.caption} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Title Overlay at bottom of image */}
        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 drop-shadow-md">
              {item.caption}
            </h3>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
          <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="p-4 flex flex-col flex-1 gap-4">
        <div className="mt-auto space-y-4">
          <ReactionSystem itemId={item.id} />

          <button 
            onClick={handleShare}
            className="share-button w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors border border-gray-200"
          >
            <Share2 size={18} />
            শেয়ার করুন
          </button>
        </div>
      </div>

      {/* Fullscreen View Modal */}
      {isViewing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button 
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
            onClick={() => setIsViewing(false)}
          >
            <X size={28} />
          </button>
          
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4">
            <img 
              src={item.url} 
              alt={item.caption} 
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-white text-xl md:text-2xl font-semibold text-center mt-4 drop-shadow-md">
              {item.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
