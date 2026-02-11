import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import type { CoursePayload } from "@/types/course";

// Hooks
import { useCourses } from "@/hooks/admin/useCourses";
import { useFormModal } from "@/hooks/admin/useFormModal";
import { useImageUpload } from "@/hooks/admin/useImageUpload";

// Components
import { Input } from "@/components/ui/input";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { CourseTable } from "@/components/admin/CourseTable";
import { CourseFormModal } from "@/components/admin/CourseFormModal";

const initialFormData: CoursePayload = {
  courseName: "",
  description: "",
  imgUrl: "",
  price: "",
  level: "",
  code: "",
  title: "",
  duration: "",
};


export default function CourseManagePage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Data hooks
  const { courses, loading, createCourse, updateCourse, deleteCourse } =
    useCourses();

  // Image upload hook
  const imageUpload = useImageUpload();

  // Form modal hook
  const modal = useFormModal({
    initialData: initialFormData,
    onSubmit: async (data, isEdit, identifier) => {
      if (!data.courseName || !data.code) {
        toast.warning("Vui lòng điền tên và mã khóa học");
        return;
      }

      // Use uploaded image URL if available
      const payload = {
        ...data,
        imgUrl: imageUpload.imageUrl || data.imgUrl,
      };

      if (isEdit && identifier) {
        await updateCourse(Number(identifier), payload);
      } else {
        await createCourse(payload);
      }

      // Reset image upload state
      imageUpload.reset();
    },
    onSuccess: () => {
      imageUpload.reset();
    },
  });

  // Filter courses by search term
  const filteredCourses = useMemo(() => {
    if (!searchTerm) return courses;
    
    const term = searchTerm.toLowerCase();
    return courses.filter(
      (c) =>
        c.courseName.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  // Handle create
  const handleCreate = () => {
    imageUpload.reset();
    modal.openCreate();
  };

  // Handle edit
  const handleEdit = (course: any) => {
    imageUpload.setInitialImage(course.imgUrl || "");
    modal.openEdit(course, course.id.toString());
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 px-5 py-0 overflow-hidden">
      {/* Toolbar */}
      <AdminToolbar
        onCreateClick={handleCreate}
        loading={loading}
        createButtonText="Thêm khóa học"
      >
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm mã hoặc tên..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />


      </AdminToolbar>

      {/* Hidden file input */}
      <input
        type="file"
        ref={imageUpload.fileInputRef}
        onChange={imageUpload.handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Table */}
      <CourseTable
        courses={filteredCourses}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteCourse}
      />

      {/* Form Modal */}
      <CourseFormModal
        open={modal.isOpen}
        isEdit={modal.isEdit}
        formData={modal.formData}
        previewUrl={imageUpload.previewUrl}
        uploading={imageUpload.uploading}
        onOpenChange={modal.close}
        onSubmit={modal.handleSubmit}
        onFieldChange={modal.updateField}
        onImageClick={imageUpload.triggerFileInput}
        loading={loading}
      />
    </div>
  );
}