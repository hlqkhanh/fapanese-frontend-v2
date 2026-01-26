import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home, MoveLeft } from "lucide-react";
import placeholder404 from "@/assets/placeholder404.jpg";

interface Error404Props extends React.ComponentProps<"div"> {
  title?: string;
  message?: string;
}

export function Error404({ className, title, message, ...props }: Error404Props) {
  const navigate = useNavigate();

  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div
            className="p-6 md:p-8"
          >
            <div className="flex flex-col gap-4">
              {/* header - logo */}
              <h1 className="text-9xl text-center font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/20 select-none">
                404
              </h1>


              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold tracking-tight text-foreground sm:text-4xl">
                  {title || "Page Not Found"}
                </h2>
                <p className="text-muted-foreground text-md mt-5  max-w-md text-left">
                  {message || "Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển đến một vũ trụ khác."}
                </p>
              </div>
            </div>
            {/* Các nút bấm */}
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

              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="gap-2 min-w-[140px] shadow-lg shadow-primary/20"
              >
                <Home className="w-4 h-4" />
                Trang chủ
              </Button>
            </div>

            {/* Footer nhỏ */}
            <div className="mt-12 flex justify-center">
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground">
                Code: 404_NOT_FOUND
              </span>
            </div>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              srcSet={placeholder404}
              alt="Image"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}