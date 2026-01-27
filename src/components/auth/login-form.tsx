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

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const {login, sendOTP, loginUser} = useAuthStore();  
  const navigate = useNavigate();
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const notiModal = useModal();

  const { register, handleSubmit, formState: { isSubmitting }, } = useForm<SignInFormValues>({ 
    resolver: zodResolver(signInSchema), 
  });


  const handleSendOTP = async(email: string) => {
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
    const {email, password} = data;
    
    try {
      await login(email, password);

      toast.success("Đăng nhập thành công");
      
      if(loginUser?.role.includes('ADMIN'))
        navigate("/admin")
      else if(loginUser?.role.includes('STUDENT'))
        navigate("/")

    } catch (error) {
      const err = error as AxiosError<{code: number, message: string }>;

      if(err.response?.data?.code === 1003){
        notiModal.confirm(err.response.data?.message, "Vui lòng tiếp tục để thực hiện xác thực OTP", () => handleSendOTP(email))
      }else{
        toast.error(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại sau")
      }

      
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
                {isSubmitting && <div style={{ transform: 'scale(0.4)', display: 'inline-block' }}><OrbitProgress color="#ffffff" size="small" dense/></div>}
                {!isSubmitting && "Đăng nhập"}
              </Button>

              <FieldSeparator className="mt-6 mb-0">Hoặc tiếp tục với</FieldSeparator>

              <Button variant="outline" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Đăng nhập với Google
              </Button>

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
