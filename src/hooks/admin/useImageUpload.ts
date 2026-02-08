import { useState, useRef, useCallback } from "react";
import { fileService } from "@/services/fileService";
import { toast } from "sonner";

/**
 * Custom hook for handling image file upload
 */
export const useImageUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setImageFile(file);

      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload immediately
      try {
        setUploading(true);
        const imageUrl = await fileService.uploadFile(file, "fapanese/courses");
        setImageUrl(imageUrl);
        toast.success("Upload ảnh thành công");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Lỗi khi upload ảnh");
        setImageFile(null);
        setPreviewUrl("");
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const reset = useCallback(() => {
    setImageUrl("");
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const setInitialImage = useCallback((url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
  }, []);

  return {
    fileInputRef,
    imageUrl,
    imageFile,
    previewUrl,
    uploading,
    handleFileChange,
    triggerFileInput,
    reset,
    setInitialImage,
  };
};
