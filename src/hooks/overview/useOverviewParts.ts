import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { overviewService } from "@/services/overviewService";
import type { OverviewPart } from "@/types/overview";
import { toast } from "sonner";

interface UseOverviewPartsProps {
  overviewId: number;
  courseCode: string;
  currentPartId?: number;
}

/**
 * Custom hook for fetching and managing overview parts (sidebar navigation)
 * Auto-navigates to first part if none selected
 */
export const useOverviewParts = ({
  overviewId,
  courseCode,
  currentPartId,
}: UseOverviewPartsProps) => {
  const navigate = useNavigate();
  const [parts, setParts] = useState<OverviewPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const partsData = await overviewService.getPartsByOverviewId(overviewId);
        setParts(partsData);

        // Auto-navigate to first part if no part is selected
        if (!currentPartId && partsData.length > 0) {
          navigate(`/overview/${courseCode}/${overviewId}/${partsData[0].id}`, {
            replace: true,
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch overview parts:", err);
        const message = err.response?.data?.message || "Không thể tải danh mục ôn tập";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [overviewId, courseCode, currentPartId, navigate]);

  return {
    parts,
    loading,
    error,
  };
};
