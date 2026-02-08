import { FormModal } from "@/components/admin/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserStatus } from "@/types/userStatus";
import type { LecturerPayload } from "@/types/lecturer";

interface LecturerFormModalProps {
  open: boolean;
  isEdit: boolean;
  formData: LecturerPayload;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: keyof LecturerPayload, value: any) => void;
  loading?: boolean;
}

/**
 * Form modal for creating/editing lecturers
 */
export function LecturerFormModal({
  open,
  isEdit,
  formData,
  onOpenChange,
  onSubmit,
  onFieldChange,
  loading = false,
}: LecturerFormModalProps) {
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Cập nhật giảng viên" : "Thêm giảng viên mới"}
      onSubmit={onSubmit}
      isEdit={isEdit}
      loading={loading}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Họ</Label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={(e) => onFieldChange("lastName", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Tên</Label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={(e) => onFieldChange("firstName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          disabled={isEdit}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Chuyên môn</Label>
          <Input
            value={formData.expertise}
            onChange={(e) => onFieldChange("expertise", e.target.value)}
            placeholder="VD: Java, React..."
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Ngày sinh</Label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Tiểu sử (Bio)</Label>
        <Textarea
          value={formData.bio}
          onChange={(e) => onFieldChange("bio", e.target.value)}
          placeholder="Mô tả ngắn về giảng viên..."
          rows={3}
        />
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
              <SelectItem value={UserStatus.ACTIVE.toString()}>
                Hoạt động
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </FormModal>
  );
}
