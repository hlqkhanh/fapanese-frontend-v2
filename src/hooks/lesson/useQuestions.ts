import { useState, useEffect } from "react";
import { toast } from "sonner";
import { questionService } from "@/services/questionService";
import type { Question } from "@/types/question";
import type { LessonPart } from "@/types/lessonPart";

interface UseQuestionsOptions {
  lessonParts: LessonPart[];
  activeTab: "lesson" | "exercise";
  contentType: "vocab" | "grammar";
}

export const useQuestions = ({ lessonParts, activeTab, contentType }: UseQuestionsOptions) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!lessonParts.length) return;

        const targetPart =
          contentType === "grammar"
            ? lessonParts.find((p) => p.type === "GRAMMAR")
            : lessonParts.find((p) => p.type === "VOCABULARY");

        if (!targetPart?.id) {
          console.warn("⚠️ Không tìm thấy lesson part tương ứng với", contentType);
          return;
        }

        console.log("📝 Fetching questions for contentType:", contentType);
        console.log("📝 Target lesson part:", targetPart);
        console.log("🔗 API URL will be: /questions/by-lesson-part/" + targetPart.id);

        setLoading(true);
        setError(null);

        const res = await questionService.getByLessonPartId(Number(targetPart.id));
        console.log("✅ Questions response:", res);
        console.log("✅ Questions result:", res.result);
        console.log("✅ Questions count:", res.result?.length);

        setQuestions(res.result || []);
      } catch (err) {
        const error = err as Error;
        console.error("Không thể tải câu hỏi:", error);
        toast.error("Không thể tải câu hỏi");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "exercise") {
      fetchQuestions();
    }
  }, [activeTab, contentType, lessonParts]);

  return { questions, loading, error };
};
