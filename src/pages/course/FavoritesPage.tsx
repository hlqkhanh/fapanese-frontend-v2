import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ChevronLeft,
  ChevronRight,
  Trash2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import FlashCard from "@/components/course/FlashCard";
import { favoriteVocabularyService } from "@/services/favoriteVocabularyService";
import { toast } from "sonner";

interface FavoriteCard {
  id: number;
  vocabularyId: number;
  front: string;
  back: string;
}

const FavoritesPage = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState<FavoriteCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentCard = cards[currentIndex];

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await favoriteVocabularyService.getAllDetailed();
      const converted: FavoriteCard[] = res.map((item: any) => ({
        id: item.id,
        vocabularyId: item.vocabularyId,
        front: item.wordKana,
        back: `${item.meaning}${item.romaji ? ` (${item.romaji})` : ""}`,
      }));
      setCards(converted);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      else if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!currentCard) return;

    try {
      await favoriteVocabularyService.remove(currentCard.vocabularyId);
      const newCards = cards.filter((c) => c.id !== currentCard.id);
      setCards(newCards);

      if (currentIndex >= newCards.length && newCards.length > 0) {
        setCurrentIndex(newCards.length - 1);
      }

      toast.success("Đã xóa khỏi yêu thích");
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      toast.error("Lỗi khi xóa");
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700 font-medium">
            Đang tải từ yêu thích...
          </p>
        </motion.div>
      </div>
    );
  }

  // --- Empty ---
  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-red-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Chưa có từ yêu thích
          </h2>
          <p className="text-gray-500 mb-8">
            Hãy bấm vào biểu tượng ❤️ trên flashcard để thêm từ vựng vào danh
            sách yêu thích.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 px-6 py-3 rounded-xl"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Quay lại học
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>

          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <h1 className="text-lg font-bold text-gray-800">
              Từ yêu thích
            </h1>
          </div>

          <span className="text-sm font-semibold text-gray-500">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-10">
        {/* Card */}
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
                  isFavorite={true}
                  onToggleFavorite={handleRemoveFavorite}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {cards.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-red-500 scale-150"
                  : index < currentIndex
                  ? "bg-red-300"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="rounded-xl px-4 py-3 border-2 border-gray-200 hover:border-gray-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline ml-1">Trước</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleRemoveFavorite}
            className="rounded-xl px-4 py-3 border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline ml-1">Bỏ yêu thích</span>
          </Button>

          <Button
            variant="outline"
            onClick={goToNext}
            disabled={currentIndex === cards.length - 1}
            className="rounded-xl px-4 py-3 border-2 border-gray-200 hover:border-gray-300 disabled:opacity-40"
          >
            <span className="hidden sm:inline mr-1">Sau</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
