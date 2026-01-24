"use client";

import { useEffect } from "react";
import { useCourseStore } from "@/stores/useCoureStore";
// Import CourseCard và Interface Course (nếu cần dùng type)
import CourseCard from "@/components/course/CourseCard"; 
import { Loader2 } from "lucide-react";

export default function CourseList() {
    // 1. Lấy state và actions từ store
    const { courseList, loading, fetchCourses } = useCourseStore();

    // 2. Gọi API khi component được mount
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // 3. Loading State
    if (loading && courseList.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }
    
    // 4. Empty State (Nếu API trả về rỗng)
    if (!loading && courseList.length === 0) {
        return <div className="text-center py-20">Hiện chưa có khóa học nào.</div>;
    }

    return (
        <section className="w-full bg-gray-100 py-30 px-6 break-all">
            <div className="max-w-7xl mx-auto">
                {/* 5. Loop qua danh sách khóa học */}
                <div className="flex flex-col gap-10">
                    {courseList.map((course) => (
                        <CourseCard 
                            key={course.id} // Bắt buộc phải có key duy nhất
                            course={course} // Truyền toàn bộ object course vào props
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}