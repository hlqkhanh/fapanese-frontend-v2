import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

// Định nghĩa props cho component
interface ProtectedRouteProps {
  allowedRoles?: string[]; // Mảng các role được phép, ví dụ: ["ADMIN", "LECTURER"]
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { accessToken, loginUser, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const location = useLocation(); // Lấy vị trí hiện tại để redirect lại sau khi login nếu cần

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // 1. Nếu chưa có token thì thử refresh
      if (!accessToken) {
        await refresh();
      }

      // 2. Nếu có token (sau khi refresh hoặc có sẵn) mà chưa có info user -> Fetch profile
      // Lưu ý: Lấy state mới nhất từ store sau khi refresh
      const currentToken = useAuthStore.getState().accessToken;
      if (currentToken && !useAuthStore.getState().loginUser) {
        await fetchMe();
      }

      if (mounted) {
        setStarting(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []); // Dependency rỗng để chỉ chạy 1 lần khi mount (logic refresh đã xử lý trong store)

  // 1. Màn hình Loading
  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <OrbitProgress dense color="#3b82f6" size="medium" text="" textColor="" />
      </div>
    );
  }

  // 2. Check Đăng nhập: Nếu không có token -> Đá về Login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check Phân quyền (Authorization)
  // Nếu có truyền allowedRoles VÀ user hiện tại không nằm trong list đó
  if (allowedRoles.length > 0 && loginUser) {
    if (!allowedRoles.includes(loginUser.roleName)) {
      toast.error("Bạn không có quyền truy cập trang này!");
      
      return <Navigate to="/forbidden" replace />;
    }
  }

  // 4. Nếu thỏa mãn tất cả -> Render nội dung
  return <Outlet />;
};

export default ProtectedRoute;