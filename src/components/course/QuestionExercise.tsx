import { useState } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/types/question";
import type { QuizResult } from "@/types/quiz";

interface QuestionExerciseProps {
  questions: Question[];
  loading?: boolean;
  onSubmit: (answers: { questionId: number; userAnswer: string }[]) => Promise<QuizResult>;
}

const QuestionExercise = ({ questions, loading = false, onSubmit }: QuestionExerciseProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const handleAnswerSelect = (i: number) => {
    if (!currentQuestion || isAnswered) return;

    setSelectedOption(i);

    let chosenAnswer = "";
    if (currentQuestion.questionType === "TRUE_FALSE") {
      chosenAnswer = i === 0 ? "True" : "False";
    } else {
      const options = getOptions();
      chosenAnswer = options[i];
    }

    let correct = false;
    if (
      currentQuestion.questionType === "MULTIPLE_CHOICE" ||
      currentQuestion.questionType === "TRUE_FALSE"
    ) {
      correct =
        chosenAnswer?.trim().toLowerCase() ===
        currentQuestion.correctAnswer?.trim().toLowerCase();
    } else if (currentQuestion.questionType === "FILL") {
      correct =
        chosenAnswer?.trim().toLowerCase() ===
        currentQuestion.fillAnswer?.trim().toLowerCase();
    }

    setIsAnswered(true);
    setIsCorrect(correct);

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      userAnswer: chosenAnswer,
      correctAnswer:
        currentQuestion.questionType === "FILL"
          ? currentQuestion.fillAnswer
          : currentQuestion.correctAnswer,
      isCorrect: correct,
    };
    setUserAnswers(updatedAnswers);
  };

  const handleSubmitQuiz = async () => {
    if (userAnswers.length === 0) {
      alert("Bạn chưa trả lời câu nào!");
      return;
    }

    try {
      const filteredAnswers = userAnswers
        .filter((a) => a && a.questionId && a.userAnswer)
        .map((a) => ({
          questionId: a.questionId,
          userAnswer: a.userAnswer,
        }));

      const result = await onSubmit(filteredAnswers);
      setQuizResult(result);
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);
    }
  };

  const getOptions = (): string[] => {
    if (!currentQuestion) return [];
    return [
      currentQuestion.optionA,
      currentQuestion.optionB,
      currentQuestion.optionC,
      currentQuestion.optionD,
    ].filter((opt): opt is string => Boolean(opt));
  };

  const getOptionClass = (i: number) => {
    let base =
      "p-5 rounded-4xl text-left shadow-md border-2 transition-all duration-300 transform";

    if (isAnswered) {
      const isChosen = selectedOption === i;
      const options = getOptions();
      const isCorrectOption =
        options[i]?.trim().toLowerCase() ===
        currentQuestion?.correctAnswer?.trim().toLowerCase();

      if (currentQuestion?.questionType === "MULTIPLE_CHOICE") {
        if (isChosen && isCorrect) {
          return `${base} bg-green-100 border-green-500 text-green-800 cursor-default shadow-lg`;
        } else if (isChosen && !isCorrect) {
          return `${base} bg-red-100 border-red-500 text-red-800 cursor-default shadow-lg`;
        } else if (isCorrectOption) {
          return `${base} bg-green-50 border-green-400 text-green-700 cursor-default`;
        } else {
          return `${base} bg-gray-50 border-gray-200 text-gray-400 cursor-default`;
        }
      }
    } else {
      if (selectedOption === i) {
        return `${base} bg-[#E0F7FA] border-[#00BCD4] text-[#00BCD4] shadow-lg scale-[1.01]`;
      }
      return `${base} bg-white border-gray-200 hover:border-[#00BCD4] text-gray-800 hover:shadow-lg hover:-translate-y-0.5`;
    }

    return base;
  };

  if (loading) {
    return (
      <div className="w-full p-12 bg-white shadow-xl rounded-3xl border border-gray-100">
        <p className="text-gray-500 italic text-center py-8">
          Đang tải câu hỏi...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="w-full p-12 bg-white shadow-xl rounded-3xl border border-gray-100">
        <p className="text-gray-500 italic text-center py-8">
          Không có câu hỏi nào trong phần này.
        </p>
      </div>
    );
  }

  if (quizResult) {
    const score = quizResult.scorePercentage;
    const correct = quizResult.correctCount;
    const total = quizResult.totalQuestions;

    const message =
      score >= 80
        ? "Xin chúc mừng! Mức độ thành thạo xuất sắc."
        : score >= 50
        ? "Kết quả tốt. Cần thêm một chút luyện tập nữa."
        : "Hãy tiếp tục rèn luyện để đạt hiệu quả cao hơn.";

    const scoreColor =
      score >= 80
        ? "text-[#00ACC1]"
        : score >= 50
        ? "text-[#0097A7]"
        : "text-gray-700";

    return (
      <div
        className="mt-16 p-14 bg-white rounded-3xl shadow-neumorphic-lg border border-gray-50 max-w-lg mx-auto 
                    transform transition-all duration-500 hover:shadow-neumorphic-xl"
      >
        <div className="text-center">
          <h2 className="text-4xl font-extralight text-gray-800 mb-2 tracking-widest uppercase">
            Kết Quả
          </h2>
          <p className="text-lg text-gray-500 mb-12 font-light italic border-b pb-6">
            {message}
          </p>

          <div className="mb-12 p-8 bg-white rounded-2xl shadow-inner-neumorphic border border-gray-100">
            <p className="text-sm text-gray-400 mb-4 font-medium uppercase tracking-widest">
              Tổng Điểm Đạt Được
            </p>
            <span
              className={`text-8xl font-black ${scoreColor} transition-colors duration-500`}
            >
              {score}
              <span className="text-5xl align-top font-bold">%</span>
            </span>
          </div>

          <div className="space-y-6 text-center">
            <div className="py-2 border-b border-gray-100">
              <p className="text-base text-gray-600 font-light mb-1">
                Số câu trả lời đúng
              </p>
              <span className="text-3xl font-semibold text-[#0097A7]">
                {correct}
              </span>
              <span className="text-xl font-normal text-gray-400">
                /{total}
              </span>
            </div>

            <div className="py-2 border-b border-gray-100">
              <p className="text-base text-gray-600 font-light mb-1">
                Tỷ lệ chính xác
              </p>
              <span className="text-3xl font-semibold text-[#00ACC1]">
                {score}%
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setQuizResult(null);
              setCurrentQuestionIndex(0);
              setIsAnswered(false);
              setIsCorrect(null);
              setSelectedOption(null);
              setUserAnswers([]);
            }}
            className="mt-16 w-full px-8 py-5 text-xl rounded-2xl 
                     bg-gradient-to-r from-[#00BCD4] to-[#26C6DA] 
                     text-white font-semibold tracking-wider shadow-btn-neumorphic
                     transition-all duration-300 
                     hover:shadow-btn-hover-neumorphic hover:scale-[1.01] 
                     active:shadow-btn-active-neumorphic active:scale-[0.99]
                     focus:outline-none focus:ring-4 focus:ring-[#00BCD4]/50"
          >
            Làm Lại Bài Luyện Tập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 md:p-12 bg-white">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-bold text-[#00796B] tracking-wider">
            TIẾN ĐỘ BÀI TẬP
          </p>
          <p className="text-2xl font-extrabold text-gray-800">
            {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-[#00BCD4] to-[#4DD0E1] h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentQuestionIndex === 0}
            onClick={() => {
              setCurrentQuestionIndex((prev) => prev - 1);
              setSelectedOption(null);
              setIsAnswered(false);
              setIsCorrect(null);
            }}
            className={`px-8 py-3 rounded-full font-semibold transition-all shadow-md ${
              currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#B2EBF2] hover:bg-[#80DEEA] text-gray-800"
            }`}
          >
            ◀ Câu trước
          </motion.button>

          {currentQuestionIndex < questions.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentQuestionIndex((prev) => prev + 1);
                setSelectedOption(null);
                setIsAnswered(false);
                setIsCorrect(null);
              }}
              className="px-8 py-3 rounded-full font-semibold bg-[#00BCD4] hover:bg-[#0097A7] text-white shadow-lg"
            >
              Câu tiếp theo ▶
            </motion.button>
          ) : (
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 15px rgba(0, 188, 212, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmitQuiz}
              className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-[#00BCD4] to-[#26C6DA] text-white text-lg shadow-xl"
            >
              HOÀN THÀNH 🚀
            </motion.button>
          )}
        </div>
      </div>

      {currentQuestion && (
        <div className="text-center mt-10">
          <div className="flex flex-col mb-4 p-2 border-b border-gray-200">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-4xl font-extrabold text-gray-900 leading-none">
                Câu {currentQuestionIndex + 1}
              </h3>

              <span className="text-[#00BCD4] text-sm font-semibold uppercase tracking-wider px-3 py-1 bg-[#E0F7FA] rounded-full">
                {currentQuestion.category}
              </span>
            </div>

            <span className="text-gray-500 text-sm font-medium italic mt-1">
              {currentQuestion.questionType === "MULTIPLE_CHOICE"
                ? "Vui lòng chọn đáp án đúng"
                : currentQuestion.questionType === "TRUE_FALSE"
                ? "Vui lòng chọn Đúng hoặc Sai"
                : "Vui lòng điền đáp án của bạn"}
            </span>
          </div>

          <p className="text-2xl font-bold text-gray-800 mb-10 p-4 bg-gray-50 rounded-xl shadow-inner">
            {currentQuestion.content}
          </p>

          {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
            <div className="grid grid-cols-2 gap-6 mb-12">
              {getOptions().map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: isAnswered ? 1.0 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1.0 : 0.98 }}
                  onClick={() => handleAnswerSelect(i)}
                  disabled={isAnswered}
                  className={getOptionClass(i) + " font-medium"}
                >
                  <span className="font-bold mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </motion.button>
              ))}
            </div>
          )}

          {currentQuestion.questionType === "FILL" && (
            <div className="mt-6 mb-10">
              <input
                key={currentQuestion.id}
                type="text"
                placeholder="Nhập đáp án và nhấn Enter..."
                disabled={isAnswered}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isAnswered) {
                    e.preventDefault();

                    const value = e.currentTarget.value.trim();
                    if (!value) return;

                    let correct = false;
                    if (currentQuestion.fillAnswer) {
                      correct =
                        value.trim().toLowerCase() ===
                        currentQuestion.fillAnswer.trim().toLowerCase();
                    } else {
                      correct =
                        value.trim().toLowerCase() ===
                        currentQuestion.correctAnswer?.trim().toLowerCase();
                    }

                    setIsAnswered(true);
                    setIsCorrect(correct);

                    const updatedAnswers = [...userAnswers];
                    updatedAnswers[currentQuestionIndex] = {
                      questionId: currentQuestion.id,
                      userAnswer: value,
                      correctAnswer:
                        currentQuestion.fillAnswer ||
                        currentQuestion.correctAnswer,
                      isCorrect: correct,
                    };
                    setUserAnswers(updatedAnswers);

                    e.currentTarget.blur();
                  }
                }}
                className={`w-full border-4 rounded-xl px-6 py-4 text-gray-800 text-lg shadow-lg transition-all ${
                  isAnswered
                    ? "border-gray-300 bg-gray-100 cursor-default"
                    : "border-gray-200 focus:border-[#00BCD4] focus:ring-4 focus:ring-[#B2EBF2] outline-none"
                }`}
              />
            </div>
          )}

          {currentQuestion.questionType === "TRUE_FALSE" && (
            <div className="flex gap-6 mt-6 mb-10">
              {["True", "False"].map((val, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: isAnswered ? 1.0 : 1.03 }}
                  whileTap={{ scale: isAnswered ? 1.0 : 0.97 }}
                  disabled={isAnswered}
                  onClick={() => handleAnswerSelect(i)}
                  className={`flex-1 py-5 rounded-full text-center border-2 font-bold transition-all shadow-lg ${
                    isAnswered
                      ? val.toLowerCase() ===
                        currentQuestion.correctAnswer?.toLowerCase()
                        ? "bg-green-100 border-green-500 text-green-800 cursor-default"
                        : selectedOption === i
                        ? "bg-red-100 border-red-500 text-red-800 cursor-default"
                        : "bg-gray-50 border-gray-200 text-gray-400 cursor-default"
                      : selectedOption === i
                      ? "bg-[#E0F7FA] border-[#00BCD4] text-[#00BCD4] shadow-xl"
                      : "bg-white border-gray-200 hover:border-[#00BCD4] hover:text-gray-900 hover:shadow-xl"
                  }`}
                >
                  {val}
                </motion.button>
              ))}
            </div>
          )}

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, type: "tween" }}
              className={`mt-5 p-5 rounded-2xl text-center font-bold text-xl shadow-2xl transition-all duration-500 
            ${
              isCorrect
                ? "bg-green-50 text-green-700 shadow-green-300/50"
                : "bg-red-50 text-red-700 shadow-red-300/50"
            }`}
            >
              {isCorrect ? (
                <>
                  <p className="text-1xl mb-2 font-extrabold text-green-800">
                    CHÍNH XÁC TUYỆT VỜI!
                  </p>
                  <span className="font-medium text-1xl text-gray-600">
                    Bạn đã hiểu rõ kiến thức này.
                  </span>
                </>
              ) : (
                <>
                  <p className="text-1xl mb-2 font-extrabold text-red-800">
                    RẤT TIẾC, CHƯA CHÍNH XÁC.
                  </p>
                  <div className="text-1xl font-medium text-gray-700 mt-4 pt-2 border-t border-red-200/50">
                    Đáp án đúng:
                    <span className="font-extrabold text-gray-900 ml-2 block sm:inline">
                      {currentQuestion.fillAnswer ||
                        currentQuestion.correctAnswer}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionExercise;
