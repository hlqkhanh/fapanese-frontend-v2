import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, XCircle } from "lucide-react";
import type { ExamQuestion } from "@/types/overview";

interface AIExplanationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: ExamQuestion | null;
  userAnswer?: string;
  explanation: string;
  loading: boolean;
}

/**
 * Format AI explanation with bold text support
 */
const formatAIText = (text: string | undefined): React.ReactNode => {
  if (!text) return null;

  const paragraphs = text.split(/\n+/g);

  return paragraphs.map((line, lineIndex) => {
    if (line.trim() === "") return null;

    const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);

    const lineContent = parts.map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={`bold-${lineIndex}-${partIndex}`}
            className="font-bold text-[#0092B8]"
          >
            {part.substring(2, part.length - 2)}
          </strong>
        );
      }
      return <React.Fragment key={`text-${lineIndex}-${partIndex}`}>{part}</React.Fragment>;
    });

    return (
      <p key={`line-${lineIndex}`} className="mb-3 last:mb-0">
        {lineContent}
      </p>
    );
  });
};

/**
 * Modal showing AI explanation for exam questions
 */
export function AIExplanationModal({
  open,
  onOpenChange,
  question,
  userAnswer,
  explanation,
  loading,
}: AIExplanationModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.468 3.11a.75.75 0 0 0 .565 1.245h5.499l-1.83 4.401c-.321.772.773 1.415 1.245.565l7.103-9.192a.75.75 0 0 0-.565-1.245H9.16l1.708-4.107Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Giải thích từ AI</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div
              className="p-6 overflow-y-auto flex-grow"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              {/* Question Section */}
              {question && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <p className="font-bold text-gray-900 mb-4 text-lg">
                    {formatAIText(question.content)}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 text-base text-gray-700 ml-4">
                    {["A", "B", "C", "D"].map((opt) => {
                      const value = (question as any)[`option${opt}`];
                      if (!value) return null;

                      const isUserSelected = userAnswer === value;
                      const isCorrectAnswer = question.correctAnswer === value;

                      const labelBg = isCorrectAnswer
                        ? "bg-green-100/70"
                        : isUserSelected
                        ? "bg-red-100/70"
                        : "bg-white/50";

                      const labelWeight =
                        isUserSelected || isCorrectAnswer ? "font-semibold" : "font-normal";

                      return (
                        <div
                          key={opt}
                          className={`flex items-start gap-2 p-3 rounded-lg ${labelBg} ${labelWeight}`}
                        >
                          <span className="mt-0.5">
                            {isCorrectAnswer ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : isUserSelected ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : (
                              <div className="w-5 h-5" />
                            )}
                          </span>
                          <span className="flex-1">
                            <span className="font-bold mr-1">{opt}.</span>
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Explanation Section */}
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-gray-600">
                  <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-lg font-semibold">AI đang phân tích câu hỏi...</p>
                  <p className="text-sm">Vui lòng đợi trong giây lát.</p>
                </div>
              ) : (
                explanation && (
                  <div className="border-t border-gray-300 pt-5 mt-5">
                    <div className="text-gray-800 leading-relaxed prose prose-base max-w-none">
                      {formatAIText(explanation)}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => onOpenChange(false)}
                className="px-8 py-2.5 bg-gradient-primary text-white rounded-full font-semibold shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Đã hiểu
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
