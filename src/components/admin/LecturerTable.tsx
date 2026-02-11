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
    <>
      {/* Loading State */}
      {loading && lecturers.length === 0 && (
        <div className="flex justify-center items-center h-64 bg-white rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && lecturers.length === 0 && (
        <div className="bg-white rounded-md p-12 text-center text-muted-foreground">
          Không tìm thấy giảng viên nào.
        </div>
      )}

      {/* Mobile Cards (< lg) */}
      {!loading && lecturers.length > 0 && (
        <div className="lg:hidden space-y-4">
          {lecturers.map((lecturer) => (
            <div
              key={lecturer.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4"
            >
              {/* Header: Avatar + Name */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={lecturer.avtUrl} />
                  <AvatarFallback>{lecturer.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {lecturer.lastName} {lecturer.firstName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{lecturer.email}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Chuyên môn</p>
                  <Badge variant="outline">{lecturer.expertise}</Badge>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Trạng thái</p>
                  {getStatusBadge(lecturer.status)}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t">
                {/* Approve/Reject for pending lecturers */}
                {lecturer.status === UserStatus.PENDING_APPROVAL && (onApprove || onReject) && (
                  <div className="flex gap-2">
                    {onApprove && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(lecturer.id)}
                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Duyệt
                      </Button>
                    )}
                    {onReject && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(lecturer.id)}
                        className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Từ chối
                      </Button>
                    )}
                  </div>
                )}

                {/* Edit/Delete actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(lecturer)}
                    className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 mr-1.5" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Xóa giảng viên này?")) {
                        onDelete(lecturer.email);
                      }
                    }}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table (>= lg) */}
      {!loading && lecturers.length > 0 && (
        <div className="hidden lg:block border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
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
              {lecturers.map((lecturer) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
