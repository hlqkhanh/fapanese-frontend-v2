import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import type { Lecturer } from "@/types/lecturer";
import { UserStatus } from "@/types/userStatus";

interface LecturerTableProps {
  lecturers: Lecturer[];
  loading: boolean;
  onEdit: (lecturer: Lecturer) => void;
  onDelete: (email: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const getStatusBadge = (status: number) => {
  switch (status) {
    case UserStatus.REJECTED:
      return <Badge variant="destructive">Đã từ chối</Badge>;
    case UserStatus.UNVERIFIED_EMAIL:
      return <Badge variant="secondary">Chưa xác thực</Badge>;
    case UserStatus.PENDING_APPROVAL:
      return <Badge className="bg-orange-500 hover:bg-orange-600">Chờ duyệt</Badge>;
    case UserStatus.ACTIVE:
      return <Badge className="bg-green-600 hover:bg-green-700">Hoạt động</Badge>;
    default:
      return <Badge variant="outline">Không rõ</Badge>;
  }
};

/**
 * Lecturer table component with actions including approve/reject
 */
export function LecturerTable({
  lecturers,
  loading,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: LecturerTableProps) {
  return (
    <div className="border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
      <table className="w-full text-sm text-left">
        <thead className="sticky top-0 z-20 bg-white border-b">
          <tr className="hover:bg-muted/50">
            <th className="h-12 px-4 align-middle font-medium w-[80px]">Avatar</th>
            <th className="h-12 px-4 align-middle font-medium">Họ và Tên</th>
            <th className="h-12 px-4 align-middle font-medium">Chuyên môn</th>
            <th className="h-12 px-4 align-middle font-medium">Trạng thái</th>
            <th className="h-12 px-4 align-middle font-medium text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </td>
            </tr>
          ) : lecturers.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-muted-foreground">
                Không tìm thấy giảng viên nào.
              </td>
            </tr>
          ) : (
            lecturers.map((lecturer) => (
              <tr key={lecturer.id} className="border-b hover:bg-muted/50">
                <td className="p-2 px-4">
                  <Avatar>
                    <AvatarImage src={lecturer.avtUrl} />
                    <AvatarFallback>{lecturer.firstName[0]}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 font-medium">
                  <div>
                    {lecturer.lastName} {lecturer.firstName}
                  </div>
                  <div className="text-xs text-muted-foreground font-normal">
                    {lecturer.email}
                  </div>
                </td>
                <td className="px-4">
                  <Badge variant="outline">{lecturer.expertise}</Badge>
                </td>
                <td className="px-4">{getStatusBadge(lecturer.status)}</td>
                <td className="px-4 text-right">
                  <div className="flex justify-end gap-1">
                    {/* Approve/Reject buttons for pending lecturers */}
                    {lecturer.status === UserStatus.PENDING_APPROVAL && (
                      <>
                        {onApprove && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Duyệt"
                            onClick={() => onApprove(lecturer.id)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {onReject && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Từ chối"
                            onClick={() => onReject(lecturer.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(lecturer)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Xóa giảng viên này?")) {
                          onDelete(lecturer.email);
                        }
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
