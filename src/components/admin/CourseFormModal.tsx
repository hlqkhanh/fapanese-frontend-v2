import { FormModal } from "@/components/admin/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, UploadCloud } from "lucide-react";
import type { CoursePayload } from "@/types/course";

interface CourseFormModalProps {
  open: boolean;
  isEdit: boolean;
  formData: CoursePayload;
  previewUrl: string;
  uploading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: keyof CoursePayload, value: any) => void;
  onImageClick: () => void;
  loading?: boolean;
}

/**
 * Form modal for creating/editing courses
 */
export function CourseFormModal({
  open,
  isEdit,
  formData,
  previewUrl,
  uploading,
  onOpenChange,
  onSubmit,
  onFieldChange,
  onImageClick,
  loading = false,
}: CourseFormModalProps) {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Cập nhật khóa học" : "Thêm khóa học mới"}
      description="Nhập đầy đủ thông tin bên dưới."
      onSubmit={onSubmit}
      isEdit={isEdit}
      loading={loading || uploading}
    >
      {/* Course Image */}
      <div className="grid gap-2">
        <Label>Ảnh khóa học</Label>
        <div className="flex items-center gap-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md border"
            />
          ) : (
            <div className="w-24 h-24 bg-muted rounded-md border flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onImageClick}
            disabled={uploading}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {uploading ? "Đang tải..." : "Chọn ảnh"}
          </Button>
        </div>
      </div>

      {/* Course Code */}
      <div className="grid gap-2">
        <Label>
          Mã khóa học <span className="text-red-500">*</span>
        </Label>
        <Input
          name="code"
          value={formData.code}
          onChange={(e) => onFieldChange("code", e.target.value)}
          placeholder="Ví dụ: JAPANESE_N5"
          required
          disabled={isEdit}
        />
      </div>

      {/* Course Name */}
      <div className="grid gap-2">
        <Label>
          Tên khóa học <span className="text-red-500">*</span>
        </Label>
        <Input
          name="courseName"
          value={formData.courseName}
          onChange={(e) => onFieldChange("courseName", e.target.value)}
          placeholder="Ví dụ: Tiếng Nhật N5"
          required
        />
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <Label>Mô tả</Label>
        <Textarea
          name="description"
          value={formData.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Mô tả ngắn về khóa học..."
          rows={3}
        />
      </div>

      {/* Duration */}
      <div className="grid gap-2">
        <Label>Thời lượng (giờ)</Label>
        <Input
          name="duration"
          type="number"
          value={formData.duration || ""}
          onChange={(e) => onFieldChange("duration", parseInt(e.target.value))}
          placeholder="Ví dụ: 40"
          min="1"
        />
      </div>
    </FormModal>
  );
}
