interface ExamResultBannerProps {
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
}

/**
 * Display exam results in a success banner
 */
export function ExamResultBanner({
  scorePercentage,
  correctCount,
  totalQuestions,
}: ExamResultBannerProps) {
  return (
    <div className="mb-10 p-6 bg-green-50 border-2 border-green-300 rounded-xl text-center shadow-md animate-fade-in">
      <h3 className="font-extrabold text-2xl text-green-700 mb-3">
        Kết quả của bạn: Hoàn thành xuất sắc!
      </h3>
      <p className="text-2xl text-gray-800 font-bold">
        Điểm số:{" "}
        <span className="font-black text-green-800 text-4xl">
          {scorePercentage.toFixed(2)}%
        </span>{" "}
        <span className="text-xl">
          ({correctCount}/{totalQuestions})
        </span>
      </p>
    </div>
  );
}
