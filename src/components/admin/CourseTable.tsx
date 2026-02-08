import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import type { Course } from "@/types/course";

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}

/**
 * Course table component with actions
 */
export function CourseTable({ courses, loading, onEdit, onDelete }: CourseTableProps) {
  return (
    <div className="border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
      <table className="w-full text-sm text-left">
        <thead className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <tr>
            <th className="h-12 px-4 font-medium w-[100px]">Hình ảnh</th>
            <th className="h-12 px-4 font-medium">Khóa học</th>
            <th className="h-12 px-4 font-medium">Mã</th>
            <th className="h-12 px-4 font-medium">Trình độ</th>
            <th className="h-12 px-4 font-medium">Giá</th>
            <th className="h-12 px-4 font-medium text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading && courses.length === 0 ? (
            <tr>
              <td colSpan={6} className="h-24 text-center">
                <Loader2 className="animate-spin mx-auto text-primary" />
              </td>
            </tr>
          ) : courses.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                Không tìm thấy khóa học nào.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr
                key={course.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="p-4">
                  <div className="w-16 h-10 rounded overflow-hidden bg-muted flex items-center justify-center border">
                    {course.imgUrl ? (
                      <img
                        src={course.imgUrl}
                        alt={course.courseName}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="px-4 font-medium">
                  <div className="uppercase font-bold">
                    {course.courseName}
                  </div>
                  <div className="text-xs text-muted-foreground font-normal line-clamp-1 italic">
                    {course.title}
                  </div>
                </td>
                <td className="px-4">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {course.code}
                  </Badge>
                </td>
                <td className="px-4">{course.level}</td>
                <td className="px-4 font-semibold text-green-600">
                  {course.price}
                </td>
                <td className="px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => onEdit(course)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (
                          confirm("Bạn có chắc chắn muốn xóa khóa học này?")
                        ) {
                          onDelete(course.id);
                        }
                      }}
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
