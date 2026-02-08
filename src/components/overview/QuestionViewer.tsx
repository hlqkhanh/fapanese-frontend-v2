import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionViewerProps {
  question: string;
  romaji?: string;
  meaning?: string;
  answer?: string;
  answerRomaji?: string;
  answerMeaning?: string;
  isSuggestion?: boolean;
}

/**
 * Component to display a speaking question with optional answer suggestions
 */
export function QuestionViewer({
  question,
  romaji,
  meaning,
  answer,
  answerRomaji,
  answerMeaning,
  isSuggestion = false,
}: QuestionViewerProps) {
  const [showAnswer, setShowAnswer] = useState(!isSuggestion);

  return (
    <div className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Question */}
      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-900 mb-2">{question}</p>
        {romaji && (
          <p className="text-sm text-gray-600 italic mb-1">
            <span className="font-medium">Romaji: </span>
            {romaji}
          </p>
        )}
        {meaning && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">Nghĩa: </span>
            {meaning}
          </p>
        )}
      </div>

      {/* Answer (collapsible for suggestions) */}
      {answer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {isSuggestion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center gap-2 mb-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
            >
              {showAnswer ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Ẩn gợi ý trả lời
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Xem gợi ý trả lời
                </>
              )}
            </Button>
          )}

          {showAnswer && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
              <p className="text-base text-gray-900 font-medium mb-2">{answer}</p>
              {answerRomaji && (
                <p className="text-sm text-gray-600 italic mb-1">
                  <span className="font-medium">Romaji: </span>
                  {answerRomaji}
                </p>
              )}
              {answerMeaning && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Nghĩa: </span>
                  {answerMeaning}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
