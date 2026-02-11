import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface FlashCardProps {
  front: string;
  back: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onFlip?: (isFlipped: boolean) => void;
}

const FlashCard = ({ front, back, isFavorite = false, onToggleFavorite, onFlip }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);
    onFlip?.(newFlipState);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking heart
    onToggleFavorite?.();
  };

  return (
    <div
      className="relative w-full cursor-pointer select-none h-[50vh] md:h-[55vh]"
      style={{ perspective: "1500px" }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-xl border-2 border-gray-200 flex flex-col items-center justify-center p-8 md:p-10 hover:shadow-2xl hover:border-gray-300 transition-all duration-300">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                {front}
              </p>
              <div className="mt-6 md:mt-8 text-cyan-500 text-xs md:text-sm font-medium flex items-center gap-2 justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span>Nhấp để xem định nghĩa</span>
              </div>
            </div>
          </div>

          {/* Favorite Heart Icon - Top Right */}
          <motion.button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-400"
              }`}
            />
          </motion.button>
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 rounded-2xl shadow-xl border-2 border-white/30 flex flex-col items-center justify-center p-8 md:p-10">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-relaxed drop-shadow-lg">
                {back}
              </p>
              <div className="mt-6 md:mt-8 text-white/90 text-xs md:text-sm font-medium flex items-center gap-2 justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Nhấp để quay lại</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlashCard;
