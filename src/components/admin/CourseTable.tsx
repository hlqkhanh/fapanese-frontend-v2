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
    <>
      {/* Loading State */}
      {loading && courses.length === 0 && (
        <div className="flex justify-center items-center h-64 bg-white rounded-md">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
        <div className="text-center py-20 bg-white rounded-md">
          <p className="text-muted-foreground">Không tìm thấy khóa học nào.</p>
        </div>
      )}

      {/* Mobile Card Layout */}
      {courses.length > 0 && (
        <div className="block lg:hidden space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Course Image and Title */}
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-16 rounded overflow-hidden bg-muted flex items-center justify-center border flex-shrink-0">
                  {course.imgUrl ? (
                    <img
                      src={course.imgUrl}
                      alt={course.courseName}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base uppercase truncate">
                    {course.courseName}
                  </h3>
                  <p className="text-xs text-muted-foreground italic line-clamp-2 mt-1">
                    {course.title}
                  </p>
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mã khóa học</p>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {course.code}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Trình độ</p>
                  <p className="text-sm font-medium">{course.level}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Giá</p>
                  <p className="text-base font-semibold text-green-600">
                    {course.price}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => onEdit(course)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    if (confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
                      onDelete(course.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop/Tablet Table Layout */}
      {courses.length > 0 && (
        <div className="hidden lg:block border rounded-md bg-white shadow-sm overflow-y-auto relative scroll-smooth">
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
              {courses.map((course) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
