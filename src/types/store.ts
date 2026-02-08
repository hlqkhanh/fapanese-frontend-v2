import type { LoginUser } from "./loginUser";
import type { Course, CoursePayload } from "./course";
import type { Student, StudentPayload, StudentSearchParams } from "./student";
import type { Lecturer, LecturerPayload, LecturerSearchParams } from "./lecturer";

// Re-export for convenience
export type { StudentSearchParams, LecturerSearchParams };

export interface AuthState {
    accessToken: string | null;
    loginUser: LoginUser | null;
    loading: boolean;

    signUp: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        role: string,
        expertise: string,
        bio: string,
        dateOfBirth: string,
        campus: string
    ) => Promise<void>;
    login: (email: string, password: string,) => Promise<void>;
    sendOTP: (email: string,) => Promise<void>;
    verifyOTP: (email: string, otp: string,) => Promise<void>; 
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    clearState: () => void;
    logout: () => Promise<void>;
}

export interface AuthState {
    accessToken: string | null;
    loginUser: LoginUser | null;
    loading: boolean;

    signUp: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        role: string,
        expertise: string,
        bio: string,
        dateOfBirth: string,
        campus: string
    ) => Promise<void>;
    login: (email: string, password: string,) => Promise<void>;
    sendOTP: (email: string,) => Promise<void>;
    verifyOTP: (email: string, otp: string,) => Promise<void>; 
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    clearState: () => void;
    logout: () => Promise<void>;
}


export interface CourseState {
    courseList: Course[];
    selectedCourse: Course | null; // Dùng khi xem chi tiết hoặc sửa
    loading: boolean;

    // Actions
    fetchCourses: () => Promise<void>;
    fetchCourseById: (id: number) => Promise<void>;
    createCourse: (data: CoursePayload) => Promise<void>;
    updateCourse: (id: number, data: CoursePayload) => Promise<void>;
    deleteCourse: (id: number) => Promise<void>;
    
    // Helper để reset state nếu cần (ví dụ khi rời trang)
    reset: () => void;
}

export interface StudentState {
    studentList: Student[];
    selectedStudent: Student | null;
    loading: boolean;
    
    totalElements: number;
    totalPages: number;

    // Actions
    fetchStudents: (params?: StudentSearchParams) => Promise<void>;
    fetchStudentByEmail: (email: string) => Promise<void>;
    
    createStudent: (data: StudentPayload) => Promise<void>;
    updateStudent: (email: string, data: StudentPayload) => Promise<void>;
    deleteStudent: (email: string) => Promise<void>;
    
    uploadStudentExcel: (file: File) => Promise<void>;

    reset: () => void;
}

export interface LecturerState {
    lecturerList: Lecturer[];
    selectedLecturer: Lecturer | null;
    loading: boolean;
    
    totalElements: number;
    totalPages: number;

    // Actions chính
    fetchLecturers: (params?: LecturerSearchParams) => Promise<void>;
    fetchLecturerByEmail: (email: string) => Promise<void>;
    createLecturer: (data: LecturerPayload) => Promise<void>;
    updateLecturer: (email: string, data: LecturerPayload) => Promise<void>;
    deleteLecturer: (email: string) => Promise<void>;
    
    // Actions đặc thù cho Giảng viên (Duyệt/Từ chối)
    approveLecturer: (id: string) => Promise<void>;
    rejectLecturer: (id: string) => Promise<void>;
    fetchPendingLecturers: () => Promise<void>;

    reset: () => void;
}
