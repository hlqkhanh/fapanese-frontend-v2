import { useEffect } from "react";
import { useCourseStore } from "@/stores/useCoureStore";

/**
 * Custom hook for fetching and managing courses data
 * Automatically fetches on mount
 */
export const useCourses = () => {
  const {
    courseList,
    loading,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourseStore();

  // Auto-fetch on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses: courseList,
    loading,
    createCourse,
    updateCourse,
    deleteCourse,
    refetch: fetchCourses,
  };
};
