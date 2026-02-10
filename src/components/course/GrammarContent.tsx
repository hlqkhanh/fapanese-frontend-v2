import { motion } from "framer-motion";
import type { Grammar } from "@/types/grammar";

interface GrammarContentProps {
  grammars: Grammar[];
  loading?: boolean;
  lessonPartId?: string;
}

const GrammarContent = ({ grammars, loading = false, lessonPartId }: GrammarContentProps) => {

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
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 pb-3 mb-6 md:mb-10 
                     border-b-4 border-cyan-500 tracking-tight"
        >
          Ngữ pháp {lessonPartId && `- Bài học ${lessonPartId}`}
        </h1>

        <div className="space-y-6 md:space-y-8">
          {grammars.map((grammar, index) => (
            <motion.div
              key={grammar.id}
              className="bg-white rounded-2xl p-5 md:p-7 shadow-lg border border-gray-100
                         hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
            >
              {/* Grammar Title */}
              <h2 className="text-xl md:text-2xl font-bold text-cyan-600 border-b border-gray-100 pb-3 mb-4">
                {grammar.title}
              </h2>

              {/* Explanation */}
              <p className="text-gray-700 mb-5 leading-relaxed text-sm md:text-base">
                {grammar.explanation}
              </p>

              {/* Grammar Details */}
              {grammar.details?.map((detail, idx) => (
                <div
                  key={idx}
                  className="border-t border-gray-200 pt-5 mt-5 space-y-4"
                >
                  {/* Structure */}
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Cấu trúc
                    </p>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 border-l-4 border-cyan-500">
                      <p className="font-mono text-base md:text-lg font-semibold text-cyan-700">
                        {detail.structure}
                      </p>
                    </div>
                  </div>

                  {/* Meaning */}
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Ý nghĩa
                    </p>
                    <p className="text-sm md:text-base font-medium text-gray-800 pl-4 border-l-2 border-gray-300">
                      {detail.meaning}
                    </p>
                  </div>

                  {/* Example */}
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Ví dụ
                    </p>
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 md:p-5 border border-cyan-100">
                      <p className="whitespace-pre-line text-base md:text-lg font-medium text-gray-900 mb-3">
                        {detail.exampleSentence}
                      </p>
                      <div className="border-t border-cyan-200 pt-3">
                        <p className="text-gray-600 text-sm md:text-base">
                          <span className="font-semibold text-cyan-700">Dịch:</span>{" "}
                          {detail.exampleMeaning}
                        </p>
                      </div>
                    </div>
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
