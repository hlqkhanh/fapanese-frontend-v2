import { useState, useEffect } from "react";
import { lessonPartService } from "@/services/lessonPartService";
import type { LessonPart } from "@/types/lessonPart";

export const useLessonParts = (lessonId: string | undefined) => {
  const [lessonParts, setLessonParts] = useState<LessonPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLessonParts = async () => {
      try {
        if (!lessonId) return;

        setLoading(true);
        setError(null);
        console.log("📋 Fetching lesson parts for lessonId:", lessonId);

        const res = await lessonPartService.getByLessonId(Number(lessonId));
        console.log("✅ Lesson parts:", res.result);

        setLessonParts(res.result);
      } catch (err) {
        const error = err as Error;
        console.error("Không thể tải lesson parts:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonParts();
  }, [lessonId]);

  return { lessonParts, loading, error };
};
