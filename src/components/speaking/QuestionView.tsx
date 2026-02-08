import { Mic } from "lucide-react";

interface QuestionViewProps {
  questionNumber: 1 | 2;
}

/**
 * Component for displaying Part 3: Free response questions
 */
export function QuestionView({ questionNumber }: QuestionViewProps) {
  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Phần 3: Câu hỏi {questionNumber}
      </h2>
      <p className="text-xl text-gray-700 mb-6">
        Hãy lắng nghe câu hỏi và trả lời. (Câu hỏi sẽ tự động phát)
      </p>
      <div className="flex justify-center mb-4">
        <div className="text-gray-300">
          <Mic size={120} />
        </div>
      </div>
      <p className="text-lg text-gray-500">
        Chuẩn bị trả lời...
      </p>
    </div>
  );
}
