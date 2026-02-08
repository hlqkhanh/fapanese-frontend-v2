import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import NavTabButtons from "@/components/course/NavTabButtons";
import VocabularyTable from "@/components/course/VocabularyTable";
import GrammarContent from "@/components/course/GrammarContent";
import QuestionExercise from "@/components/course/QuestionExercise";
import LessonSidebar from "@/components/course/LessonSidebar";
import FloatingNavBar from "@/components/course/FloatingNavBar";
import FlashcardFloatingButton from "@/components/course/FlashcardFloatingButton";

import { quizService } from "@/services/quizService";

import { useLesson } from "@/hooks/lesson/useLesson";
import { useLessonParts } from "@/hooks/lesson/useLessonParts";
import { useVocabulary } from "@/hooks/lesson/useVocabulary";
import { useGrammar } from "@/hooks/lesson/useGrammar";
import { useQuestions } from "@/hooks/lesson/useQuestions";
import { useFloatingNav } from "@/hooks/lesson/useFloatingNav";
import { useFlashcardButton } from "@/hooks/lesson/useFlashcardButton";

import type { QuizAnswer, QuizResult } from "@/types/quiz";
import { toast } from "sonner";

const LessonPage = () => {
  const { courseCode, lessonId, lessonPartId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = (location.state as any)?.courseId;

  // UI State
  const [activeTab, setActiveTab] = useState<"lesson" | "exercise">("lesson");
  const [contentType, setContentType] = useState<"vocab" | "grammar">("vocab");

  // Refs
  const navRef = useRef<HTMLDivElement>(null);
  const vocabContentRef = useRef<HTMLDivElement>(null);

  // Data Hooks
  const { lesson } = useLesson(lessonId);
  const { lessonParts } = useLessonParts(lessonId);
  const { vocabularies, loading: loadingVocab } = useVocabulary({
    lessonPartId,
    activeTab,
    contentType,
  });
  const { grammars, loading: loadingGrammar } = useGrammar({
    lessonParts,
    activeTab,
    contentType,
  });
  const { questions, loading: loadingQuestions } = useQuestions({
    lessonParts,
    activeTab,
    contentType,
  });

  // UI Logic Hooks
  const { showFloatingNav } = useFloatingNav(navRef);
  const { showFlashcardButton } = useFlashcardButton({
    activeTab,
    contentType,
    vocabContentRef,
  });

  // Scroll to top on tab/content change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, contentType]);

  // Handle content switching
  const handleSwitchContent = async (type: "vocab" | "grammar") => {
    if (!lessonParts.length) {
      console.warn("⚠️ Chưa tải xong lessonParts");
      return;
    }

    const vocabPart = lessonParts.find((p) => p.type === "VOCABULARY");
    const grammarPart = lessonParts.find((p) => p.type === "GRAMMAR");

    const targetPartId =
      type === "grammar" ? grammarPart?.id || vocabPart?.id : vocabPart?.id;

    if (targetPartId) {
      navigate(`/lesson/${courseCode}/${lessonId}/${targetPartId}`, {
        replace: false,
      });
    }

    setContentType(type);
  };

  // Handle flashcard navigation
  const handleGoToFlashcard = () => {
    if (lessonPartId) {
      navigate(`/flashcard/${lessonPartId}`);
    } else {
      alert("Không tìm thấy ID bài học!");
    }
  };

  // Handle quiz submission
  const handleQuizSubmit = async (
    answers: QuizAnswer[]
  ): Promise<QuizResult> => {
    try {
      const res = await quizService.submitAnswers(answers);
      return res.result;
    } catch (err) {
      console.error("Lỗi khi nộp bài:", err);
      toast.error("Có lỗi xảy ra khi nộp bài");
      throw err;
    }
  };

  // Render lesson content
  const renderLessonContent = () => {
    return (
      <div className="w-full flex-shrink-0">
        <div className="bg-gradient-to-br from-white via-[#f9fdff] to-[#f1fbfc]">
          <div
            className="p-6 relative"
            ref={contentType === "vocab" ? vocabContentRef : null}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {lesson?.lessonTitle || `Bài ${lessonId}`}
            </h1>
            <p className="text-gray-600 mb-6">
              {contentType === "vocab"
                ? "Bạn sẽ học các từ vựng cơ bản trong bài này."
                : "Bạn sẽ học các ngữ pháp quan trọng trong bài này."}
            </p>

            {contentType === "vocab" ? (
              <VocabularyTable
                vocabularies={vocabularies}
                loading={loadingVocab}
              />
            ) : (
              <GrammarContent
                grammars={grammars}
                loading={loadingGrammar}
                lessonPartId={lessonPartId}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#f8fdfe] to-[#e6f7f9] flex justify-center py-5">
      {/* Floating Nav Bar */}
      <FloatingNavBar
        show={showFloatingNav}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Flashcard Button */}
      <FlashcardFloatingButton
        show={showFlashcardButton}
        onClick={handleGoToFlashcard}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl py-10 px-6">
        {/* Left Column - Main Content */}
        <div className="lg:w-3/4 pr-0 lg:pr-8 space-y-4">
          {/* Simple Back Button */}
          <Link
            to={courseId ? `/course/${courseId}` : `/courses`}
            className="inline-flex items-center text-gray-600 hover:text-cyan-600 transition-colors text-sm font-medium group mb-4"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
            Quay lại khóa học
          </Link>

          <div ref={navRef} className="mb-6">
            <NavTabButtons activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-h-[450px]">
            <AnimatePresence mode="wait">
              {activeTab === "lesson" ? (
                <motion.div
                  key="lesson"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {renderLessonContent()}
                </motion.div>
              ) : (
                <motion.div
                  key="exercise"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <QuestionExercise
                    questions={questions}
                    loading={loadingQuestions}
                    onSubmit={handleQuizSubmit}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <LessonSidebar
          lesson={lesson}
          activeContent={contentType}
          onContentSwitch={handleSwitchContent}
        />
      </div>
    </div>
  );
};

export default LessonPage;
