import { create } from "zustand";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { lecturerService } from "@/services/lecturerService";
import type { LecturerState } from "@/types/store";
import type { LecturerSearchParams } from "@/types/lecturer";

export const useLecturerStore = create<LecturerState>((set, get) => ({
    lecturerList: [],
    selectedLecturer: null,
    loading: false,
    totalElements: 0,
    totalPages: 0,

    reset: () => {
        set({ 
            lecturerList: [], 
            selectedLecturer: null, 
            loading: false, 
            totalElements: 0, 
            totalPages: 0 
        });
    },

    // 1. Lấy danh sách giảng viên (có phân trang & lọc)
    fetchLecturers: async (params?: LecturerSearchParams) => {
        try {
            set({ loading: true });
            const response = await lecturerService.fetchAll(params);
            set({ 
                lecturerList: response.result.content, 
                totalElements: response.result.totalElements,
                totalPages: response.result.totalPages
            });
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || "Không thể lấy danh sách giảng viên.");
        } finally {
            set({ loading: false });
        }
    },

    // 2. Lấy chi tiết giảng viên qua email
    fetchLecturerByEmail: async (email: string) => {
        try {
            set({ loading: true });
            const response = await lecturerService.fetchByEmail(email);
            set({ selectedLecturer: response.result });
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Không thể lấy danh sách giảng viên.");
            set({ selectedLecturer: null });
        } finally {
            set({ loading: false });
        }
    },

    // 3. Tạo mới giảng viên
    createLecturer: async (data) => {
        try {
            set({ loading: true });
            await lecturerService.create(data);
            toast.success("Thêm giảng viên thành công");
            await get().fetchLecturers(); // Load lại danh sách
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi không xác định");
            return Promise.reject(error);
        } finally {
            set({ loading: false });
        }
    },

    // 4. Cập nhật thông tin
    updateLecturer: async (email, data) => {
        try {
            set({ loading: true });
            const response = await lecturerService.update(email, data);
            toast.success("Cập nhật giảng viên thành công");

            const updated = response.result;
            // Cập nhật local state
            set((state) => ({
                lecturerList: state.lecturerList.map((l) => (l.email === email ? updated : l)),
                selectedLecturer: updated,
            }));
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi không xác định");
            return Promise.reject(error);
        } finally {
            set({ loading: false });
        }
    },

    // 5. Xóa giảng viên
    deleteLecturer: async (email) => {
        try {
            set({ loading: true });
            await lecturerService.delete(email);
            toast.success("Xóa giảng viên thành công");
            
            set((state) => ({
                lecturerList: state.lecturerList.filter((l) => l.email !== email),
            }));
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi không xác định");
        } finally {
            set({ loading: false });
        }
    },

    // 6. Duyệt giảng viên (Dùng ID)
    approveLecturer: async (id: string) => {
        try {
            const response = await lecturerService.approve(id);
            toast.success("Đã phê duyệt giảng viên");
            
            // Cập nhật trạng thái ACTIVE cho giảng viên đó trong list
            set((state) => ({
                lecturerList: state.lecturerList.map((l) => 
                    l.id === id ? response.result : l
                ),
            }));
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi không xác định");
        }
    },

    // 7. Từ chối giảng viên (Dùng ID)
    rejectLecturer: async (id: string) => {
        try {
            const response = await lecturerService.reject(id);
            toast.warning("Đã từ chối giảng viên");
            
            set((state) => ({
                lecturerList: state.lecturerList.map((l) => 
                    l.id === id ? response.result : l
                ),
            }));
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi không xác định");
        }
    },

    // 8. Lấy danh sách giảng viên đang chờ duyệt
    fetchPendingLecturers: async () => {
        try {
            set({ loading: true });
            const response = await lecturerService.fetchPending();
            // Tùy vào yêu cầu, bạn có thể lưu vào 1 list riêng hoặc ghi đè lecturerList
            set({ 
                lecturerList: response.result,
                totalElements: response.result.length,
                totalPages: 1
            });
        } catch (error) {
            const err = error as AxiosError<{ code: number, message: string }>;
            toast.error(err.response?.data?.message || "Lỗi không xác định");
        } finally {
            set({ loading: false });
        }
    }
}));