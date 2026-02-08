import { Link } from "react-router-dom";
import type { OverviewPartType, SpeakingGroup, Exam } from "@/types/overview";

interface ContentListGridProps {
  groups: (SpeakingGroup | Exam)[];
  partType: OverviewPartType | null;
  onSelectGroup: (groupId: number) => void;
  courseCode: string;
  overviewId: number;
  partId: number;
}

/**
 * Grid of cards for exercises/exams
 */
export function ContentListGrid({
  groups,
  partType,
  onSelectGroup,
  courseCode,
  overviewId,
  partId,
}: ContentListGridProps) {
  const isSpeaking = partType === "SPEAKING";
  const cardBg = isSpeaking ? "bg-cyan-50" : "bg-indigo-50";
  const titleColor = isSpeaking ? "text-cyan-800" : "text-indigo-800";
  const statTextColor = isSpeaking ? "text-cyan-600" : "text-indigo-600";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Speaking Mock Test Card */}
      {isSpeaking && (
        <Link
          to={`/speaking-test/${courseCode}/${overviewId}/${partId}`}
          className="p-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl flex flex-col justify-between min-h-[160px] transform hover:scale-[1.02] text-white md:col-span-2 lg:col-span-3"
          style={{
            backgroundImage: "linear-gradient(to bottom right, #019ba5ff, #94f3eeff)",
          }}
        >
          <div>
            <h3 className="text-xl font-bold mb-3 line-clamp-2">
              Thi mô phỏng JPD113
            </h3>
            <p className="text-cyan-50 text-base line-clamp-2">
              Bắt đầu bài thi ngẫu nhiên theo đúng thể lệ (Đọc, Tự do, Tranh).
            </p>
          </div>
          <div className="mt-4 text-right">
            <div className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-cyan-700 px-3 py-1.5 rounded-full shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658Z"
                  clipRule="evenodd"
                />
              </svg>
              Bắt đầu thi
            </div>
          </div>
        </Link>
      )}

      {/* Content Group Cards */}
      {groups.map((item) => {
        const title = "title" in item ? item.title : "examTitle" in item ? item.examTitle : "";
        const description = 
          "description" in item
            ? item.description || `Các bài tập dạng ${(item as SpeakingGroup).type}`
            : `${(item as Exam).semester || ""} ${(item as Exam).year || ""}`;

        const count =
          "speakings" in item
            ? `${item.speakings.length} Bài tập`
            : "questions" in item
            ? `${item.questions.length} Câu hỏi`
            : "";

        return (
          <div
            key={item.id}
            className={`p-6 ${cardBg} rounded-2xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:bg-opacity-80 flex flex-col justify-between min-h-[160px] transform hover:scale-[1.02]`}
            onClick={() => onSelectGroup(item.id)}
          >
            <div>
              <h3 className={`text-xl font-bold ${titleColor} mb-3 line-clamp-2`}>
                {title}
              </h3>
              <p className="text-gray-600 text-base line-clamp-2">{description}</p>
            </div>
            <div className="mt-4 text-right">
              <span
                className={`text-sm font-semibold ${statTextColor} bg-white px-3 py-1.5 rounded-full shadow-sm`}
              >
                {count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
