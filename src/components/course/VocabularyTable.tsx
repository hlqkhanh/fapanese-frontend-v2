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
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-100">
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
  );
};

export default VocabularyTable;
