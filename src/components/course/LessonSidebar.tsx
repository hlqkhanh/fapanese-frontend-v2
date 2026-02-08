import React from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaLanguage, FaBookOpen } from "react-icons/fa";
import type { Lesson } from "@/types/lesson";

interface LessonSidebarProps {
  lesson: Lesson | null;
  activeContent: "vocab" | "grammar";
  onContentSwitch: (type: "vocab" | "grammar") => void;
}

const LessonSidebar = ({ lesson, activeContent, onContentSwitch }: LessonSidebarProps) => {
  const lessonTitle = lesson
    ? lesson.lessonTitle?.trim().startsWith("Bài")
      ? lesson.lessonTitle
      : `Bài ${lesson.id} - ${lesson.lessonTitle}`
    : "Đang tải...";

  const parts = [
    {
      type: "Từ vựng",
      key: "vocab" as const,
      icon: <FaLanguage />,
    },
    {
      type: "Ngữ pháp",
      key: "grammar" as const,
      icon: <FaBookOpen />,
    },
  ];

  return (
    <div className="lg:w-1/4 mt-8 lg:mt-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 space-y-6 border border-gray-100 h-fit sticky top-20 transition-all duration-500 z-30">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          <FiSearch />
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm bài học..."
          className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#80DEEA] focus:border-[#00BCD4] bg-white/60 placeholder-gray-400 text-gray-700 transition-all duration-300 shadow-sm"
        />
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 tracking-wide">
          {lessonTitle}
        </h3>

        {parts.map((part, idx) => (
          <Link
            key={idx}
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onContentSwitch(part.key);
            }}
            className={`flex items-center gap-4 p-4 rounded-2xl border border-transparent transition-all duration-300 group ${
              activeContent === part.key
                ? "bg-gradient-to-r from-[#E0F7FA] to-[#B2EBF2] shadow-lg border-[#B2EBF2]"
                : "hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            <div
              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-transform duration-300 ${
                activeContent === part.key
                  ? "bg-white shadow-sm scale-105"
                  : "bg-gray-100"
              }`}
            >
              {React.cloneElement(part.icon, {
                className: `text-xl transition-colors duration-300 ${
                  activeContent === part.key
                    ? "text-[#00ACC1]"
                    : "text-gray-500 group-hover:text-[#00BCD4]"
                }`,
              })}
            </div>

            <div className="flex-1">
              <p
                className={`text-[15px] font-medium tracking-wide transition-colors duration-300 ${
                  activeContent === part.key
                    ? "text-[#0097A7]"
                    : "text-gray-800 group-hover:text-[#00BCD4]"
                }`}
              >
                {part.type}
              </p>
              <p className="text-xs text-gray-500 group-hover:text-[#00ACC1] mt-1 cursor-pointer hover:underline">
                Tài liệu
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LessonSidebar;
