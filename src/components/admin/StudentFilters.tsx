import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { UserStatus } from "@/types/userStatus";

interface StudentFiltersProps {
  keyword: string;
  campus: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCampusChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

/**
 * Search and filter controls for student management
 */
export function StudentFilters({
  keyword,
  campus,
  status,
  onSearchChange,
  onCampusChange,
  onStatusChange,
}: StudentFiltersProps) {
  return (
    <>
      {/* Search */}
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm tên, email..."
          className="pl-8 bg-white"
          value={keyword}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Campus */}
      <Select value={campus} onValueChange={onCampusChange}>
        <SelectTrigger className="w-full md:w-[150px] bg-white">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <SelectValue placeholder="Cơ sở" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả cơ sở</SelectItem>
          <SelectItem value="Quy Nhơn">Quy Nhơn</SelectItem>
          <SelectItem value="Hà Nội">Hà Nội</SelectItem>
          <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
          <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
          <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
        </SelectContent>
      </Select>

      {/* Filter Status */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[150px] bg-white">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value={UserStatus.UNVERIFIED_EMAIL.toString()}>
            Chưa xác thực
          </SelectItem>
          <SelectItem value={UserStatus.ACTIVE.toString()}>Hoạt động</SelectItem>
          <SelectItem value={UserStatus.PENDING_APPROVAL.toString()}>
            Chờ duyệt
          </SelectItem>
          <SelectItem value={UserStatus.REJECTED.toString()}>
            Vô hiệu hóa
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
