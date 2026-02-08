import { PassageViewer } from "./PassageViewer";
import { QuestionViewer } from "./QuestionViewer";
import type { SpeakingGroup } from "@/types/overview";
import { BookOpen } from "lucide-react";

interface SpeakingGroupCardProps {
  group: SpeakingGroup;
}

/**
 * Display a speaking exercise group with all its content
 */
export function SpeakingGroupCard({ group }: SpeakingGroupCardProps) {
  return (
    <div className="p-6 sm:p-10 bg-white rounded-2xl shadow-xl transition-all duration-300 transform hover:shadow-2xl">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 pb-4 border-b-2 border-cyan-100">
        {group.title}
      </h2>

      {group.description && (
        <p className="text-gray-700 mb-10 text-lg italic border-l-4 border-cyan-300 pl-4 py-2 bg-cyan-50 rounded-lg">
          {group.description}
        </p>
      )}

      <div className="space-y-12">
        {group.speakings.map((item, index) => (
          <div
            key={item.id}
            className="p-6 rounded-xl bg-gray-50 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-cyan-200"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Bài tập {index + 1}: {item.topic || "Nội dung luyện tập"}
            </h3>

            {/* Passage or Picture */}
            {(item.speakingType === "PASSAGE" && item.passage) ||
            (item.speakingType === "PICTURE" && item.imgUrl) ? (
              <div className="my-6">
                {item.speakingType === "PASSAGE" && item.passage && (
                  <PassageViewer
                    passage={item.passage}
                    romaji={item.passageRomaji}
                    meaning={item.passageMeaning}
                  />
                )}

                {item.speakingType === "PICTURE" && item.imgUrl && (
                  <div className="flex justify-center my-6">
                    <img
                      src={item.imgUrl}
                      alt={item.topic}
                      className="max-w-2xl w-full rounded-lg shadow-xl border-4 border-gray-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {/* Questions */}
            {item.speakingQuestions && item.speakingQuestions.length > 0 && (
              <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
                <h4 className="font-semibold mb-4 text-gray-800 text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-cyan-600" />
                  Các câu hỏi:
                </h4>
                <div className="space-y-5">
                  {item.speakingQuestions.map((q) => (
                    <QuestionViewer
                      key={q.id}
                      question={q.question}
                      romaji={q.questionRomaji}
                      meaning={q.questionMeaning}
                      answer={q.answer}
                      answerRomaji={q.answerRomaji}
                      answerMeaning={q.answerMeaning}
                      isSuggestion={item.speakingType === "QUESTION"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-base text-gray-600 mt-8 italic bg-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-inner">
                <span className="font-semibold">Gợi ý: </span>
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
