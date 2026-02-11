import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "../ScrollReveal";
import { Button } from "../ui/button";

// --- DATA ---
interface Kana {
  symbol: string;
  romaji: string;
}

const hiragana: Kana[] = [
  { symbol: "あ", romaji: "a" }, { symbol: "い", romaji: "i" }, { symbol: "う", romaji: "u" }, { symbol: "え", romaji: "e" }, { symbol: "お", romaji: "o" },
  { symbol: "か", romaji: "ka" }, { symbol: "き", romaji: "ki" }, { symbol: "く", romaji: "ku" }, { symbol: "け", romaji: "ke" }, { symbol: "こ", romaji: "ko" },
  { symbol: "さ", romaji: "sa" }, { symbol: "し", romaji: "shi" }, { symbol: "す", romaji: "su" }, { symbol: "せ", romaji: "se" }, { symbol: "そ", romaji: "so" },
  { symbol: "た", romaji: "ta" }, { symbol: "ち", romaji: "chi" }, { symbol: "つ", romaji: "tsu" }, { symbol: "て", romaji: "te" }, { symbol: "と", romaji: "to" },
  { symbol: "な", romaji: "na" }, { symbol: "に", romaji: "ni" }, { symbol: "ぬ", romaji: "nu" }, { symbol: "ね", romaji: "ne" }, { symbol: "の", romaji: "no" },
  { symbol: "は", romaji: "ha" }, { symbol: "ひ", romaji: "hi" }, { symbol: "ふ", romaji: "fu" }, { symbol: "へ", romaji: "he" }, { symbol: "ほ", romaji: "ho" },
  { symbol: "ま", romaji: "ma" }, { symbol: "み", romaji: "mi" }, { symbol: "む", romaji: "mu" }, { symbol: "め", romaji: "me" }, { symbol: "も", romaji: "mo" },
  { symbol: "や", romaji: "ya" }, { symbol: "ゆ", romaji: "yu" }, { symbol: "よ", romaji: "yo" },
  { symbol: "ら", romaji: "ra" }, { symbol: "り", romaji: "ri" }, { symbol: "る", romaji: "ru" }, { symbol: "れ", romaji: "re" }, { symbol: "ろ", romaji: "ro" },
  { symbol: "わ", romaji: "wa" }, { symbol: "を", romaji: "wo" }, { symbol: "ん", romaji: "n" },
];

const katakana: Kana[] = [
  { symbol: "ア", romaji: "a" }, { symbol: "イ", romaji: "i" }, { symbol: "ウ", romaji: "u" }, { symbol: "エ", romaji: "e" }, { symbol: "オ", romaji: "o" },
  { symbol: "カ", romaji: "ka" }, { symbol: "キ", romaji: "ki" }, { symbol: "ク", romaji: "ku" }, { symbol: "ケ", romaji: "ke" }, { symbol: "コ", romaji: "ko" },
  { symbol: "サ", romaji: "sa" }, { symbol: "シ", romaji: "shi" }, { symbol: "ス", romaji: "su" }, { symbol: "セ", romaji: "se" }, { symbol: "ソ", romaji: "so" },
  { symbol: "タ", romaji: "ta" }, { symbol: "チ", romaji: "chi" }, { symbol: "ツ", romaji: "tsu" }, { symbol: "テ", romaji: "te" }, { symbol: "ト", romaji: "to" },
  { symbol: "ナ", romaji: "na" }, { symbol: "ニ", romaji: "ni" }, { symbol: "ヌ", romaji: "nu" }, { symbol: "ネ", romaji: "ne" }, { symbol: "ノ", romaji: "no" },
  { symbol: "ハ", romaji: "ha" }, { symbol: "ヒ", romaji: "hi" }, { symbol: "フ", romaji: "fu" }, { symbol: "ヘ", romaji: "he" }, { symbol: "ホ", romaji: "ho" },
  { symbol: "マ", romaji: "ma" }, { symbol: "ミ", romaji: "mi" }, { symbol: "ム", romaji: "mu" }, { symbol: "メ", romaji: "me" }, { symbol: "モ", romaji: "mo" },
  { symbol: "ヤ", romaji: "ya" }, { symbol: "ユ", romaji: "yu" }, { symbol: "ヨ", romaji: "yo" },
  { symbol: "ラ", romaji: "ra" }, { symbol: "リ", romaji: "ri" }, { symbol: "ル", romaji: "ru" }, { symbol: "レ", romaji: "re" }, { symbol: "ロ", romaji: "ro" },
  { symbol: "ワ", romaji: "wa" }, { symbol: "ヲ", romaji: "wo" }, { symbol: "ン", romaji: "n" },
];

// --- COMPONENT ---
interface AlphabetLearningProps {
  initialTab?: "hiragana" | "katakana";
}

