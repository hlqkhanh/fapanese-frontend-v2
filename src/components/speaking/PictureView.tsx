import type { PicturePart } from "@/types/speakingTest";

interface PictureViewProps {
  picturePart: PicturePart;
}

/**
 * Component for displaying Part 2: Picture description question
 */
export function PictureView({ picturePart }: PictureViewProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Phần 2: Trả lời câu hỏi tranh
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Nghe câu hỏi và trả lời dựa vào tranh. (Câu hỏi sẽ tự động phát)
      </p>
      <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
        <img
          src={picturePart.imgUrl}
          alt={picturePart.topic}
          className="max-w-full md:max-w-2xl rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
