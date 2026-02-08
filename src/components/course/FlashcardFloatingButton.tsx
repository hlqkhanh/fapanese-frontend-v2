import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

interface FlashcardFloatingButtonProps {
  show: boolean;
  onClick: () => void;
}

const FlashcardFloatingButton = ({ show, onClick }: FlashcardFloatingButtonProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="flashcard-button"
          onClick={onClick}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
          }}
          className="fixed bottom-10 right-10 z-[5000] p-4 flex items-center gap-3 bg-gradient-to-r from-[#00BCD4] to-[#4DD0E1] text-white font-bold rounded-full shadow-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform"
        >
          <FaClipboardList className="text-xl" />
          <span>Ôn tập bằng Flashcard</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FlashcardFloatingButton;
