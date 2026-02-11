import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { Exam, ExamQuestion, DetailedResult } from "@/types/overview";
import { ExamResultBanner } from "./ExamResultBanner";

interface ExamViewProps {
  exam: Exam;
  userAnswers: Record<number, string>;
  onAnswerSelect: (questionId: number, answer: string, index: number) => void;
  onSubmit: () => void;
  submitResult: {
    scorePercentage: number;
    correctCount: number;
    totalQuestions: number;
    detailedResults: DetailedResult[];
  } | null;
  isSubmitted: boolean;
  onExplainAI?: (question: ExamQuestion) => void;
}

/**
 * Format content with line breaks
 */
const formatContent = (text: string | undefined): React.ReactNode => {
  if (!text) return null;
  return text.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));
};

/**
 * Display exam with multiple choice questions
 */
export function ExamView({
  exam,
  userAnswers,
  onAnswerSelect,
  onSubmit,
  submitResult,
  isSubmitted,
  onExplainAI,
}: ExamViewProps) {
  return (
    <div className="p-6 sm:p-10 bg-white rounded-2xl shadow-xl transition-all duration-300 transform hover:shadow-2xl">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 pb-4 border-b-2 border-indigo-100">
        {exam.examTitle}
      </h2>

      {/* Result Banner */}
      {isSubmitted && submitResult && (
        <ExamResultBanner
          scorePercentage={submitResult.scorePercentage}
          correctCount={submitResult.correctCount}
          totalQuestions={submitResult.totalQuestions}
        />
      )}

      {/* Questions */}
      <div className="space-y-10">
        {exam.questions.map((q, index) => {
          const selected = userAnswers[q.id];
          const result = submitResult?.detailedResults?.find(
            (r) => r.questionId === q.id
          );

          const isCorrect = result && result.correctAnswer === selected;
          const isWrong = isSubmitted && selected && !isCorrect;

          const containerClass = isSubmitted
            ? isCorrect
              ? "bg-green-50 border-green-300 shadow-sm"
              : isWrong
              ? "bg-red-50 border-red-300 shadow-sm"
              : "bg-white border-gray-200 shadow-sm"
            : "bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow";

          return (
            <div
              key={q.id}
              id={`question-${index}`}
              className={`p-6 rounded-xl border ${containerClass}`}
            >
              {/* Question Content */}
              <p className="font-bold text-gray-900 mb-4 text-xl flex items-start">
                <span className="text-cyan-600 mr-3 mt-1">{index + 1}.</span>
                <span className="flex-1">{formatContent(q.content)}</span>
              </p>

              {/* AI Explanation Button */}
              {isSubmitted && onExplainAI && (
                <div className="mb-4 -mt-2 ml-10">
                  <button
                    onClick={() => onExplainAI(q)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full shadow-sm hover:bg-blue-200 transition-all text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Giải thích bằng AI
                  </button>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3 text-lg text-gray-700 ml-8">
                {["A", "B", "C", "D"].map((opt) => {
                  const value = (q as any)[`option${opt}`];
                  if (!value) return null;

                  const isUserSelected = selected === value;
                  const isCorrectAnswer = result && result.correctAnswer === value;

                  const labelBg = isSubmitted
                    ? isCorrectAnswer
                      ? "bg-green-100/70"
                      : isUserSelected
                      ? "bg-red-100/70"
                      : "bg-white"
                    : isUserSelected
                    ? "bg-cyan-50"
                    : "hover:bg-gray-100";

                  const labelColor = isUserSelected
                    ? "text-gray-900 font-semibold"
                    : "text-gray-700";

                  return (
                    <label
                      key={opt}
                      className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200 border border-transparent ${labelBg} ${labelColor}`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={value}
                        checked={isUserSelected}
                        disabled={isSubmitted}
                        onChange={() => onAnswerSelect(q.id, value, index)}
                        className={`w-5 h-5 text-cyan-600 border-gray-300 focus:ring-cyan-500 rounded-full ${
                          isSubmitted ? "opacity-60" : ""
                        }`}
                      />
                      <span className="flex-1">
                        <span className="font-bold mr-1">{opt}.</span>
                        {formatContent(value)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit/Retry Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
        {!isSubmitted ? (
          <Button
            onClick={onSubmit}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-primary text-white rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-95"
          >
            Nộp bài và xem kết quả
          </Button>
        ) : (
          <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-primary text-white rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-95"
          >
            Làm lại
          </Button>
        )}
      </div>
    </div>
  );
}
