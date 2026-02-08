import type { PassagePart } from "@/types/speakingTest";

interface PassageViewProps {
  passage: PassagePart;
}

/**
 * Component for displaying Part 1: Reading passage
 */
export function PassageView({ passage }: PassageViewProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Phần 1: Đọc đoạn văn
      </h2>
      <p className="text-gray-600 mb-4">
        Hãy đọc đoạn văn sau với giọng rõ ràng và đúng phát âm.
      </p>
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          {passage.topic}
        </h3>
        <p
          className="text-2xl leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {passage.passage}
        </p>
      </div>
    </div>
  );
}
