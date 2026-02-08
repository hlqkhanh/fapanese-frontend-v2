import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import type { Student } from "@/types/student";
import { UserStatus } from "@/types/userStatus";

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (email: string) => void;
}

const getStatusBadge = (status: number) => {
  switch (status) {
    case UserStatus.REJECTED:
      return <Badge variant="destructive">Vô hiệu hóa</Badge>;
    case UserStatus.UNVERIFIED_EMAIL:
      return (
        <Badge variant="secondary" className="bg-gray-400 text-white">
          Chưa xác thực
        </Badge>
      );
    case UserStatus.VERIFIED_UNACTIVE:
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Chờ kích hoạt</Badge>;
    case UserStatus.PENDING_APPROVAL:
      return <Badge className="bg-orange-500 hover:bg-orange-600">Chờ duyệt</Badge>;
    case UserStatus.ACTIVE:
      return <Badge className="bg-green-600 hover:bg-green-700">Hoạt động</Badge>;
    default:
      return <Badge variant="outline">Không rõ</Badge>;
  }
};

/**
 * Student table component with actions
 */
export function StudentTable({ students, loading, onEdit, onDelete }: StudentTableProps) {
  return (
    <div className="border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
      <table className="w-full text-sm text-left caption-bottom">
        <thead className="sticky top-0 z-20 bg-white shadow-sm [&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            <th className="h-12 px-4 align-middle font-medium w-[80px]">Avatar</th>
            <th className="h-12 px-4 align-middle font-medium">Họ và Tên</th>
            <th className="h-12 px-4 align-middle font-medium">Email</th>
            <th className="h-12 px-4 align-middle font-medium">Ngày sinh</th>
            <th className="h-12 px-4 align-middle font-medium">Cơ sở</th>
            <th className="h-12 px-4 align-middle font-medium">Trạng thái</th>
            <th className="h-12 px-4 align-middle font-medium text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {loading ? (
            <tr className="border-b">
              <td colSpan={7} className="p-4 h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr className="border-b">
              <td colSpan={7} className="p-4 h-24 text-center text-muted-foreground">
                Không tìm thấy sinh viên nào.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.email} className="border-b hover:bg-muted/50">
                <td className="p-2 px-4 align-middle">
                  <Avatar>
                    <AvatarImage src={student.avtUrl} />
                    <AvatarFallback>
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 align-middle font-medium">
                  {student.lastName} {student.firstName}
                </td>
                <td className="px-4 align-middle">{student.email}</td>
                <td className="px-4 align-middle">{student.dateOfBirth}</td>
                <td className="px-4 align-middle">
                  <Badge variant="outline">{student.campus}</Badge>
                </td>
                <td className="px-4 align-middle">{getStatusBadge(student.status)}</td>
                <td className="px-4 align-middle text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(student)}
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Xóa sinh viên: ${student.email}?`)) {
                          onDelete(student.email);
                        }
                      }}
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
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
