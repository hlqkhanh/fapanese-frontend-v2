import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Award, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Hooks
import { useSpeakingTest } from "@/hooks/speaking/useSpeakingTest";
import { useAudioRecorder } from "@/hooks/speaking/useAudioRecorder";
import { useTextToSpeech } from "@/hooks/speaking/useTextToSpeech";

// Components
import { PassageView } from "@/components/speaking/PassageView";
import { PictureView } from "@/components/speaking/PictureView";
import { QuestionView } from "@/components/speaking/QuestionView";
import { RecordingControls } from "@/components/speaking/RecordingControls";
import { ReviewCard } from "@/components/speaking/ReviewCard";
import { LoadingState } from "@/components/speaking/LoadingState";

// Services
import { speakingTestService } from "@/services/speakingTestService";
import { webSpeechAPI } from "@/lib/webSpeechAPI";

export default function SpeakingTestPage() {
  const { courseCode, overviewId, partId } = useParams<{
    courseCode: string;
    overviewId: string;
    partId: string;
  }>();
  const navigate = useNavigate();

  const speakingTest = useSpeakingTest(Number(partId));
  const recorder = useAudioRecorder();
  const tts = useTextToSpeech();

  // Auto-play questions for picture and question parts
  useEffect(() => {
    if (!speakingTest.testData) return;

    if (speakingTest.currentPart === "picture") {
      tts.speak(speakingTest.testData.picturePart.questions[0].question);
    } else if (speakingTest.currentPart === "question1") {
      tts.speak(speakingTest.testData.questionPart.questions[0].question);
    } else if (speakingTest.currentPart === "question2") {
      tts.speak(speakingTest.testData.questionPart.questions[1].question);
    }
  }, [speakingTest.currentPart, speakingTest.testData]);

  // Handle recording
  const handleStartRecording = async () => {
    try {
      await recorder.startRecording();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleStopRecording = async () => {
    let audioBlob: Blob | null = null;
    let audioUrl: string | null = null;

    try {
      audioBlob = await recorder.stopRecording();
      audioUrl = URL.createObjectURL(audioBlob);
      
      // Helper to save transcript to correct part
      const saveTranscriptPart = (text: string, url: string) => {
        if (speakingTest.currentPart === "passage") {
          speakingTest.saveTranscript("passage", text, url);
        } else if (speakingTest.currentPart === "picture") {
          speakingTest.saveTranscript("picture", text, url);
        } else if (speakingTest.currentPart === "question1") {
          speakingTest.saveTranscript("q1", text, url);
        } else if (speakingTest.currentPart === "question2") {
          speakingTest.saveTranscript("q2", text, url);
        }
      };

      // Phase 1: Try instant client-side transcription
      let clientTranscript = "";
      if (webSpeechAPI.isAvailable()) {
        try {
          recorder.setStatus("transcribing");
          const result = await webSpeechAPI.transcribe(audioBlob);
          clientTranscript = result.text;
          
          // Show instant result
          saveTranscriptPart(clientTranscript, audioUrl);
          toast.success("Gỡ băng nhanh! Đang xác minh...", { duration: 2000 });
        } catch (err) {
          console.warn("Client STT unavailable:", err);
        }
      }

      // Phase 2: Server transcription (accurate)
      recorder.setStatus("transcribing");
      const serverTranscript = await speakingTestService.transcribeAudio(audioBlob);
      
      // Replace with accurate server version
      saveTranscriptPart(serverTranscript, audioUrl);
      
      // Notify if different from client version
      if (clientTranscript && serverTranscript !== clientTranscript) {
        toast.info("Đã cập nhật transcript chính xác");
      }
    } catch (err: any) {
      console.error("Transcription error:", err);
      
      // Clean up blob URL if created
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      // Show error to user with actionable message
      const errorMsg = err.message || "Không thể xử lý audio";
      toast.error(`Lỗi gỡ băng: ${errorMsg}. Hãy thử ghi lại.`, {
        duration: 5000,
      });
    } finally {
      // CRITICAL: Always reset recorder to idle, even if error occurred
      // This allows user to retry immediately without getting "busy" error
      recorder.setStatus("idle");
    }
  };

  // Replay question audio
  const handleReplayQuestion = async () => {
    if (!speakingTest.testData) return;

    try {
      if (speakingTest.currentPart === "picture") {
        await tts.speak(speakingTest.testData.picturePart.questions[0].question);
      } else if (speakingTest.currentPart === "question1") {
        await tts.speak(speakingTest.testData.questionPart.questions[0].question);
      } else if (speakingTest.currentPart === "question2") {
        await tts.speak(speakingTest.testData.questionPart.questions[1].question);
      }
    } catch (err: any) {
      toast.error("Không thể phát audio");
    }
  };

  // Render current transcript
  const renderTranscript = () => {
    let text = "";
    if (speakingTest.currentPart === "passage") text = speakingTest.transcripts.passage;
    else if (speakingTest.currentPart === "picture") text = speakingTest.transcripts.picture;
    else if (speakingTest.currentPart === "question1") text = speakingTest.transcripts.q1;
    else if (speakingTest.currentPart === "question2") text = speakingTest.transcripts.q2;

    if (recorder.status === "transcribing") {
      return (
        <div className="flex items-center justify-center text-blue-600">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span>Đang phân tích giọng nói...</span>
        </div>
      );
    }

    if (text) {
      return (
        <p className="text-gray-700 italic text-center">
          "{text}"
        </p>
      );
    }

    return null;
  };

  // Render main content based on current part
  const renderMainContent = () => {
    switch (speakingTest.currentPart) {
      case "idle":
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Thi mô phỏng Speaking</h1>
            <p className="mb-8 text-lg text-gray-600">
              Bài thi bao gồm 3 phần: Đọc đoạn văn, Trả lời câu hỏi tranh, và Trả lời câu hỏi tự do.
            </p>
            {speakingTest.error && (
              <div className="text-center text-red-600 mb-4 p-3 bg-red-50 rounded-lg">
                {speakingTest.error}
              </div>
            )}
            <button
              onClick={speakingTest.startTest}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Bắt đầu thi
            </button>
          </div>
        );

      case "loadingTest":
        return <LoadingState type="loading" />;

      case "passage":
        return speakingTest.testData && (
          <PassageView passage={speakingTest.testData.passagePart} />
        );

      case "picture":
        return speakingTest.testData && (
          <PictureView picturePart={speakingTest.testData.picturePart} />
        );

      case "question1":
        return <QuestionView questionNumber={1} />;

      case "question2":
        return <QuestionView questionNumber={2} />;

      case "grading":
        return speakingTest.error ? (
          <LoadingState 
            type="error" 
            error={speakingTest.error}
            onRetry={() => speakingTest.setCurrentPart("question2")}
          />
        ) : (
          <LoadingState type="grading" />
        );

      case "REVIEW_ALL":
        return (
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-center text-green-600 flex items-center justify-center">
              <CheckCircle className="mr-3" size={36} />
              Hoàn thành bài thi!
            </h2>

            {/* Overall feedback */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 mb-6">
              <h4 className="text-2xl font-bold text-blue-800 mb-3 flex items-center">
                <Award className="mr-2" />
                Nhận xét tổng kết
              </h4>
              <p className="text-gray-800 font-medium text-lg whitespace-pre-wrap">
                {speakingTest.feedback?.overall || "Không có nhận xét tổng kết."}
              </p>
            </div>

            {/* Detailed reviews */}
            <ReviewCard
              title="Phần 1: Đọc đoạn văn"
              icon="passage"
              audioUrl={speakingTest.recordings.passage}
              transcript={speakingTest.transcripts.passage}
              feedbackText={speakingTest.feedback?.passage}
            />
            <ReviewCard
              title="Phần 2: Trả lời tranh"
              icon="picture"
              audioUrl={speakingTest.recordings.picture}
              transcript={speakingTest.transcripts.picture}
              feedbackText={speakingTest.feedback?.picture}
            />
            <ReviewCard
              title="Phần 3: Câu hỏi 1"
              icon="question"
              audioUrl={speakingTest.recordings.q1}
              transcript={speakingTest.transcripts.q1}
              feedbackText={speakingTest.feedback?.question1}
            />
            <ReviewCard
              title="Phần 3: Câu hỏi 2"
              icon="question"
              audioUrl={speakingTest.recordings.q2}
              transcript={speakingTest.transcripts.q2}
              feedbackText={speakingTest.feedback?.question2}
            />

            <div className="text-center mt-8">
              <button
                onClick={() => speakingTest.setCurrentPart("idle")}
                className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
              >
                Thi lại
              </button>
            </div>
          </div>
        );

      default:
        return <div>Lỗi không xác định</div>;
    }
  };

  const showControls = ["passage", "picture", "question1", "question2"].includes(
    speakingTest.currentPart
  );

  const showReplayButton = ["picture", "question1", "question2"].includes(
    speakingTest.currentPart
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-6 md:p-10 min-h-[600px] flex flex-col justify-between">
        {/* Header with back button */}
        {speakingTest.currentPart !== "idle" && speakingTest.currentPart !== "REVIEW_ALL" && (
          <div className="mb-4">
            <button
              onClick={() => navigate(`/courses/${courseCode}/overview`)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Quay lại khóa học
            </button>
          </div>
        )}

        {/* Main content */}
        <div className="flex-grow flex items-center justify-center">
          {renderMainContent()}
        </div>

        {/* Recording controls */}
        {showControls && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* Transcript display */}
            <div className="h-12 flex items-center justify-center">
              {renderTranscript()}
            </div>

            {/* Error message */}
            {speakingTest.error && recorder.status !== "transcribing" && (
              <div className="text-center text-red-600 mb-4 p-3 bg-red-50 rounded-lg">
                {speakingTest.error}
              </div>
            )}

            {/* Control buttons */}
            <RecordingControls
              isRecording={recorder.isRecording}
              status={recorder.status}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onNext={speakingTest.nextPart}
              onReplayQuestion={showReplayButton ? handleReplayQuestion : undefined}
              canProceed={speakingTest.canProceed()}
              showReplayButton={showReplayButton}
            />
          </div>
        )}
      </div>
    </div>
  );
}
