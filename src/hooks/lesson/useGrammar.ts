import { useState, useEffect } from "react";
import { toast } from "sonner";
import { grammarService } from "@/services/grammarService";
import type { Grammar } from "@/types/grammar";
import type { LessonPart } from "@/types/lessonPart";

interface UseGrammarOptions {
  lessonParts: LessonPart[];
  activeTab: "lesson" | "exercise";
  contentType: "vocab" | "grammar";
}

export const useGrammar = ({ lessonParts, activeTab, contentType }: UseGrammarOptions) => {
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGrammars = async () => {
      try {
        if (!lessonParts.length) return;

        const grammarPart = lessonParts.find((p) => p.type === "GRAMMAR");
        if (!grammarPart?.id) return;

        setLoading(true);
        setError(null);

        const res = await grammarService.getByLessonPartId(Number(grammarPart.id));
        setGrammars(Array.isArray(res.result) ? res.result : []);
      } catch (err) {
        const error = err as Error;
        console.error("Không thể tải ngữ pháp:", error);
        toast.error("Không thể tải ngữ pháp");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "lesson" && contentType === "grammar") {
      fetchGrammars();
    }
  }, [activeTab, contentType, lessonParts]);

  return { grammars, loading, error };
};
