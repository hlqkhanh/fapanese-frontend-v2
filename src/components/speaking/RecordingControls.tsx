import { Mic, StopCircle, ChevronRight, Play } from "lucide-react";
import type { RecordingStatus } from "@/types/speakingTest";

interface RecordingControlsProps {
  isRecording: boolean;
  status: RecordingStatus;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onNext: () => void;
  onReplayQuestion?: () => void;
  canProceed: boolean;
  showReplayButton?: boolean;
}

/**
 * Component for recording controls (mic, stop, next buttons)
 */
export function RecordingControls({
  isRecording,
  status,
  onStartRecording,
  onStopRecording,
  onNext,
  onReplayQuestion,
  canProceed,
  showReplayButton = false,
}: RecordingControlsProps) {
  const isBusy = status === "recording" || status === "transcribing" || status === "speaking";

  return (
    <div className="flex items-center justify-center space-x-6">
      {/* Replay Question Button */}
      {showReplayButton && onReplayQuestion && (
        <button
          onClick={onReplayQuestion}
          disabled={isBusy}
          className="p-4 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Phát lại câu hỏi"
        >
          <Play size={24} />
        </button>
      )}

      {/* Record / Stop Button */}
      {isRecording ? (
        <button
          onClick={onStopRecording}
          className="p-5 rounded-full bg-red-600 text-white shadow-lg animate-pulse hover:bg-red-700 transition-colors"
          title="Dừng ghi âm"
        >
          <StopCircle size={32} />
        </button>
      ) : (
        <button
          onClick={onStartRecording}
          disabled={isBusy}
          className="p-5 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          title="Bắt đầu ghi âm"
        >
          <Mic size={32} />
        </button>
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!canProceed || isBusy}
        className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Phần tiếp theo"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
