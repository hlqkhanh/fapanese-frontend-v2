import { useState, useCallback } from "react";
import { overviewService } from "@/services/overviewService";
import type { UserAnswer, ExamSubmitResult, ExamQuestion } from "@/types/overview";
import { toast } from "sonner";

/**
 * Custom hook for managing exam submission
 * Handles answer tracking, validation, and submission
 */
export const useExamSubmission = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<ExamSubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Update answer for a question
  const setAnswer = useCallback((questionId: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  // Submit exam answers
  const submitExam = useCallback(
    async (questions: ExamQuestion[]) => {
      // Validate all questions answered
      const answersArray: UserAnswer[] = Object.entries(userAnswers).map(
        ([qid, ans]) => ({
          questionId: Number(qid),
          userAnswer: ans,
        })
      );

      if (answersArray.length < questions.length) {
        toast.warning("⚠️ Bạn chưa chọn hết các câu!");
        return false;
      }

      try {
        setSubmitting(true);
        const result = await overviewService.submitExam(answersArray);
        
        setSubmitResult(result);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        return true;
      } catch (err: any) {
        console.error("Submit error:", err);
        const message = err.response?.data?.message || 
          "Lỗi nộp bài! Vui lòng kiểm tra lại câu trả lời và kết nối mạng.";
        toast.error(message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [userAnswers]
  );

  // Reset to initial state
  const reset = useCallback(() => {
    setUserAnswers({});
    setIsSubmitted(false);
    setSubmitResult(null);
    setSubmitting(false);
  }, []);

  return {
    userAnswers,
    isSubmitted,
    submitResult,
    submitting,
    setAnswer,
    submitExam,
    reset,
  };
};
