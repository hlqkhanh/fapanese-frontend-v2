import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { FieldSeparator } from "../ui/field";
import { useState } from "react";
import ForgotPasswordPopup from "./forgotPasswordPopup";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { OrbitProgress } from "react-loading-indicators";
import { useModal } from "../GlobalModal/ModalContext";
import placeholderLogin from '@/assets/placeholderLogin.jpg'
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login, sendOTP, loginUser, loginGoogle } = useAuthStore();
  const { login, sendOTP } = useAuthStore();
  const navigate = useNavigate();
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const notiModal = useModal();

  const { register, handleSubmit, formState: { isSubmitting }, } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });


  const handleSendOTP = async (email: string) => {
    try {
      await sendOTP(email)
      toast.success("Đã gửi email đến địa chỉ: " + email)
      localStorage.setItem("otp_email", email);
      navigate("/verify-otp")
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      notiModal.error("Gửi OTP thất bại", error.response?.data?.message + ". Vui lòng thử lại")
    }
  }

  const onSubmit = async (data: SignInFormValues) => {
    const { email, password } = data;

    try {
      await login(email, password);

      toast.success("Đăng nhập thành công");

      if (loginUser?.role.includes('ADMIN'))
        navigate("/admin")
      else if (loginUser?.role.includes('STUDENT'))
      const updatedUser = useAuthStore.getState().loginUser;

      if (updatedUser?.role.includes('ADMIN'))
        navigate("/admin")
      else if (updatedUser?.role.includes('STUDENT'))
        navigate("/")

    } catch (error) {
      const err = error as AxiosError<{ code: number, message: string }>;

      if (err.response?.data?.code === 1003) {
        notiModal.confirm(err.response.data?.message, "Vui lòng tiếp tục để thực hiện xác thực OTP", () => handleSendOTP(email))
      } else {
        toast.error(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại sau")
      }


    }

  };

  const handleNavigate = () => {
    // Lấy state mới nhất trực tiếp từ store để tránh delay update của React state
    const currentUser = useAuthStore.getState().loginUser;
    
    if (currentUser?.role.includes('ADMIN')) navigate("/admin");
    else if (currentUser?.role.includes('STUDENT')) navigate("/");
    else navigate("/"); // Mặc định
  };

  // --- XỬ LÝ LOGIN GOOGLE ---
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        // credential chính là ID Token mà backend cần verify
        await loginGoogle(credentialResponse.credential);
        toast.success("Đăng nhập Google thành công");
        handleNavigate();
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Lỗi xác thực Google với Server");
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-1">
                <h1 className="text-2xl font-bold">Đăng nhập tài khoản</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng nhập để bắt đầu!
                </p>
              </div>


              {/* email */}
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="email"
                  className="block text-sm"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="abc@gmail.com"
                  {...register("email")}
                />
              </div>

              {/* password */}
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="password"
                  className="flex items-center justify-between text-sm"
                >
                  Mật khẩu

                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                    className="text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Quên mật khẩu?
                  </button>
                </Label>

                <Input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
              </div>




              {/* nút đăng ký */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <div style={{ transform: 'scale(0.4)', display: 'inline-block' }}><OrbitProgress color="#ffffff" size="small" dense /></div>}
                {!isSubmitting && "Đăng nhập"}
              </Button>

              <FieldSeparator className="mt-6 mb-0">Hoặc tiếp tục với</FieldSeparator>

              <div className="w-full flex justify-center mt-2">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Đăng nhập Google thất bại (Client Error)")}
                  useOneTap={true} // Hiện popup góc phải
                  theme="outline"  // Có thể đổi thành "filled_blue" hoặc "filled_black"
                  size="large"
                  width="100%"     // Cố gắng full width container
                  text="signin_with"
                  shape="rectangular"
                />
              </div>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a
                  href="/signup"
                  className="underline underline-offset-4"
                >
                  Đăng ký
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              srcSet={placeholderLogin}
              alt="Image"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <ForgotPasswordPopup
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </div>
  );
}
