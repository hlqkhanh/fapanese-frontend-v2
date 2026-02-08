import { useState, useCallback } from "react";
import { overviewService } from "@/services/overviewService";
import type { ExamQuestion } from "@/types/overview";
import { toast } from "sonner";

/**
 * Custom hook for AI explanation functionality
 * Manages modal state and API calls for question explanations
 */
export const useAIExplanation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  // Request AI explanation for a question
  const explainQuestion = useCallback(async (question: ExamQuestion) => {
    setSelectedQuestion(question);
    setExplanation("");
    setIsOpen(true);
    setLoading(true);

    try {
      // Build options string
      const options = [
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD,
      ]
        .filter(Boolean)
        .join("\n");

      const payload = {
        question: question.content,
        options,
        correctAnswer: question.correctAnswer,
      };

      const result = await overviewService.getAIExplanation(payload);
      setExplanation(result);
    } catch (err: any) {
      console.error("AI explanation error:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      setExplanation(`Lỗi: Không thể lấy giải thích từ AI.\nChi tiết: ${errorMsg}`);
      toast.error("Không thể lấy giải thích từ AI");
    } finally {
      setLoading(false);
    }
  }, []);

  // Close modal and reset
  const close = useCallback(() => {
    setIsOpen(false);
    setExplanation("");
    setSelectedQuestion(null);
  }, []);

  return {
    isOpen,
    selectedQuestion,
    explanation,
    loading,
    explainQuestion,
    close,
  };
};
