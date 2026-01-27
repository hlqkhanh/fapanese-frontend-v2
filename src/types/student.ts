import type { UserStatus } from "./userStatus";

// 1. Định nghĩa đối tượng Student (Khớp với "result" trong API GET)
export interface Student {
  id: string;
  email: string;
  role: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  avtUrl: string;
  campus: string;
  expertise: string;
  bio: string;
  status: UserStatus; // <--- Dùng type vừa tạo
}

// 2. Dữ liệu gửi lên khi Tạo/Sửa (Request Body)
export interface StudentPayload {
  firstName: string;
  lastName: string;
  email: string; // Email thường là key chính trong API của bạn
  dateOfBirth: string;
  campus: string;
  status?: UserStatus;
}

// 3. Kết quả trả về khi upload excel
export interface UploadExcelResult {
  totalRowsProcessed: number;
  successCount: number;
  failureCount: number;
  errorMessages: string[];
}

// 4. Generic Wrapper cho Response (Tận dụng lại nếu đã có trong file common, nếu chưa thì khai báo)
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// 5. Các Type cụ thể dùng cho Service
export type StudentListResponse = ApiResponse<Student[]>;       // GET /api/students
export type StudentDetailResponse = ApiResponse<Student>;       // GET /{email}, POST, PUT
export type StudentDeleteResponse = ApiResponse<object>;        // DELETE
export type StudentUploadResponse = ApiResponse<UploadExcelResult>; // POST /upload-excel