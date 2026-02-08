import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentItems: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  itemLabel?: string; // e.g., "sinh viên", "khóa học"
}

/**
 * Reusable pagination footer component for tables
 */
export function PaginationFooter({
  currentPage,
  totalPages,
  totalItems,
  currentItems,
  onPageChange,
  loading = false,
  itemLabel = "items",
}: PaginationFooterProps) {
  return (
    <div className="flex items-center justify-between shrink-0 py-2 border-t mt-auto">
      <div className="text-sm text-muted-foreground">
        Hiển thị <strong>{currentItems}</strong> / <strong>{totalItems}</strong> {itemLabel}
      </div>
      
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium mr-4">
          Trang {currentPage + 1} / {totalPages || 1}
        </p>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
