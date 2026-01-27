import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModal } from "../GlobalModal/ModalContext";
import { AxiosError } from "axios";
import { OrbitProgress } from "react-loading-indicators"
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import placeholderSignup from '@/assets/placeholderSignup.jpg'

const baseSchema = z.object({
  firstName: z.string().min(1, " bắt buộc"),
  lastName: z.string().min(1, " bắt buộc"),
  email: z.email(" không hợp lệ"),
  password: z.string().min(8, " phải có ít nhất 8 ký tự"),
  dateOfBirth: z.string().optional().refine((value) => {
    if (!value) return true;
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  }, " không hợp lệ"),
});

const studentSchema = baseSchema.extend({
  role: z.literal("student"),
  campus: z.string().optional(),
});

const lecturerSchema = baseSchema.extend({
  role: z.literal("lecturer"),
  expertise: z.string().optional(),
  bio: z.string().optional(),
});

const signUpSchema = z.discriminatedUnion("role", [
  studentSchema,
  lecturerSchema,
]);

type DefaultValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  role: "student" | "lecturer";
  campus?: string;
  expertise?: string;
  bio?: string;
};

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const notiModal = useModal();
  const { signUp, sendOTP } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting }, } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      role: "student",
      campus: "",
      expertise: "",
      bio: ""
    } as DefaultValues
  });

  const currentRole = useWatch({ control, name: "role", });
  const password = useWatch({ control, name: "password", });

  const [matchPassword, setMatchPassword] = useState<undefined | boolean>(undefined);
  const [clickSubmit, setClickSubmit] = useState<boolean>(false);

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) setMatchPassword(undefined)
    else setMatchPassword(value === password)
  }

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

  const onSubmit = async (data: SignUpFormValues) => {
    setClickSubmit(true);
    if (matchPassword === undefined || matchPassword === false)
      return;

    const payload = data as DefaultValues;
    console.log("Submitting:", payload);

    try {
      await signUp(
        payload.email,
        payload.password,
        payload.firstName,
        payload.lastName,
        payload.role,
        payload.expertise || "",
        payload.bio || "",
        payload.dateOfBirth || "",
        payload.campus || ""
      );
      notiModal.confirm("Đăng kí thành công", "Vui lòng xác thực OTP", () => handleSendOTP(payload.email));

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      notiModal.error("Đăng nhập thất bại", "" + error.response?.data?.message)
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 max-w-4xl mx-auto w-full", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border shadow-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          <form
            className="p-4 md:p-6 flex flex-col justify-center" // Giảm padding form
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Giảm gap tổng thể từ 4 xuống 3 */}
            <div className="flex flex-col gap-3"> 
              
              {/* Header nhỏ hơn */}
              <div className="flex flex-col items-center text-center gap-1 mb-1">
                <h1 className="text-xl font-bold">Đăng ký tài khoản</h1>
              </div>

              {/* Tabs nhỏ gọn hơn (h-8) */}
              <Tabs
                value={currentRole}
                onValueChange={(val) => setValue("role", val as "student" | "lecturer")}
                className="w-full"
              >
                <TabsList className="w-full h-9"> 
                  <TabsTrigger value="student" className="flex-1 text-xs">Học sinh</TabsTrigger>
                  <TabsTrigger value="lecturer" className="flex-1 text-xs">Giảng viên</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Họ & Tên */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"> {/* Giảm space label */}
                  <Label htmlFor="lastName" className="block text-xs font-medium"> {/* text-xs cho label */}
                    Họ <span className="text-destructive">*</span>
                    {errors.lastName && <span className="text-destructive ml-1">{errors.lastName.message}</span>}
                  </Label>
                  {/* Input cao h-9 (36px) thay vì h-10 */}
                  <Input type="text" id="lastName" placeholder="Nguyễn" className="h-9 text-sm" {...register("lastName")} />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="block text-xs font-medium">
                    Tên <span className="text-destructive">*</span>
                    {errors.firstName && <span className="text-destructive ml-1">{errors.firstName.message}</span>}
                  </Label>
                  <Input type="text" id="firstName" placeholder="Văn A" className="h-9 text-sm" {...register("firstName")} />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1 space-y-1">
                <Label htmlFor="email" className="block text-xs font-medium">
                  Email <span className="text-destructive">*</span>
                  {errors.email && <span className="text-destructive ml-1">{errors.email.message}</span>}
                </Label>
                <Input type="email" id="email" placeholder="abc@gmail.com" autoComplete="email" className="h-9 text-sm" {...register("email")} />
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col gap-1 space-y-1">
                <Label htmlFor="password" className="block text-xs font-medium">
                  Mật khẩu <span className="text-destructive">*</span>
                  {errors.password && <span className="text-destructive ml-1">{errors.password.message}</span>}
                </Label>
                <Input type="password" id="password" autoComplete="new-password" className="h-9 text-sm" {...register("password")} />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1 space-y-1">
                <Label htmlFor="confirmPassword" className="flex items-center gap-1 text-xs font-medium">
                  Nhập lại mật khẩu <span className="text-destructive">*</span>
                  {clickSubmit && !matchPassword && <span className="text-destructive font-normal ml-1">không khớp</span>}
                </Label>
                <Input
                  className={cn("h-9 text-sm", matchPassword === undefined ? "" : matchPassword ? "border-success focus-visible:ring-success" : "border-danger focus-visible:ring-danger")}
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={handleConfirmPassword}
                />
              </div>

              {/* Ngày sinh & Campus/Expertise */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="dateOfBirth" className="block text-xs font-medium">
                    Ngày sinh {errors.dateOfBirth && <span className="text-destructive ml-1">{errors.dateOfBirth.message}</span>}
                  </Label>
                  <Input type="date" id="dateOfBirth" className="h-9 text-sm block" {...register("dateOfBirth")} />
                </div>

                {currentRole === "student" && (
                  <div className="space-y-1">
                    <Label htmlFor="campus" className="text-xs font-medium">Campus <span className="text-muted-foreground font-normal">(Tùy chọn)</span></Label>
                    <Select onValueChange={(val) => setValue("campus", val)}>
                      <SelectTrigger className="w-full h-9 text-sm">
                        <SelectValue placeholder="Chọn Campus" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quy Nhơn">Quy Nhơn</SelectItem>
                        <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                        <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                        <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {currentRole === "lecturer" && (
                  <div className="space-y-1">
                    <Label htmlFor="expertise" className="block text-xs font-medium">
                      Trình độ
                    </Label>
                    <Input type="text" id="expertise" placeholder="JLPT N3" className="h-9 text-sm" {...register("expertise")} />
                  </div>
                )}
              </div>

              {currentRole === "lecturer" && (
                <div className="flex flex-col gap-1 space-y-1">
                  <Textarea id="bio" placeholder="Giới thiệu ngắn..." className="min-h-[60px] text-sm" {...register("bio")} />
                </div>
              )}

              {/* Button Đăng ký */}
              <Button type="submit" className="w-full h-9 mt-2 text-sm" disabled={isSubmitting}>
                {isSubmitting && <div style={{ transform: 'scale(0.4)', display: 'inline-block' }}><OrbitProgress color="#ffffff" size="small" dense /></div>}
                {!isSubmitting && "Tạo tài khoản"}
              </Button>

              <div className="text-center text-xs mt-1">
                Đã có tài khoản?{" "}
                <Link to="/login" className="underline underline-offset-4 font-medium text-primary">
                  Đăng nhập
                </Link>
              </div>
            </div>
          </form>

          {/* Ảnh bên phải */}
          <div className="bg-muted relative hidden md:block h-full min-h-[500px]"> 
            <img
              srcSet={placeholderSignup}
              alt="Image"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}