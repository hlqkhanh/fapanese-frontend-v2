import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";


const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? "http://localhost:8080/fapanese/api" : "https://fapanese-backend-1-0-1.onrender.com/fapanese/api",
  withCredentials: true,
});


//gắn access token vào req header (phải có requiresAuth: true, khi gửi req)
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();

  if (config.url?.includes("/auth/refresh")) {
    return config;
  }

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}
);


// tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // những api không cần check
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/users/register") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 401 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      try {
        const res = await api.post("/auth/refresh", { withCredentials: true });
        const newAccessToken = res.data.result?.accessToken;

        console.log(newAccessToken);

        useAuthStore.getState().accessToken = newAccessToken;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;