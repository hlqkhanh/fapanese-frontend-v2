import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import type { Course } from "@/types/course";



interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    
    return (
        <Card className="relative group overflow-hidden rounded-3xl border-gray-200 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl mb-10 last:mb-0">
            <CardContent className="p-0">
                <div className="grid grid-cols-10 items-stretch gap-6 p-6 sm:p-3">

                    {/* --- Cột Hình ảnh --- */}
                    <div className="col-span-10 flex flex-col items-center justify-center space-y-4 sm:col-span-6 relative h-full">
                        <img
                            src={course.imgUrl} 
                            alt={course.courseName}
                            className="h-full w-full object-cover rounded-2xl shadow-md transition duration-500"
                        />
                    </div>

                    {/* --- Cột Thông tin --- */}
                    <div className="col-span-10 space-y-3 px-5 py-5 text-right tracking-wider sm:col-span-4">

                        {/* Header: Giá & Tên */}
                        <div className="flex flex-col items-end gap-2">
                            <span className="rounded-2xl bg-red-700 px-3 py-1 text-base font-bold text-white hover:bg-red-800">
                                {course.price} 
                            </span>
                            <span className="font-sans text-2xl font-semibold text-green-950">
                                {course.courseName}
                            </span>
                        </div>

                        {/* Mã khóa học */}
                        <h2 className="font-sans text-5xl font-bold text-[#023333]">
                            {course.code}
                        </h2>

                        {/* Mô tả */}
                        <p className="text-sm leading-relaxed text-gray-600 sm:text-base line-clamp-2">
                           {course.description}
                        </p>

                        {/* Thời lượng */}
                        <p className="font-semibold text-gray-900">
                            ⏱ Thời lượng: {course.duration}
                        </p>

                        <br />

                        {/* Button Action */}
                        <Button
                            asChild
                            className="h-auto rounded-3xl border border-[#B2EBF2] bg-gradient-to-r from-[#9bced5] to-[#9cdfe8] px-10 py-2 text-lg font-bold text-white shadow-lg hover:opacity-90 hover:shadow-xl"
                        >
                            <Link to={`/courses/${course.id}`}>
                                BẮT ĐẦU HỌC!
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseCard;