import { useRef, useCallback } from "react";
import { useStudentStore } from "@/stores/useStudentStore";

/**
 * Custom hook for handling Excel file upload for students
 */
export const useExcelUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadStudentExcel, loading } = useStudentStore();

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await uploadStudentExcel(file);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [uploadStudentExcel]
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileUpload,
    triggerFileInput,
    loading,
  };
};
