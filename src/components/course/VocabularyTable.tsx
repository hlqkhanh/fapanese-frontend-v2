import { motion } from "framer-motion";
import { FaVolumeUp } from "react-icons/fa";
import type { Vocabulary } from "@/types/vocabulary";

interface VocabularyTableProps {
  vocabularies: Vocabulary[];
  loading?: boolean;
}

const VocabularyTable = ({ vocabularies, loading = false }: VocabularyTableProps) => {
  const handlePlaySound = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ chức năng phát âm thanh này.");
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 italic text-center py-6">
        Đang tải từ vựng...
      </p>
    );
  }

  if (vocabularies.length === 0) {
    return (
      <p className="text-gray-500 italic text-center py-6">
        Không có từ vựng nào trong phần này.
      </p>
    );
  }

  return (
    <>
      {/* Mobile Card Layout - Alternative Design */}
      <div className="block md:hidden space-y-4">
        {vocabularies.map((word, index) => (
          <motion.div
            key={word.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Header - Clean với số và audio button */}
            <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">Từ vựng</span>
              </div>
              <button
                className="text-white bg-cyan-500 hover:bg-cyan-600 p-2.5 rounded-lg shadow-sm transition transform active:scale-95 duration-200"
                onClick={() => handlePlaySound(word.wordKana)}
                aria-label="Phát âm"
              >
                <FaVolumeUp className="text-sm" />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-4">
              {/* Kana - Hero element */}
              <div className="text-center py-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100/50">
                <p className="text-xs text-cyan-600 font-semibold mb-2 uppercase tracking-wider">主要</p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{word.wordKana}</p>
                {word.romaji && (
                  <p className="text-sm text-gray-500 italic">({word.romaji})</p>
                )}
              </div>

              {/* Grid layout cho Kanji và Meaning */}
              <div className="grid gap-3">
                {word.wordKanji && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
                      <p className="text-xs text-gray-600 font-semibold">HÁN TỰ</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 pl-3">{word.wordKanji}</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                    <p className="text-xs text-gray-600 font-semibold">Ý NGHĨA</p>
                  </div>
                  <p className="text-base font-medium text-gray-800 pl-3">{word.meaning}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-xl shadow-md border border-gray-100">
        <table className="w-full min-w-[600px] bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                STT
              </th>
              <th className="px-10 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Kana
              </th>
              <th className="px-10 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Hán tự
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ý nghĩa
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Romaji
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Âm thanh
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vocabularies.map((word, index) => (
              <motion.tr
                key={word.id}
                className="hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-4 py-4 text-center text-sm font-bold text-[#00BCD4]">
                  {index + 1}
                </td>
                <td className="px-10 py-4">
                  <p className="text-sm font-bold text-gray-900">
                    {word.wordKana}
                  </p>
                </td>
                <td className="px-10 py-4">
                  {word.wordKanji ? (
                    <p className="text-sm text-gray-900">{word.wordKanji}</p>
                  ) : (
                    <span className="text-gray-300 text-xl">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {word.meaning}
                </td>
                <td className="px-4 py-4">
                  {word.romaji ? (
                    <p className="text-sm text-gray-400">{word.romaji}</p>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="text-white bg-[#00BCD4] hover:bg-[#00ACC1] p-3 rounded-full shadow-md transition transform hover:scale-110 duration-300"
                    onClick={() => handlePlaySound(word.wordKana)}
                    aria-label="Phát âm"
                  >
                    <FaVolumeUp />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VocabularyTable;
