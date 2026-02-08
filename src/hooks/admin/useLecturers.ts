import { useEffect } from "react";
import { useLecturerStore } from "@/stores/useLecturerStore";
import type { LecturerSearchParams } from "@/types/lecturer";

interface UseLecturersOptions {
  params: LecturerSearchParams;
}

/**
 * Custom hook for fetching and managing lecturers data
 * Automatically fetches when params change
 */
export const useLecturers = ({ params }: UseLecturersOptions) => {
  const {
    lecturerList,
    totalElements,
    totalPages,
    loading,
    fetchLecturers,
    createLecturer,
    updateLecturer,
    deleteLecturer,
  } = useLecturerStore();

  // Auto-fetch when params change
  useEffect(() => {
    fetchLecturers(params);
  }, [
    params.page,
    params.size,
    params.keyword,
    params.campus,
    params.status,
    params.sortBy,
    params.sortDir,
    fetchLecturers,
  ]);

  return {
    lecturers: lecturerList,
    totalElements,
    totalPages,
    loading,
    createLecturer,
    updateLecturer,
    deleteLecturer,
  };
};
