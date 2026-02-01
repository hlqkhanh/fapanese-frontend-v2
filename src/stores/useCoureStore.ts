import { create } from "zustand";
import type { CourseState } from "@/types/store";
import { toast } from "sonner";
import { courseService } from "@/services/courseService";
import type { AxiosError } from "axios";
import { fileService } from "@/services/fileService";


export const useCourseStore = create<CourseState>((set, get) => ({
    courseList: [],
    selectedCourse: null,
    loading: false,

    reset: () => {
        set({ courseList: [], selectedCourse: null, loading: false });
    },


    fetchCourses: async () => {
        try {
            set({ loading: true });
            const response = await courseService.fetchAll();

            set({ courseList: response.result });

        } catch (error) {
            console.error("Fetch courses error:", error);
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Không thể lấy khóa học. Server đang tạm đóng");
        } finally {
            set({ loading: false });
        }
    },

    fetchCourseById: async (id: number) => {
        try {
            set({ loading: true });
            const response = await courseService.fetchById(id);


            set({ selectedCourse: response.result });

        } catch (error) {
            console.error(`Fetch course ${id} error:`, error);

            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message);

            set({ selectedCourse: null });
        } finally {
            set({ loading: false });
        }
    },

    createCourse: async (data) => {
        try {
            set({ loading: true });
            await courseService.create(data);


            toast.success("Tạo khóa học thành công");
            await get().fetchCourses();

            return Promise.resolve();
        } catch (error) {

            const err = error as AxiosError<{ code: number, message: string }>;


            console.error("Create course error:", error);
            toast.error(err.response?.data?.message);

            return Promise.reject(error);
        } finally {
            set({ loading: false });
        }
    },


    updateCourse: async (id, data) => {
        try {
            set({ loading: true });
            const response = await courseService.update(id, data);

            toast.success("Cập nhật thành công");

            const updatedCourse = response.result;
            set((state) => ({
                courseList: state.courseList.map((c) => (c.id === id ? updatedCourse : c)),
                selectedCourse: updatedCourse,
            }));

        } catch (error) {
            // 2. Ép kiểu error
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message);
            console.error("Update course error:", error);


        } finally {
            set({ loading: false });
        }
    },

    deleteCourse: async (id) => {
        try {
            set({ loading: true });

            const currentCourse = get().courseList.find(c => c.id === id);
            if (currentCourse?.imgUrl) {
            try {
                await fileService.deleteFileByUrl(currentCourse.imgUrl);
                console.log("Đã xóa ảnh trên Cloudinary thành công");
            } catch (fileErr) {
                // Nếu xóa ảnh lỗi (ví dụ file ko tồn tại), vẫn cho phép tiếp tục xóa khóa học
                console.warn("Không thể xóa ảnh trên Cloudinary:", fileErr);
            }
        }

            await courseService.delete(id);

            toast.success("Xóa khóa học thành công");

            set((state) => ({
                courseList: state.courseList.filter((c) => c.id !== id),
                selectedCourse:
                    state.selectedCourse?.id === id ? null : state.selectedCourse,
            }));

        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message);
            console.error("Delete course error:", error);
            
        } finally {
            set({ loading: false });
        }

    },
}));