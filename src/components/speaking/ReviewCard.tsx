import { BookOpen, Image, HelpCircle } from "lucide-react";

interface ReviewCardProps {
  title: string;
  icon: "passage" | "picture" | "question";
  audioUrl: string;
  transcript: string;
  feedbackText?: string;
}

/**
 * Component for displaying review details for each part
 */
export function ReviewCard({
  title,
  icon,
  audioUrl,
  transcript,
  feedbackText,
}: ReviewCardProps) {
  const IconComponent = 
    icon === "passage" ? BookOpen :
    icon === "picture" ? Image :
    HelpCircle;

  return (
    <div className="p-4 bg-white rounded-lg shadow border mb-4">
      <h4 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
        <IconComponent className="mr-2" size={24} />
        {title}
      </h4>

      {/* Audio Player */}
      <h5 className="text-md font-semibold text-gray-700 mb-2">
        Ghi âm của bạn:
      </h5>
      {audioUrl ? (
        <audio controls className="w-full mb-3">
          <source src={audioUrl} type="audio/webm" />
          <source src={audioUrl} type="audio/ogg" />
          Trình duyệt không hỗ trợ phát audio.
        </audio>
      ) : (
        <p className="text-gray-500 italic mb-3">Không có ghi âm</p>
      )}

      {/* Transcript */}
      <h5 className="text-md font-semibold text-gray-700 mb-2">
        Nội dung gỡ băng (STT):
      </h5>
      <p className="text-gray-600 italic p-3 bg-gray-50 rounded mb-3 whitespace-pre-wrap">
        {transcript || "(Không gỡ băng được nội dung)"}
      </p>

      {/* AI Feedback */}
      <h5 className="text-md font-semibold text-blue-800 mb-2">
        Nhận xét của AI:
      </h5>
      <p className="text-gray-800 whitespace-pre-wrap">
        {feedbackText || "Không có nhận xét."}
      </p>
    </div>
  );
}
