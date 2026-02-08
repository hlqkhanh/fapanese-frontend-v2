import { useState, useEffect } from "react";
import { toast } from "sonner";
import { lessonService } from "@/services/lessonService";
import type { Lesson } from "@/types/lesson";

export const useLesson = (lessonId: string | undefined) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!lessonId) return;
        
        setLoading(true);
        setError(null);
        console.log("📚 Fetching lesson info for ID:", lessonId);
        
        const res = await lessonService.getById(Number(lessonId));
        console.log("✅ Lesson response:", res);
        console.log("✅ Lesson data:", res.result);
        
        setLesson(res.result);
      } catch (err) {
        const error = err as Error;
        console.error("Không thể tải thông tin bài học:", error);
        toast.error("Không thể tải thông tin bài học");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  return { lesson, loading, error };
};
