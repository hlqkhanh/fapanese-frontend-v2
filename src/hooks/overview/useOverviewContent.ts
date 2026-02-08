import { useEffect, useState } from "react";
import { overviewService } from "@/services/overviewService";
import type { OverviewPartType, SpeakingGroup, Exam } from "@/types/overview";
import { toast } from "sonner";

interface UseOverviewContentProps {
  partId: number;
  partType: OverviewPartType | null;
}

type ContentGroup = SpeakingGroup | Exam;

/**
 * Custom hook for fetching overview content based on part type
 * Handles SPEAKING, MIDDLE_EXAM, FINAL_EXAM types
 */
export const useOverviewContent = ({ partId, partType }: UseOverviewContentProps) => {
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!partType) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let data: ContentGroup[];

        switch (partType) {
          case "SPEAKING":
            data = await overviewService.getSpeakingByPartId(partId);
            break;
          case "MIDDLE_EXAM":
            data = await overviewService.getMiddleExamByPartId(partId);
            break;
          case "FINAL_EXAM":
            data = await overviewService.getFinalExamByPartId(partId);
            break;
          default:
            throw new Error("Loại nội dung không xác định");
        }

        setContentGroups(data);
      } catch (err: any) {
        console.error("Failed to fetch content:", err);
        const message = err.response?.data?.message || "Lỗi khi tải nội dung";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [partId, partType]);

  return {
    contentGroups,
    loading,
    error,
  };
};
