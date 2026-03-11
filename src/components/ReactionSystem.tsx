import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'angry';

export interface ReactionCounts {
  like: number;
  love: number;
  haha: number;
  wow: number;
  angry: number;
}

export interface ReactionSystemProps {
  itemId: string;
  initialCounts?: ReactionCounts;
  onReactionChange?: (counts: ReactionCounts) => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

const generateRandomCounts = (): ReactionCounts => ({
  like: Math.floor(Math.random() * (200 - 80 + 1) + 80),
  love: Math.floor(Math.random() * (120 - 40 + 1) + 40),
  haha: Math.floor(Math.random() * (700 - 300 + 1) + 300),
  wow: Math.floor(Math.random() * (80 - 20 + 1) + 20),
  angry: Math.floor(Math.random() * (40 - 5 + 1) + 5),
});

export const ReactionSystem: React.FC<ReactionSystemProps> = ({
  itemId,
  initialCounts,
  onReactionChange
}) => {
  const [counts, setCounts] = useState<ReactionCounts>(() => {
    // Check if there are stored updated counts
    const storedCounts = localStorage.getItem(`reaction_counts_${itemId}`);
    if (storedCounts) {
      try {
        return JSON.parse(storedCounts);
      } catch (e) {
        console.error("Failed parsing counts for", itemId);
      }
    }
    const newCounts = initialCounts || generateRandomCounts();
    // Cache generated value so it is consistent on reload
    localStorage.setItem(`reaction_counts_${itemId}`, JSON.stringify(newCounts));
    return newCounts;
  });

  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showPickerMobile, setShowPickerMobile] = useState(false);
  const [animateEmoji, setAnimateEmoji] = useState<ReactionType | null>(null);

  useEffect(() => {
    // Load user's previous reaction from localStorage
    const storedReaction = localStorage.getItem(`reaction_${itemId}`);
    if (storedReaction && ['like', 'love', 'haha', 'wow', 'angry'].includes(storedReaction)) {
      setUserReaction(storedReaction as ReactionType);
    }
  }, [itemId]);

  const handleReact = (type: ReactionType) => {
    if (userReaction) return; // Already reacted

    const newCounts = { ...counts };
    newCounts[type] += 1;

    setCounts(newCounts);
    setUserReaction(type);
    setAnimateEmoji(type);
    setIsHovering(false);
    setShowPickerMobile(false);

    localStorage.setItem(`reaction_${itemId}`, type);
    localStorage.setItem(`reaction_counts_${itemId}`, JSON.stringify(newCounts));

    if (onReactionChange) {
      onReactionChange(newCounts);
    }

    // Reset animation state
    setTimeout(() => setAnimateEmoji(null), 1000);
  };

  const getActiveTextAndColor = () => {
    switch (userReaction) {
      case 'like': return { text: 'লাইক', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'love': return { text: 'লাভ', color: 'text-pink-600', bg: 'bg-pink-50' };
      case 'haha': return { text: 'হাহা', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'wow': return { text: 'ওয়াও', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'angry': return { text: 'রাগান্বিত', color: 'text-orange-600', bg: 'bg-orange-50' };
      default: return { text: 'লাইক', color: 'text-gray-600', bg: 'hover:bg-gray-100' };
    }
  };

  const activeStyle = getActiveTextAndColor();

  const getReactionIcon = (type: ReactionType, size = 18) => {
    switch (type) {
      case 'like': return <span className="text-xl">👍</span>;
      case 'love': return <span className="text-xl">❤️</span>;
      case 'haha': return <span className="text-xl">😂</span>;
      case 'wow': return <span className="text-xl">😮</span>;
      case 'angry': return <span className="text-xl">😡</span>;
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Reaction Counts Bar */}
      <div className="flex items-center gap-4 text-sm text-gray-500 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <span className="text-[16px]">👍</span>
          <span>{formatNumber(counts.like)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[16px]">❤️</span>
          <span>{formatNumber(counts.love)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[16px]">😂</span>
          <span>{formatNumber(counts.haha)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[16px]">😮</span>
          <span>{formatNumber(counts.wow)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[16px]">😡</span>
          <span>{formatNumber(counts.angry)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative">
        <div className="flex items-center justify-between px-2">
          {/* Main Like Button handling hover/touch */}
          <div 
            className="relative flex-1"
            onMouseEnter={() => !userReaction && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button
              onClick={() => {
                if (userReaction) return;
                // On mobile, tap shows picker
                if (window.innerWidth < 768) {
                  setShowPickerMobile(!showPickerMobile);
                } else {
                  handleReact('like');
                }
              }}
              className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold transition-colors ${activeStyle.color} ${activeStyle.bg}`}
              disabled={!!userReaction}
            >
              {userReaction ? getReactionIcon(userReaction) : <ThumbsUp size={18} className="stroke-2" />}
              {activeStyle.text}
            </button>

            {/* Reaction Floating Picker (Desktop Hover & Mobile Tap) */}
            <AnimatePresence>
              {((isHovering && !userReaction) || showPickerMobile) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -50, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 mb-2 bg-white px-3 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-3 z-50"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {(['like', 'love', 'haha', 'wow', 'angry'] as ReactionType[]).map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.4, originY: 1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReact(type);
                      }}
                      className="text-2xl transition-transform transform origin-bottom"
                    >
                      {getReactionIcon(type)}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Emoji Animation Element */}
        <AnimatePresence>
          {animateEmoji && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -80, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-1/2 -top-10 -translate-x-1/2 text-4xl pointer-events-none z-50"
            >
              {getReactionIcon(animateEmoji)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
