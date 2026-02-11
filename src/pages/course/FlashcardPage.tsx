import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import FlashCard from "@/components/course/FlashCard";
import { vocabularyService } from "@/services/vocabularyService";
import { favoriteVocabularyService } from "@/services/favoriteVocabularyService";
import type { Vocabulary } from "@/types/vocabulary";
import { toast } from "sonner";

// --- Utility Functions ---
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Type Definitions ---
interface FlashcardData {
  id: number;
  front: string;
  back: string;
}

// --- Main Component ---
const FlashcardPage = () => {
  const { lessonPartId } = useParams<{ lessonPartId: string }>();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [originalCards, setOriginalCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<number>(0);
  const [showKeyboardHints, setShowKeyboardHints] = useState<boolean>(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const currentCard = flashcards[currentIndex];

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      toast.info("Bạn đã đến thẻ cuối cùng!");
    }
  }, [currentIndex, flashcards.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    } else {
      toast.info("Bạn đang ở thẻ đầu tiên!");
    }
  }, [currentIndex]);

  const handleShuffle = () => {
    setFlashcards(shuffleArray([...flashcards]));
    setCurrentIndex(0);
    toast.success("Đã xáo trộn thẻ!");
  };

  const handleReset = () => {
    setFlashcards([...originalCards]);
    setCurrentIndex(0);
    toast.success("Đã khôi phục thứ tự ban đầu!");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleToggleFavorite = async () => {
    if (!currentCard) return;
    const vocabId = currentCard.id;
    const isFav = favoriteIds.has(vocabId);

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) {
        next.delete(vocabId);
      } else {
        next.add(vocabId);
      }
      return next;
    });

    try {
      if (isFav) {
        await favoriteVocabularyService.remove(vocabId);
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await favoriteVocabularyService.add(vocabId);
        toast.success("Đã thêm vào yêu thích ❤️");
      }
    } catch (err) {
      // Rollback on error
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.add(vocabId);
        } else {
          next.delete(vocabId);
        }
        return next;
      });
      toast.error("Lỗi khi cập nhật yêu thích");
      console.error("Favorite toggle error:", err);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNext, goToPrev]);

  // Hide keyboard hints after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowKeyboardHints(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch vocabularies
  useEffect(() => {
    const fetchVocabularies = async () => {
      if (!lessonPartId) {
        setError("Không tìm thấy ID bài học.");
        setLoading(false);
        return;
      }

      const idAsNumber = parseInt(lessonPartId, 10);
      if (isNaN(idAsNumber) || idAsNumber <= 0) {
        setError("ID bài học không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        const vocabularies: Vocabulary[] =
          await vocabularyService.getByLessonPartId(idAsNumber);

        const convertedCards: FlashcardData[] = vocabularies.map(
          (item: Vocabulary) => ({
            id: item.id,
            front: item.wordKana,
            back: `${item.meaning}${item.romaji ? ` (${item.romaji})` : ""}`,
          })
        );

        setFlashcards(convertedCards);
        setOriginalCards(convertedCards);

        // Fetch favorite IDs
        try {
          const ids = await favoriteVocabularyService.getFavoriteIds();
          setFavoriteIds(new Set(ids));
        } catch (favErr) {
          console.warn("Could not load favorites:", favErr);
        }
      } catch (err) {
        setError(
          "Lỗi tải dữ liệu từ API. Vui lòng kiểm tra kết nối hoặc đường dẫn API."
        );
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularies();
  }, [lessonPartId]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700 font-medium">
            Đang tải flashcards...
          </p>
        </motion.div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <p className="text-red-600 text-lg font-semibold mb-6">
            Lỗi: {error}
          </p>
          <Button onClick={handleGoBack} size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Quay lại
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- Empty State ---
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <p className="text-gray-600 text-lg mb-6">Không có từ vựng nào.</p>
          <Button onClick={handleGoBack} size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Quay lại
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-20 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <Button
              onClick={handleGoBack}
              variant="ghost"
              className="hover:bg-cyan-50 text-gray-700 hover:text-cyan-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>

            {/* Center: Card Count */}
            <div className="flex-1 text-center">
              <span className="text-sm font-semibold text-gray-600">
                {currentIndex + 1} / {flashcards.length} thẻ
              </span>
            </div>

            {/* Right: Control Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleShuffle}
                variant="outline"
                size="sm"
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/favorites")}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-500 hover:bg-red-50"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-6 md:py-12">
        {/* Flashcard Display */}
        <div className="mb-6">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {currentCard && (
                <FlashCard
                  front={currentCard.front}
                  back={currentCard.back}
                  isFavorite={favoriteIds.has(currentCard.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar - Right Below Card */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            {flashcards.map((_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-150"
                    : index < currentIndex
                    ? "bg-primary/60"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-3 md:gap-6">
          <Button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            size="lg"
            variant="outline"
            className="w-24 md:w-32 border-2 border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:border-gray-200 disabled:text-gray-400 text-sm md:text-base"
          >
            <ChevronLeft className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Trước</span>
            <span className="sm:hidden">‹</span>
          </Button>

          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              {currentIndex + 1}
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              / {flashcards.length}
            </div>
          </div>

          <Button
            onClick={goToNext}
            disabled={currentIndex === flashcards.length - 1}
            size="lg"
            variant="outline"
            className="w-24 md:w-32 border-2 border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:border-gray-200 disabled:text-gray-400 text-sm md:text-base"
          >
            <span className="hidden sm:inline">Tiếp</span>
            <span className="sm:hidden">›</span>
            <ChevronRight className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <AnimatePresence>
        {showKeyboardHints && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-2xl"
          >
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <span className="font-medium">Phím tắt:</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">
                  ←
                </kbd>
                <span>Trước</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-mono">
                  →
                </kbd>
                <span>Tiếp</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardPage;
