import type { LoginUser } from "@/types/loginUser";
import type { User } from "@/types/user";


export const mapUserToLoginUser = (user: User): LoginUser => {
  // 1. Xác định xem user là Student hay Lecturer
  // Ưu tiên lấy thông tin từ Student trước (nếu có), nếu không thì lấy Teacher
  const profileInfo = user.student || user.teacher;

  if (!profileInfo) {
    // Trường hợp data lỗi, không có cả student lẫn teacher
    console.warn("User data is missing both student and teacher profiles", user);
  }

  // 2. Xử lý Role
  // LoginUser chỉ cần 1 string roleName, nhưng User có mảng roles[].
  // Thường ta sẽ lấy role đầu tiên hoặc role có quyền cao nhất.
  const roleName = user.roles?.[0]?.roleName || "UNKNOWN_ROLE";

  return {
    // --- Các trường chung ---
    id: user.id,
    email: user.email,
    status: user.status,
    role: roleName,

    // --- Thông tin cá nhân (Lấy từ profileInfo) ---
    // Sử dụng optional chaining (?.) và Nullish coalescing (??) để an toàn
    firstName: profileInfo?.firstName ?? "",
    lastName: profileInfo?.lastName ?? "",
    avtUrl: profileInfo?.avtUrl ?? null,
    dateOfBirth: profileInfo?.dateOfBirth ?? null,

    // --- Các trường riêng biệt ---
    
    // Nếu là student thì lấy campus, ngược lại là null
    campus: user.student?.campus ?? null,

    // Nếu là teacher thì lấy expertise & bio, ngược lại là null
    expertise: user.teacher?.expertise ?? null,
    bio: user.teacher?.bio ?? null,
  };
};