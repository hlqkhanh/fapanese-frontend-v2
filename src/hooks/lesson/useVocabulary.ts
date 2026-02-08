import { useState, useEffect } from "react";
import { toast } from "sonner";
import { vocabularyService } from "@/services/vocabularyService";
import type { Vocabulary } from "@/types/vocabulary";

interface UseVocabularyOptions {
  lessonPartId: string | undefined;
  activeTab: "lesson" | "exercise";
  contentType: "vocab" | "grammar";
}

export const useVocabulary = ({ lessonPartId, activeTab, contentType }: UseVocabularyOptions) => {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVocabularies = async () => {
      try {
        if (!lessonPartId) {
          console.warn("⚠️ lessonPartId is missing!");
          return;
        }

        setLoading(true);
        setError(null);
        console.log("📖 Fetching vocabularies for lessonPartId:", lessonPartId);
        console.log("🔗 API URL will be: /vocabularies/by-lesson-part/" + lessonPartId);

        const res = await vocabularyService.getByLessonPartId(Number(lessonPartId));
        console.log("✅ Vocabularies response:", res);
        console.log("✅ Is array?", Array.isArray(res), "Length:", res?.length);

        setVocabularies(Array.isArray(res) ? res : (res as any).result || []);
      } catch (err: any) {
        console.error("❌ Không thể tải từ vựng:", err);
        console.error("❌ Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        toast.error("Không thể tải từ vựng");
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "lesson" && contentType === "vocab") {
      fetchVocabularies();
    }
  }, [activeTab, contentType, lessonPartId]);

  return { vocabularies, loading, error };
};
