import { create } from "zustand";
import type { StudentState } from "@/types/store";
import { toast } from "sonner";
import { studentService } from "@/services/studentService";
import type { AxiosError } from "axios";

export const useStudentStore = create<StudentState>((set, get) => ({
    studentList: [],
    selectedStudent: null,
    loading: false,

    reset: () => {
        set({ studentList: [], selectedStudent: null, loading: false });
    },

    fetchStudents: async () => {
        try {
            set({ loading: true });
            const response = await studentService.fetchAll();
            set({ studentList: response.result });
        } catch (error) {
            console.error("Fetch students error:", error);
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Không thể lấy danh sách sinh viên.");
        } finally {
            set({ loading: false });
        }
    },

    fetchStudentByEmail: async (email: string) => {
        try {
            set({ loading: true });
            const response = await studentService.fetchByEmail(email);
            set({ selectedStudent: response.result });
        } catch (error) {
            console.error(`Fetch student ${email} error:`, error);
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Không tìm thấy sinh viên.");
            set({ selectedStudent: null });
        } finally {
            set({ loading: false });
        }
    },

    createStudent: async (data) => {
        try {
            set({ loading: true });
            await studentService.create(data);
            
            toast.success("Thêm sinh viên thành công");
            
            // Refresh lại danh sách sau khi tạo
            await get().fetchStudents();

            return Promise.resolve();
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            console.error("Create student error:", error);
            toast.error(err.response?.data?.message || "Lỗi khi tạo sinh viên.");
            return Promise.reject(error);
        } finally {
            set({ loading: false });
        }
    },

    updateStudent: async (email, data) => {
        try {
            set({ loading: true });
            const response = await studentService.update(email, data);

            toast.success("Cập nhật sinh viên thành công");

            const updatedStudent = response.result;
            
            // Cập nhật trực tiếp vào state local để đỡ phải fetch lại toàn bộ list
            set((state) => ({
                studentList: state.studentList.map((s) => (s.email === email ? updatedStudent : s)),
                selectedStudent: updatedStudent,
            }));

            return Promise.resolve();
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi khi cập nhật sinh viên.");
            console.error("Update student error:", error);
            return Promise.reject(error);
        } finally {
            set({ loading: false });
        }
    },

    deleteStudent: async (email) => {
        try {
            set({ loading: true });
            await studentService.delete(email);

            toast.success("Xóa sinh viên thành công");

            // Loại bỏ sinh viên khỏi danh sách local
            set((state) => ({
                studentList: state.studentList.filter((s) => s.email !== email),
                selectedStudent:
                    state.selectedStudent?.email === email ? null : state.selectedStudent,
            }));
            
            return Promise.resolve();
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi khi xóa sinh viên.");
            console.error("Delete student error:", error);
            return Promise.reject(error);
        } finally {
            set({ loading: false });
        }
    },

    uploadStudentExcel: async (file) => {
        try {
            set({ loading: true });
            const response = await studentService.uploadExcel(file);
            
            const { successCount, failureCount, totalRowsProcessed } = response.result;
            
            if (failureCount > 0) {
                 toast.warning(`Đã xử lý ${totalRowsProcessed} dòng. Thành công: ${successCount}. Lỗi: ${failureCount}`);
            } else {
                 toast.success(`Import thành công ${successCount} sinh viên.`);
            }

            // Refresh lại danh sách
            await get().fetchStudents();
            
            return Promise.resolve();
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi khi upload file excel.");
            console.error("Upload excel error:", error);
            return Promise.reject(error);
        } finally {
            set({ loading: false });
        }
    }
}));