import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const location = useLocation();
  const pathname = location.pathname;

  const getPageTitle = (path: string) => {
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/students")) return "Quản lý Sinh viên";
    if (path.includes("/admin/teachers")) return "Quản lý Giảng viên";
    if (path.includes("/admin/courses")) return "Quản lý Khóa học";
    
    // Thêm các trang khác ở đây
    if (path.includes("/profile")) return "Hồ sơ cá nhân";
    
    return "Admin Portal"; // Tiêu đề mặc định
  };

  const title = getPageTitle(pathname);

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[--header-height]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        
        {/* Hiển thị tiêu đề động */}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* Nút Github cũ của bạn (có thể xóa nếu không cần) */}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-foreground"
            >
              Đăng xuất
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}