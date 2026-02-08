import { Loader2, AlertTriangle } from "lucide-react";

interface LoadingTestProps {
  type: "loading" | "grading" | "error";
  error?: string;
  onRetry?: () => void;
}

/**
 * Component for loading and error states
 */
export function LoadingState({ type, error, onRetry }: LoadingTestProps) {
  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          <AlertTriangle size={64} />
        </div>
        <p className="text-lg text-gray-700 mb-4">
          {error || "Đã có lỗi xảy ra"}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (type === "grading") {
    return (
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={64} />
        <p className="text-lg mt-4 text-gray-700">
          Đang chấm bài... Vui lòng đợi trong giây lát.
        </p>
      </div>
    );
  }

  // Loading test
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={64} />
      <p className="text-lg mt-4 text-gray-700">Đang tải đề thi...</p>
    </div>
  );
}
