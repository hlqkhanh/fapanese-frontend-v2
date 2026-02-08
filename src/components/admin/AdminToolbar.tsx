import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, Loader2 } from "lucide-react";
import { type ReactNode } from "react";

interface AdminToolbarProps {
  onCreateClick: () => void;
  onExcelClick?: () => void;
  loading?: boolean;
  children?: ReactNode; // For filters
  createButtonText?: string;
  showExcelButton?: boolean;
}

/**
 * Reusable toolbar component for admin pages
 * Includes filters section and action buttons
 */
export function AdminToolbar({
  onCreateClick,
  onExcelClick,
  loading = false,
  children,
  createButtonText = "Thêm mới",
  showExcelButton = false,
}: AdminToolbarProps) {
  return (
    <div className="flex flex-col gap-4 shrink-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Filters section */}
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          {children}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {showExcelButton && onExcelClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExcelClick}
              disabled={loading}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
              Excel
            </Button>
          )}
          
          <Button size="sm" onClick={onCreateClick} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {createButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
