import { useState, useEffect, type RefObject } from "react";

interface UseFlashcardButtonOptions {
  activeTab: "lesson" | "exercise";
  contentType: "vocab" | "grammar";
  vocabContentRef: RefObject<HTMLDivElement | null>;
}

export const useFlashcardButton = ({
  activeTab,
  contentType,
  vocabContentRef,
}: UseFlashcardButtonOptions) => {
  const [showFlashcardButton, setShowFlashcardButton] = useState(false);

  useEffect(() => {
    const checkScrollForFlashcard = () => {
      if (activeTab !== "lesson" || contentType !== "vocab") {
        setShowFlashcardButton(false);
        return;
      }

      if (vocabContentRef.current) {
        const rect = vocabContentRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const nearBottom = rect.bottom < windowHeight * 5.5;

        if (rect.bottom < 0) {
          setShowFlashcardButton(false);
          return;
        }

        setShowFlashcardButton(nearBottom);
      }
    };

    window.addEventListener("scroll", checkScrollForFlashcard);
    checkScrollForFlashcard();
    return () => window.removeEventListener("scroll", checkScrollForFlashcard);
  }, [activeTab, contentType, vocabContentRef]);

  // Reset flashcard button on tab/content change
  useEffect(() => {
    setShowFlashcardButton(false);
  }, [activeTab, contentType]);

  return { showFlashcardButton };
};
