interface ProgressBarProps {
  progress: number;
  label?: string;
}

/**
 * Progress bar component for showing upload/processing progress
 */
export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <p className="text-sm text-gray-600 mb-1 text-center">{label}</p>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1 text-right">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
