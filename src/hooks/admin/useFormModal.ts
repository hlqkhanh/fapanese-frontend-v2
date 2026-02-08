import { useState, useCallback } from "react";

interface UseFormModalOptions<T> {
  initialData: T;
  onSubmit: (data: T, isEdit: boolean, identifier?: string) => Promise<void>;
  onSuccess?: () => void;
}

/**
 * Custom hook for managing form modal state (create/edit)
 * Handles open/close, form data, edit mode, and submission
 */
export function useFormModal<T>({
  initialData,
  onSubmit,
  onSuccess,
}: UseFormModalOptions<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<T>(initialData);
  const [identifier, setIdentifier] = useState<string | undefined>();

  // Open modal in create mode
  const openCreate = useCallback(() => {
    setFormData(initialData);
    setIsEdit(false);
    setIdentifier(undefined);
    setIsOpen(true);
  }, [initialData]);

  // Open modal in edit mode
  const openEdit = useCallback((data: T, id?: string) => {
    setFormData(data);
    setIsEdit(true);
    setIdentifier(id);
    setIsOpen(true);
  }, []);

  // Close modal and reset
  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setFormData(initialData);
      setIsEdit(false);
      setIdentifier(undefined);
    }, 200); // Delay reset to allow modal close animation
  }, [initialData]);

  // Update form field
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update multiple fields
  const updateFields = useCallback((fields: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      await onSubmit(formData, isEdit, identifier);
      onSuccess?.();
      close();
    },
    [formData, isEdit, identifier, onSubmit, onSuccess, close]
  );

  return {
    isOpen,
    isEdit,
    formData,
    setFormData,
    openCreate,
    openEdit,
    close,
    updateField,
    updateFields,
    handleSubmit,
  };
}
