import { motion } from "framer-motion";
import type { Grammar } from "@/types/grammar";

interface GrammarContentProps {
  grammars: Grammar[];
  loading?: boolean;
  lessonPartId?: string;
}

const GrammarContent = ({ grammars, loading = false, lessonPartId }: GrammarContentProps) => {
  const PRIMARY_TEAL = "text-[#00ACC1]";
  const STRUCTURE_GREEN = "text-[#00796B]";
  const EXAMPLE_BG_LIGHT = "bg-[#E0F7FA]";
  const BORDER_TEAL = "border-[#00ACC1]";

  if (loading) {
    return (
      <p className="italic text-gray-600 text-center py-12 text-xl animate-pulse">
        <span className="inline-block mr-3">⏳</span> Đang tải ngữ pháp...
      </p>
    );
  }

  if (grammars.length === 0) {
    return (
      <p className="italic text-gray-500 text-center py-12 text-lg">
        Phần này không có nội dung ngữ pháp.
      </p>
    );
  }

  return (
    <div className="p-10 lg:p-14 space-y-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1
          className={`text-4xl lg:text-4xl font-extrabold text-gray-900 pb-3 mb-10 
                       border-b-4 ${BORDER_TEAL} tracking-tight`}
        >
          Ngữ pháp - Bài học {lessonPartId}
        </h1>

        <div className="space-y-10">
          {grammars.map((grammar, index) => (
            <motion.div
              key={grammar.id}
              className="bg-white rounded-3xl p-8 shadow-xl ring-1 ring-gray-100 
                         hover:shadow-2xl hover:ring-2 hover:ring-[#00ACC1]/50 
                         hover:translate-y-[-2px] transition-all duration-500 ease-out"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
            >
              <h2
                className={`text-3xl font-bold ${PRIMARY_TEAL} border-b border-gray-100 pb-3 mb-5`}
              >
                {grammar.title}
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed text-base">
                {grammar.explanation}
              </p>

              {grammar.details?.map((detail, idx) => (
                <div
                  key={idx}
                  className="border-t border-gray-200 pt-6 mt-6 space-y-4"
                >
                  <p className="font-semibold text-gray-800 flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 ${STRUCTURE_GREEN}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      ></path>
                    </svg>
                    Cấu trúc:{" "}
                    <span
                      className={`ml-3 ${STRUCTURE_GREEN} font-mono ${EXAMPLE_BG_LIGHT} px-3 py-1 rounded-lg text-1xl shadow-inner`}
                    >
                      {detail.structure}
                    </span>
                  </p>

                  <p className="text-gray-600">
                    Ý nghĩa:{" "}
                    <span className="font-medium text-gray-800">
                      {detail.meaning}
                    </span>
                  </p>

                  <div
                    className={`${EXAMPLE_BG_LIGHT} rounded-xl p-5 border-l-4 ${BORDER_TEAL} shadow-md`}
                  >
                    <p className="whitespace-pre-line text-lg font-medium text-gray-900">
                      {detail.exampleSentence}
                    </p>
                    <p className="text-gray-500 text-sm mt-3 border-t border-gray-200 pt-2">
                      <span className="font-bold">Dịch nghĩa:</span>{" "}
                      {detail.exampleMeaning}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrammarContent;
