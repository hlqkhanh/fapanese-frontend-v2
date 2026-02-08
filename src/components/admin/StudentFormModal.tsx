import { FormModal } from "@/components/admin/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserStatus } from "@/types/userStatus";
import type { StudentPayload } from "@/types/student";

interface StudentFormModalProps {
  open: boolean;
  isEdit: boolean;
  formData: StudentPayload;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: keyof StudentPayload, value: any) => void;
  loading?: boolean;
}

/**
 * Form modal for creating/editing students
 */
export function StudentFormModal({
  open,
  isEdit,
  formData,
  onOpenChange,
  onSubmit,
  onFieldChange,
  loading = false,
}: StudentFormModalProps) {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Cập nhật thông tin" : "Thêm sinh viên"}
      description="Nhập đầy đủ thông tin bên dưới."
      onSubmit={onSubmit}
      isEdit={isEdit}
      loading={loading}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>
            Họ <span className="text-red-500">*</span>
          </Label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={(e) => onFieldChange("lastName", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>
            Tên <span className="text-red-500">*</span>
          </Label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={(e) => onFieldChange("firstName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          required
          disabled={isEdit}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Ngày sinh</Label>
          <Input
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Cơ sở</Label>
          <Select
            value={formData.campus}
            onValueChange={(value) => onFieldChange("campus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn cơ sở học tập" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quy Nhơn">Quy Nhơn</SelectItem>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
              <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
              <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isEdit && (
        <div className="grid gap-2">
          <Label>Trạng thái</Label>
          <Select
            value={formData.status?.toString()}
            onValueChange={(val) =>
              onFieldChange("status", parseInt(val) as UserStatus)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserStatus.REJECTED.toString()}>
                Vô hiệu hóa
              </SelectItem>
              <SelectItem value={UserStatus.UNVERIFIED_EMAIL.toString()}>
                Chưa xác thực
              </SelectItem>
              <SelectItem value={UserStatus.VERIFIED_UNACTIVE.toString()}>
                Chờ kích hoạt
              </SelectItem>
              <SelectItem value={UserStatus.PENDING_APPROVAL.toString()}>
                Chờ duyệt
              </SelectItem>
              <SelectItem value={UserStatus.ACTIVE.toString()}>Hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </FormModal>
  );
}
