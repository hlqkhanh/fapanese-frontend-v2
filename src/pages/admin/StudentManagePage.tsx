import { toast } from "sonner";
import { UserStatus } from "@/types/userStatus";
import type { StudentPayload, StudentSearchParams } from "@/types/student";

// Hooks
import { useTableFilters } from "@/hooks/admin/useTableFilters";
import { useFormModal } from "@/hooks/admin/useFormModal";
import { useStudents } from "@/hooks/admin/useStudents";
import { useExcelUpload } from "@/hooks/admin/useExcelUpload";

// Components
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { StudentFilters } from "@/components/admin/StudentFilters";
import { StudentTable } from "@/components/admin/StudentTable";
import { StudentFormModal } from "@/components/admin/StudentFormModal";
import { PaginationFooter } from "@/components/admin/PaginationFooter";

const initialFormData: StudentPayload = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  campus: "",
  status: UserStatus.UNVERIFIED_EMAIL,
};

export default function StudentManagePage() {
  // Table filters with debounce
  const {
    params,
    debouncedParams,
    setSearch,
    setFilter,
    setPage,
  } = useTableFilters({
    initialParams: {
      page: 0,
      size: 10,
      search: "",
      campus: "all",
      status: "all",
    },
  });

  // Build API params
  const apiParams: StudentSearchParams = {
    page: debouncedParams.page || 0,
    size: debouncedParams.size || 10,
    keyword: debouncedParams.search,
    sortDir: "desc",
    sortBy: "id",
  };

  if (params.campus && params.campus !== "all") {
    apiParams.campus = params.campus;
  }
  if (params.status && params.status !== "all") {
    apiParams.status = Number(params.status);
  }

  // Data fetching
  const {
    students,
    totalElements,
    totalPages,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents({ params: apiParams });

  // Form modal state
  const modal = useFormModal({
    initialData: initialFormData,
    onSubmit: async (data, isEdit, identifier) => {
      if (!data.email || !data.firstName || !data.lastName) {
        toast.warning("Vui lòng điền thông tin bắt buộc");
        return;
      }

      if (isEdit && identifier) {
        await updateStudent(identifier, data);
      } else {
        await createStudent(data);
      }
    },
  });

  // Excel upload
  const { fileInputRef, handleFileUpload, triggerFileInput } = useExcelUpload();

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 px-5 py-0 overflow-hidden">
      {/* Toolbar */}
      <AdminToolbar
        onCreateClick={modal.openCreate}
        onExcelClick={triggerFileInput}
        loading={loading}
        showExcelButton
        createButtonText="Thêm mới"
      >
        <StudentFilters
          keyword={params.search || ""}
          campus={params.campus || "all"}
          status={params.status || "all"}
          onSearchChange={setSearch}
          onCampusChange={(value) => setFilter("campus", value)}
          onStatusChange={(value) => setFilter("status", value)}
        />
      </AdminToolbar>

      {/* Hidden file input for Excel upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
        className="hidden"
      />

      {/* Table */}
      <StudentTable
        students={students}
        loading={loading}
        onEdit={(student) => modal.openEdit(student, student.email)}
        onDelete={deleteStudent}
      />

      {/* Pagination */}
      <PaginationFooter
        currentPage={params.page || 0}
        totalPages={totalPages}
        totalItems={totalElements}
        currentItems={students.length}
        onPageChange={setPage}
        loading={loading}
        itemLabel="sinh viên"
      />

      {/* Form Modal */}
      <StudentFormModal
        open={modal.isOpen}
        isEdit={modal.isEdit}
        formData={modal.formData}
        onOpenChange={modal.close}
        onSubmit={modal.handleSubmit}
        onFieldChange={modal.updateField}
        loading={loading}
      />
    </div>
  );
}