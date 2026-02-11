import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaPlay, FaClock } from "react-icons/fa";
import { BookMarked, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { lessonService } from "@/services/lessonService";
import { lessonPartService } from "@/services/lessonPartService";
import { courseService } from "@/services/courseService";
import { overviewService } from "@/services/overviewService";
import type { Lesson } from "@/types/lesson";
import type { Course } from "@/types/course";
import type { Overview } from "@/types/overview";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CourseDetailPage = () => {
  const { courseId, courseCode } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingLesson, setStartingLesson] = useState<number | null>(null);

  // Fetch course info and lessons
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course by ID or by Code
        let courseData: Course;
        
        if (courseId) {
          // Route: /course/:courseId
          console.log("🔍 Fetching course with ID:", courseId);
          const courseRes = await courseService.getById(Number(courseId));
          courseData = courseRes.result;
        } else if (courseCode) {
          // Route: /courses/:courseCode
          console.log("🔍 Fetching course with Code:", courseCode);
          const courseRes = await courseService.getByCode(courseCode);
          courseData = courseRes.result;
        } else {
          throw new Error("No course ID or code provided");
        }
        
        console.log("📚 Course data:", courseData);
        setCourse(courseData);

        // Fetch lessons for this course using courseCode
        if (courseData?.code) {
          console.log("🔍 Fetching lessons with courseCode:", courseData.code);
          const lessonsRes = await lessonService.getByCourseCode(courseData.code);
          console.log("📖 Lessons API response:", lessonsRes);
          
          // API returns array directly, not wrapped in { result: [...] }
          const lessonsArray: Lesson[] = Array.isArray(lessonsRes) ? lessonsRes : [];
          const sortedLessons = lessonsArray.sort(
            (a: Lesson, b: Lesson) => (a.orderIndex || 0) - (b.orderIndex || 0)
          );
          console.log("✅ Sorted lessons:", sortedLessons);
          setLessons(sortedLessons);
          
          // Fetch overview for this course (using course code)
          console.log("🔍 Fetching overview with courseCode:", courseData.code);
          const overviewData = await overviewService.getByCourseCode(courseData.code);
          console.log("📝 Overview API response:", overviewData);
          setOverview(overviewData);
          
          if (overviewData) {
            console.log("✅ Overview found! Title:", overviewData.title);
          } else {
            console.log("⚠️ No overview found for this course");
          }
        } else {
          console.warn("⚠️ No course code found in courseData");
        }
      } catch (error) {
        console.error("❌ Error fetching course data:", error);
        toast.error("Không thể tải thông tin khóa học!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, courseCode]);

  const handleStartLesson = async (lesson: Lesson) => {
    try {
      setStartingLesson(lesson.id);
      console.log("🎯 Starting lesson:", lesson);

      // Fetch lesson parts for the lesson
      const partsRes = await lessonPartService.getByLessonId(lesson.id);
      const parts = partsRes.result;
      console.log("📝 Lesson parts:", parts);

      if (!parts || parts.length === 0) {
        toast.error("Bài học này chưa có nội dung!");
        return;
      }

      // Get first lesson part (prioritize VOCABULARY if exists)
      const firstPart = parts.find((p) => p.type === "VOCABULARY") || parts[0];
      console.log("✅ First part selected:", firstPart);
      console.log("🔗 Navigating to:", `/lesson/${course?.code}/${lesson.id}/${firstPart.id}`);

      // Navigate to the lesson page
      navigate(`/lesson/${course?.code}/${lesson.id}/${firstPart.id}`, {
        state: { courseId: course?.id }
      });
    } catch (error) {
      console.error("Error starting lesson:", error);
      toast.error("Không thể bắt đầu bài học. Vui lòng thử lại!");
    } finally {
      setStartingLesson(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#f8fdfe] to-[#e6f7f9] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#f8fdfe] to-[#e6f7f9] flex items-center justify-center">
        <p className="text-xl text-gray-600">Không tìm thấy khóa học!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#f8fdfe] to-[#e6f7f9] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Simple Back Button */}
        <Link
          to="/courses"
          className="inline-flex items-center text-gray-600 hover:text-primary transition-colors text-sm font-medium group mb-6"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
          Quay lại danh sách khóa học
        </Link>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={course.imgUrl}
              alt={course.courseName}
              className="w-full md:w-64 h-48 object-cover rounded-2xl shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {course.courseName}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 bg-gradient-primary text-white font-bold rounded-full text-sm">
                  {course.code}
                </span>
                <span className="px-4 py-1.5 bg-red-600 text-white font-semibold rounded-full text-sm">
                  {course.price}
                </span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <FaClock className="text-primary" />
                <span className="font-medium">Thời lượng: {course.duration}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaBook className="text-primary" />
            Danh sách bài học
          </h2>

          {lessons.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-500">
                Khóa học này chưa có bài học nào.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center gap-6 p-6">
                    {/* Lesson Number */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold text-white">
                        {index + 1}
                      </span>
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                        {lesson.lessonTitle}
                      </h3>
                      {lesson.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    {/* Start Button */}
                    <Button
                      onClick={() => handleStartLesson(lesson)}
                      disabled={startingLesson === lesson.id}
                      className="flex-shrink-0 h-auto rounded-2xl bg-gradient-primary px-6 py-3 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {startingLesson === lesson.id ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <FaPlay className="mr-2" />
                          Bắt đầu
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Overview Section */}
        {overview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BookMarked className="text-primary" />
              Tổng ôn
            </h2>
            
            <div 
              onClick={async () => {
                try {
                  // Fetch first overview part to navigate to
                  const parts = await overviewService.getPartsByOverviewId(overview.id);
                  if (parts.length > 0) {
                    navigate(`/overview/${course?.code}/${overview.id}/${parts[0].id}`, {
                      state: { courseId: course?.id }
                    });
                  } else {
                    toast.error("Tổng ôn chưa có nội dung!");
                  }
                } catch (error) {
                  console.error("Error navigating to overview:", error);
                  toast.error("Không thể tải tổng ôn!");
                }
              }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {overview.title || "Ôn luyện tổng hợp"}
                  </h3>
                  <p className="text-gray-600 text-base mb-4">
                    {overview.description || "Luyện tập Speaking, làm đề thi giữa kỳ và cuối kỳ để củng cố kiến thức."}
                  </p>
                  <Button className="bg-primary text-white hover:opacity-90 font-semibold px-5 py-2 rounded-lg transition-all">
                    Bắt đầu ôn tập →
                  </Button>
                </div>
                <div className="hidden md:flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors duration-200">
                  <BookMarked className="h-12 w-12 text-primary" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
