import { useState, useEffect } from "react";
import { speakingTestService } from "@/services/speakingTestService";
import type {
  ExamPart,
  GeneratedTestResponse,
  Transcripts,
  Recordings,
  GradingFeedback,
  GradingPayload,
} from "@/types/speakingTest";

/**
 * Main hook for managing speaking test flow
 * Handles test generation, transcripts, recordings, and grading
 */
export function useSpeakingTest(overviewPartId: number) {
  const [currentPart, setCurrentPart] = useState<ExamPart>("idle");
  const [testData, setTestData] = useState<GeneratedTestResponse | null>(null);
  const [transcripts, setTranscripts] = useState<Transcripts>({
    passage: "",
    picture: "",
    q1: "",
    q2: "",
  });
  const [recordings, setRecordings] = useState<Recordings>({
    passage: "",
    picture: "",
    q1: "",
    q2: "",
  });
  const [feedback, setFeedback] = useState<GradingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cleanup recordings on unmount to prevent memory leaks
  // NOTE: Disabled to prevent revoking URLs while audio is playing
  // Browser will clean up on page unload
  useEffect(() => {
    return () => {
      // Cleanup only when component truly unmounts (page navigation)
      // Not on every state change
      const urlsToClean = Object.values(recordings);
      if (currentPart === "idle") {
        urlsToClean.forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
      }
    };
  }, []); // Empty deps - only on unmount

  /**
   * Start the speaking test
   * Fetches test data from API
   */
  const startTest = async () => {
    setCurrentPart("loadingTest");
    setError(null);
    setTranscripts({ passage: "", picture: "", q1: "", q2: "" });
    setRecordings({ passage: "", picture: "", q1: "", q2: "" });
    setFeedback(null);

    try {
      const data = await speakingTestService.generateTest(overviewPartId);
      setTestData(data);
      setCurrentPart("passage");
    } catch (err: any) {
      setError(err.message || "Không thể tải đề thi");
      setCurrentPart("idle");
    }
  };

  /**
   * Save transcript and recording URL for a specific part
   */
  const saveTranscript = (
    part: keyof Transcripts,
    text: string,
    audioUrl: string
  ) => {
    setTranscripts((prev) => ({ ...prev, [part]: text }));
    setRecordings((prev) => ({ ...prev, [part]: audioUrl }));
    setError(null);
  };

  /**
   * Navigate to next part of the test
   */
  const nextPart = () => {
    if (currentPart === "passage") setCurrentPart("picture");
    else if (currentPart === "picture") setCurrentPart("question1");
    else if (currentPart === "question1") setCurrentPart("question2");
    else if (currentPart === "question2") submitForGrading();
  };

  /**
   * Submit all answers for AI grading
   */
  const submitForGrading = async () => {
    if (!testData) {
      setError("Không có dữ liệu bài thi");
      return;
    }

    setCurrentPart("grading");
    setError(null);

    const payload: GradingPayload = {
      passageTranscript: transcripts.passage,
      passageOriginal: testData.passagePart.passage,
      pictureQuestion: testData.picturePart.questions[0].question,
      pictureAnswerTranscript: transcripts.picture,
      pictureAnswerSample: testData.picturePart.questions[0].answer,
      q1Question: testData.questionPart.questions[0].question,
      q1AnswerTranscript: transcripts.q1,
      q1AnswerSample: testData.questionPart.questions[0].answer,
      q2Question: testData.questionPart.questions[1].question,
      q2AnswerTranscript: transcripts.q2,
      q2AnswerSample: testData.questionPart.questions[1].answer,
    };

    try {
      const result = await speakingTestService.gradeSpeakingTest(payload);
      setFeedback(result);
      setCurrentPart("REVIEW_ALL");
    } catch (err: any) {
      setError(err.message || "Lỗi chấm điểm");
      setCurrentPart("grading");
    }
  };

  /**
   * Check if can proceed to next part
   * User must complete current part before moving on
   */
  const canProceed = (): boolean => {
    if (currentPart === "passage" && !transcripts.passage) return false;
    if (currentPart === "picture" && !transcripts.picture) return false;
    if (currentPart === "question1" && !transcripts.q1) return false;
    if (currentPart === "question2" && !transcripts.q2) return false;
    return true;
  };

  return {
    currentPart,
    setCurrentPart,
    testData,
    transcripts,
    recordings,
    feedback,
    error,
    startTest,
    saveTranscript,
    nextPart,
    canProceed,
  };
}
