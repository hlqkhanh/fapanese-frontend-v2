import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  isEdit?: boolean;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
}

/**
 * Reusable form modal component for admin CRUD operations
 */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  isEdit = false,
  loading = false,
  submitText,
  cancelText = "Hủy",
}: FormModalProps) {
  const defaultSubmitText = isEdit ? "Lưu" : "Tạo mới";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {children}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button type="submit" disabled={loading}>
              {submitText || defaultSubmitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