const AlphabetLearning: React.FC<AlphabetLearningProps> = ({ initialTab = "hiragana" }) => {
  const [activeTab, setActiveTab] = useState<"hiragana" | "katakana">(initialTab);
  const [learningMode, setLearningMode] = useState<"sequential" | "shuffle">("sequential");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentKana, setCurrentKana] = useState<Kana | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "error">("idle");
  const [learnedKana, setLearnedKana] = useState<Kana[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const kanaList = activeTab === "hiragana" ? hiragana : katakana;

  // --- LOGIC ---
  const randomizeNext = () => {
    const randomIndex = Math.floor(Math.random() * kanaList.length);
    setCurrentKana(kanaList[randomIndex]);
  };

  useEffect(() => {
    setCurrentIndex(0);
    setLearnedKana([]);
    setInput("");
    setStatus("idle");
    if (learningMode === "sequential") {
      setCurrentKana(kanaList[0]);
    } else {
      randomizeNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, learningMode]);

  useEffect(() => {
    if (learningMode === "sequential") {
      setCurrentKana(kanaList[currentIndex]);
    }
  }, [currentIndex, kanaList, learningMode]);

  const nextQuestion = () => {
    setInput("");
    setStatus("idle");
    if (learningMode === "sequential") {
      setCurrentIndex((prev) => (prev + 1) % kanaList.length);
    } else {
      randomizeNext();
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSubmit = () => {
    if (!currentKana) return;

    if (input.trim().toLowerCase() === currentKana.romaji.toLowerCase()) {
      setStatus("correct");
      if (!learnedKana.some(k => k.symbol === currentKana.symbol)) {
        setLearnedKana(prev => [...prev, currentKana]);
      }
      setTimeout(nextQuestion, 500);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const progressPercentage = (learnedKana.length / kanaList.length) * 100;

  return (
    <ScrollReveal>
      <section className="w-full bg-[#F5F7FA] py-16 px-4 font-sans min-h-screen">
        <div className="max-w-6xl mx-auto">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              HỌC BẢNG CHỮ CÁI <span className="text-primary">BẰNG HÌNH THỨC MỚI MẺ</span>
            </h2>
            <p className="text-gray-500">
              Chọn chế độ học bên trái và theo dõi tiến độ ở danh sách bên phải.
            </p>
          </div>

          {/* --- MAIN LAYOUT --- */}
          {/* items-stretch: Đảm bảo 2 cột cao bằng nhau */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center">

            {/* --- CỘT TRÁI: Khu vực học --- */}
            <div className="w-full lg:w-[400px] flex-shrink-0 order-1">
              {/* h-full: Để box trắng giãn hết chiều cao cột */}
              <div className="h-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                
                {/* Controls */}
                <div className="flex flex-col gap-3 mb-6 w-full items-center">
                  <div className="flex gap-2 w-full justify-center">
                    {["hiragana", "katakana"].map((tab) => (
                      <Button
                        key={tab}
                        onClick={() => setActiveTab(tab as "hiragana" | "katakana")}
                        className={`flex-1 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                          activeTab === tab
                            ? " text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {tab === "hiragana" ? "Hiragana" : "Katakana"}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2 w-full justify-center">
                    <Button
                      onClick={() => setLearningMode("sequential")}
                      className={`flex-1 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                        learningMode === "sequential"
                          ? " text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Thứ tự
                    </Button >
                    <Button 
                      onClick={() => setLearningMode("shuffle")}
                      className={`flex-1 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 ${
                        learningMode === "shuffle"
                          ? "text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Trộn
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-2">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                    <span>Tiến độ</span>
                    <span>{learnedKana.length} / {kanaList.length}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Learning Card */}
                {/* flex-1: Đẩy nội dung ra giữa nếu cột cao */}
                <div className="my-6 w-full flex-1 flex flex-col justify-center items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentKana?.symbol}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#F9FAFB] rounded-[2rem] w-56 h-56 flex items-center justify-center border-2 border-dashed border-gray-200"
                    >
                      <span className="text-8xl font-black text-[#111827]">
                        {currentKana?.symbol}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="w-full flex flex-col gap-3 relative mt-auto">
                  <motion.input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nhập romaji..."
                    animate={status === "error" ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-bold outline-none transition-colors ${
                        status === "error" 
                        ? "border-red-400 bg-red-50 text-red-600 placeholder-red-300"
                        : status === "correct"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 focus:border-[#111827] bg-white text-gray-900"
                    }`}
                  />
                  <Button
                    onClick={handleSubmit}
                    className="w-full  font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
                  >
                    Kiểm tra
                  </Button>
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI: Danh sách Grid --- */}
            <div className="w-full lg:flex-1 order-2">
               {/* 1. Thêm flex flex-col: Để biến box trắng thành flex container dọc */}
               <div className="h-full bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-gray-800">Danh sách chữ cái</h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                      {kanaList.length} ký tự
                    </span>
                  </div>
                  
                  {/* 2. flex-1: Để grid chiếm hết không gian còn lại 
                      3. content-between: Phân phối khoảng cách giữa các hàng để lấp đầy chiều cao (trải đều)
                  */}
                  <div className="flex-1 grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8 gap-2 content-between">
                    {kanaList.map((k, idx) => {
                      const isLearned = learnedKana.some(lk => lk.symbol === k.symbol);
                      const isCurrent = currentKana?.symbol === k.symbol;

                      return (
                        <div
                          key={idx}
                          // 4. h-10: Giữ chiều cao cố định cho ô để trông đều đẹp, 
                          // khoảng trắng sẽ tự động thêm vào giữa các hàng nhờ content-between
                          className={`
                            relative h-10 flex items-center justify-center rounded-lg border text-sm font transition-all duration-300
                            ${isLearned 
                                ? "bg-green-50 border-green-500 text-green-700"
                                : isCurrent
                                    ? "border-[#EED772] bg-[#EED772] font-bold scale-105 shadow-md z-10"
                                    : "bg-white border-gray-300 hover:border-gray-300"
                            }
                          `}
                        >
                          {k.symbol}
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};

export default AlphabetLearning;