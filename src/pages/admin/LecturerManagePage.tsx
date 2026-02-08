import { toast } from "sonner";
import { UserStatus } from "@/types/userStatus";
import type { LecturerPayload, LecturerSearchParams } from "@/types/lecturer";

// Hooks
import { useTableFilters } from "@/hooks/admin/useTableFilters";
import { useFormModal } from "@/hooks/admin/useFormModal";
import { useLecturers } from "@/hooks/admin/useLecturers";
import { useLecturerStore } from "@/stores/useLecturerStore";

// Components
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { LecturerFilters } from "@/components/admin/LecturerFilters";
import { LecturerTable } from "@/components/admin/LecturerTable";
import { LecturerFormModal } from "@/components/admin/LecturerFormModal";
import { PaginationFooter } from "@/components/admin/PaginationFooter";

const initialFormData: LecturerPayload = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  bio: "",
  expertise: "",
  status: UserStatus.PENDING_APPROVAL,
};

export default function LecturerManagePage() {
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
  const apiParams: LecturerSearchParams = {
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
    lecturers,
    totalElements,
    totalPages,
    loading,
    createLecturer,
    updateLecturer,
    deleteLecturer,
  } = useLecturers({ params: apiParams });

  // Approve/Reject actions from store
  const { approveLecturer, rejectLecturer } = useLecturerStore();

  // Form modal state
  const modal = useFormModal({
    initialData: initialFormData,
    onSubmit: async (data, isEdit, identifier) => {
      if (!data.email || !data.firstName || !data.lastName) {
        toast.warning("Vui lòng điền thông tin bắt buộc");
        return;
      }

      if (isEdit && identifier) {
        await updateLecturer(identifier, data);
      } else {
        await createLecturer(data);
      }
    },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] gap-4 px-5 py-0 overflow-hidden">
      {/* Toolbar */}
      <AdminToolbar
        onCreateClick={modal.openCreate}
        loading={loading}
        createButtonText="Thêm giảng viên"
      >
        <LecturerFilters
          keyword={params.search || ""}
          campus={params.campus || "all"}
          status={params.status || "all"}
          onSearchChange={setSearch}
          onCampusChange={(value) => setFilter("campus", value)}
          onStatusChange={(value) => setFilter("status", value)}
        />
      </AdminToolbar>

      {/* Table */}
      <LecturerTable
        lecturers={lecturers}
        loading={loading}
        onEdit={(lecturer) => modal.openEdit(lecturer, lecturer.email)}
        onDelete={deleteLecturer}
        onApprove={approveLecturer}
        onReject={rejectLecturer}
      />

      {/* Pagination */}
      <PaginationFooter
        currentPage={params.page || 0}
        totalPages={totalPages}
        totalItems={totalElements}
        currentItems={lecturers.length}
        onPageChange={setPage}
        loading={loading}
        itemLabel="giảng viên"
      />

      {/* Form Modal */}
      <LecturerFormModal
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