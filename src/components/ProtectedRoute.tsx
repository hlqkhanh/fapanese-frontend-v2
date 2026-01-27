import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  // Lấy trực tiếp state từ store để đảm bảo reactive
  const accessToken = useAuthStore((state) => state.accessToken);
  const loginUser = useAuthStore((state) => state.loginUser);
  const refresh = useAuthStore((state) => state.refresh);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Lấy state hiện tại (không qua hook để tránh closure stale)
        const currentToken = useAuthStore.getState().accessToken;

        // 1. Nếu chưa có token thì thử refresh
        if (!currentToken) {
          await refresh();
        }

        // 2. Kiểm tra lại sau khi refresh (hoặc có sẵn token)
        const updatedToken = useAuthStore.getState().accessToken;
        const currentUser = useAuthStore.getState().loginUser;

        // Nếu có token mà chưa có user info thì fetch
        if (updatedToken && !currentUser) {
          await fetchMe();
        }
      } catch (error) {
        // Bắt lỗi để không chặn luồng chạy (lỗi đã được xử lý trong store rồi)
        console.log("Auth check encountered an error, proceeding to render logic..." + error);
      } finally {
        // QUAN TRỌNG: Luôn tắt trạng thái starting dù thành công hay thất bại
        if (mounted) {
          setStarting(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 1. Màn hình Loading (chỉ hiện khi đang khởi tạo hoặc store đang load)
  if (starting) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <OrbitProgress dense color="#3b82f6" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (!accessToken || !loginUser || !allowedRoles.includes(loginUser.role)) {
    toast.error("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/forbidden" replace />;
  }


  // 4. Nếu thỏa mãn tất cả -> Render nội dung
  return <Outlet />;
};

export default ProtectedRoute;