import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hooks
import { useOverviewParts } from "@/hooks/overview/useOverviewParts";
import { useOverviewContent } from "@/hooks/overview/useOverviewContent";
import { useExamSubmission } from "@/hooks/overview/useExamSubmission";
import { useAIExplanation } from "@/hooks/overview/useAIExplanation";

// Components
import { OverviewSidebar } from "@/components/overview/OverviewSidebar";
import { ContentListGrid } from "@/components/overview/ContentListGrid";
import { SpeakingGroupCard } from "@/components/overview/SpeakingGroupCard";
import { ExamView } from "@/components/overview/ExamView";
import { AIExplanationModal } from "@/components/overview/AIExplanationModal";

// Types
import type { SpeakingGroup, Exam, OverviewPartType } from "@/types/overview";

// Banner images (imported from artifacts)
const PART_BANNERS: Record<string, string> = {
  SPEAKING: "/src/assets/speaking_banner.png",
  MIDDLE_EXAM: "/src/assets/middle_exam_banner.png",
  FINAL_EXAM: "/src/assets/final_exam_banner.png",
};

export default function OverviewContentPage() {
  const { courseCode, overviewId, partId } = useParams();
  const location = useLocation();
  const courseId = (location.state as any)?.courseId;

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [currentPartType, setCurrentPartType] = useState<OverviewPartType | null>(null);
  const [loadingBanner, setLoadingBanner] = useState(true);

  // Fetch overview parts (sidebar)
  const { parts, loading: partsLoading } = useOverviewParts({
    overviewId: Number(overviewId),
    courseCode: courseCode || "",
    currentPartId: partId ? Number(partId) : undefined,
  });

  // Get current part type
  useEffect(() => {
    if (partId && parts.length > 0) {
      const currentPart = parts.find((p) => p.id === Number(partId));
      setCurrentPartType(currentPart?.type || null);
      setSelectedGroupId(null); // Reset selection when part changes
    }
  }, [partId, parts]);

  // Fetch content for current part
  const { contentGroups, loading: contentLoading } = useOverviewContent({
    partId: Number(partId),
    partType: currentPartType,
  });

  // Exam submission
  const examSubmission = useExamSubmission();

  // AI explanation
  const aiExplanation = useAIExplanation();

  // Get current part title
  const currentPartTitle = parts.find((p) => p.id === Number(partId))?.title;

  // Get selected group
  const selectedGroup = selectedGroupId
    ? contentGroups.find((g) => g.id === selectedGroupId)
    : null;

  // Handle answer selection with auto-scroll
  const handleAnswerSelect = (questionId: number, answer: string, index: number) => {
    examSubmission.setAnswer(questionId, answer);

    // Auto-scroll to next question
    const exam = selectedGroup as Exam;
    if (exam && index < exam.questions.length - 1) {
      setTimeout(() => {
        const nextElement = document.getElementById(`question-${index + 1}`);
        nextElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  // Handle exam submit
  const handleSubmitExam = async () => {
    const exam = selectedGroup as Exam;
    if (exam) {
      const success = await examSubmission.submitExam(exam.questions);
      if (success) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Render loading
  if (partsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
      </div>
    );
  }

  // Render detail view
  const renderDetail = () => {
    if (!selectedGroup) return null;

    return (
      <div className="space-y-8 animate-fade-in-up">
        <Button
          onClick={() => {
            setSelectedGroupId(null);
            examSubmission.reset();
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </Button>

        {currentPartType === "SPEAKING" && (
          <SpeakingGroupCard group={selectedGroup as SpeakingGroup} />
        )}

        {(currentPartType === "MIDDLE_EXAM" || currentPartType === "FINAL_EXAM") && (
          <ExamView
            exam={selectedGroup as Exam}
            userAnswers={examSubmission.userAnswers}
            onAnswerSelect={handleAnswerSelect}
            onSubmit={handleSubmitExam}
            submitResult={examSubmission.submitResult}
            isSubmitted={examSubmission.isSubmitted}
            onExplainAI={aiExplanation.explainQuestion}
          />
        )}
      </div>
    );
  };

  // Render list view
  const renderList = () => {
    if (contentLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        </div>
      );
    }

    if (contentGroups.length === 0) {
      return (
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl">
          <p className="italic text-gray-600 text-xl">
            Không tìm thấy bài ôn tập cho mục này.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Banner */}
        <img
          src={PART_BANNERS[currentPartType as string] || PART_BANNERS.SPEAKING}
          alt={`Banner ${currentPartTitle}`}
          className={`rounded-2xl w-full max-h-64 object-cover shadow-lg transition-all duration-700 ease-out ${
            loadingBanner ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          onLoad={() => setLoadingBanner(false)}
        />

        <div
          className={`transition-opacity duration-700 ease-in-out delay-200 ${
            contentLoading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <p className="text-xl text-gray-700 font-light leading-relaxed mb-6">
            Chọn một mục dưới đây để bắt đầu ôn luyện. Mỗi phần được thiết kế để giúp
            bạn nắm vững kiến thức một cách hiệu quả.
          </p>

          <ContentListGrid
            groups={contentGroups}
            partType={currentPartType}
            onSelectGroup={(id) => {
              setSelectedGroupId(id);
              examSubmission.reset();
            }}
            courseCode={courseCode || ""}
            overviewId={Number(overviewId)}
            partId={Number(partId)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Header - Only show in list view */}
      {!selectedGroup && (
        <header className="bg-white shadow-lg sticky top-0 z-20 border-b-4 border-cyan-500">
          <div className="max-w-8xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
            <Link
              to={courseId ? `/course/${courseId}` : `/courses`}
              className="flex items-center text-gray-700 hover:text-cyan-600 transition-colors text-lg font-medium group"
            >
              <ArrowLeft className="mr-2 h-6 w-6 text-gray-600 group-hover:text-cyan-600 transition-colors" />
              <span className="hidden sm:inline">Quay lại khóa học</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center flex-1 mx-4 truncate">
              {currentPartTitle}
            </h1>
            <div className="w-auto hidden sm:block"></div>
          </div>
        </header>
      )}

      {/* Main Layout */}
      <div className="max-w-8xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row md:space-x-10">
          {/* Sidebar */}
          <OverviewSidebar
            parts={parts}
            currentPartId={Number(partId)}
            courseCode={courseCode || ""}
            overviewId={Number(overviewId)}
          />

          {/* Content */}
          <main className="w-full md:flex-1">
            {selectedGroup ? renderDetail() : renderList()}
          </main>
        </div>
      </div>

      {/* AI Explanation Modal */}
      <AIExplanationModal
        open={aiExplanation.isOpen}
        onOpenChange={aiExplanation.close}
        question={aiExplanation.selectedQuestion}
        userAnswer={
          aiExplanation.selectedQuestion
            ? examSubmission.userAnswers[aiExplanation.selectedQuestion.id]
            : undefined
        }
        explanation={aiExplanation.explanation}
        loading={aiExplanation.loading}
      />
    </div>
  );
}
