import { useEffect } from "react";
import { useStudentStore } from "@/stores/useStudentStore";
import type { StudentSearchParams } from "@/types/store";

interface UseStudentsOptions {
  params: StudentSearchParams;
}

/**
 * Custom hook for fetching and managing students data
 * Automatically fetches when params change
 */
export const useStudents = ({ params }: UseStudentsOptions) => {
  const {
    studentList,
    totalElements,
    totalPages,
    loading,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudentStore();

  // Auto-fetch when params change
  useEffect(() => {
    fetchStudents(params);
  }, [
    params.page,
    params.size,
    params.keyword,
    params.campus,
    params.status,
    params.sortBy,
    params.sortDir,
    fetchStudents,
  ]);

  return {
    students: studentList,
    totalElements,
    totalPages,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
