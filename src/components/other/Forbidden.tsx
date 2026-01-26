import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import placeholder403 from "@/assets/forbidden.jpg"; // Đổi tên biến cho hợp lý nếu muốn
import { LogIn, MoveLeft } from "lucide-react";

interface Error404Props extends React.ComponentProps<"div"> {
  title?: string;
  message?: string;
}

export function Forbidden({ className, title, message, ...props }: Error404Props) {
  const navigate = useNavigate();

  return (
    <div
      className={cn("flex flex-col gap-4 items-center justify-center min-h-screen p-4", className)} // Thêm căn giữa màn hình cho đẹp
      {...props}
    >
      <Card className="overflow-hidden p-0 border-border w-full max-w-4xl shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[500px]">
          <div className="p-6 md:p-8 flex flex-col justify-center h-full">
            <div className="flex flex-col gap-4">
              {/* HEADER - LOGO 403 */}
              {/* THAY ĐỔI 1: Gradient màu đỏ (red-600) */}
              <h1 className="text-9xl text-center font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-red-600/20 select-none">
                403
              </h1>

              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold tracking-tight text-foreground sm:text-4xl">
                  {title || "Access Forbidden"}
                </h2>
                <p className="text-muted-foreground text-md mt-5 max-w-md text-left mx-auto">
                  {message || "Xin lỗi, bạn không có quyền truy cập vào khu vực này. Vui lòng quay lại hoặc đăng nhập bằng tài khoản khác."}
                </p>
              </div>
            </div>

            {/* CÁC NÚT BẤM */}
            <div className="flex flex-col justify-center sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                className="gap-2 min-w-[140px] shadow-sm"
              >
                <MoveLeft className="w-4 h-4" />
                Quay lại
              </Button>

              {/* THAY ĐỔI 2: Button nền đỏ, shadow đỏ */}
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                className="gap-2 min-w-[140px] bg-red-500 hover:bg-red-700 text-white shadow-lg shadow-red-300/20 border-transparent"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </Button>
            </div>

            {/* FOOTER NHỎ */}
            <div className="mt-12 flex justify-center">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground">
                Code: 403_FORBIDDEN
              </span>
            </div>
          </div>

          {/* CỘT HÌNH ẢNH */}
          <div className="bg-muted relative hidden md:block h-full">
            <img
              srcSet={placeholder403}
              alt="Forbidden"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}