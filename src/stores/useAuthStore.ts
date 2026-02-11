import { create } from "zustand";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { persist } from "zustand/middleware"

export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        accessToken: null,
        loginUser: null,
        loading: false,

        clearState: () => {
            set({ accessToken: null, loginUser: null, loading: false });
            localStorage.clear();
        },


        signUp: async (email, password, firstName, lastName, role, expertise, bio, dateOfBirth, campus) => {
            try {
                set({ loading: true });

                localStorage.clear();

                //  gọi api
                const response = await authService.signUp(email, password, firstName, lastName, role, expertise, bio, dateOfBirth, campus);

                return Promise.resolve(response);
            } catch (error) {
                console.error(error)
                return Promise.reject(error);
            } finally {

                set({ loading: false });
            }
        },

        login: async (email, password) => {
            try {
                set({ loading: true });
                localStorage.clear();

                const response = await authService.login(email, password);

                const accessToken = response.result?.accessToken;
                set({ accessToken })

                await get().fetchMe();

                return Promise.resolve(response);
            } catch (error) {
                console.error(error)
                return Promise.reject(error)
            } finally {
                set({ loading: false });
            }
        },

        sendOTP: async (email) => {
            try {
                set({ loading: true });
                const response = await authService.sendOTP(email);
                return Promise.resolve(response);
            } catch (error) {
                console.error(error)
                return Promise.reject(error)
            } finally {
                set({ loading: false });
            }
        },

        loginGoogle: async (token) => {
            try {
                set({ loading: true });
                // Clean storage cũ để tránh conflict
                localStorage.clear(); 

                // 1. Gọi Service
                const response = await authService.loginGoogle(token);

                // 2. Lấy AccessToken từ response (Backend trả về ApiResponse.result.accessToken)
                const accessToken = response.result?.accessToken;
                
                // 3. Lưu token vào store
                set({ accessToken });

                // 4. Gọi fetchMe để lấy thông tin user (Role, Name, Avatar...)
                await get().fetchMe();

                return Promise.resolve(response);
            } catch (error) {
                console.error("Google Login Error:", error);
                return Promise.reject(error);
            } finally {
                set({ loading: false });
            }
        },


        verifyOTP: async (email, otp) => {
            try {
                set({ loading: true });
                const response = await authService.verifyOTP(email, otp);
                return Promise.resolve(response);
            } catch (error) {
                console.error(error)
                return Promise.reject(error)
            } finally {
                set({ loading: false });
            }
        },

        fetchMe: async () => {
            try {
                set({ loading: true });
                const loginUser = await authService.fetchMe();

                set({ loginUser })


                return Promise.resolve(loginUser);
            } catch (error) {
                console.error(error)
                set({ loginUser: null, accessToken: null })
                return Promise.reject(error)
            } finally {
                set({ loading: false });
            }
        },

        refresh: async () => {
            try {
                set({ loading: true });
                const { loginUser, fetchMe } = get();
                const accessToken = await authService.refresh();
                set({ accessToken });

                if (!loginUser) {
                    await fetchMe();
                }

                return accessToken;
            } catch (error) {
                console.error(error)
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại")

                get().clearState();
                return Promise.reject(error);
            } finally {
                set({ loading: false })
            }
        },

        logout: async () => {
            try {
                get().clearState();
                await authService.logout();
                toast.success("Đăng xuất thành công");
            } catch (error) {
                console.error(error);
                toast.error("Lỗi xảy ra khi đăng xuất. Hãy thử lại")
            }
        },


        

    }), {
        name: "auth-storage",
        partialize: (state) => ({
            loginUser: state.loginUser,
            accessToken: state.accessToken,
        })
    })
);