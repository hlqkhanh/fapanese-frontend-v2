import api from "@/lib/axios";
import type {
  GeneratedTestResponse,
  GradingPayload,
  GradingFeedback,
  ApiResponse,
  STTResponse,
} from "@/types/speakingTest";

const BASE_URL = "/speaking-exams";
const INTERVIEW_URL = "/interview";

/**
 * Generate random speaking test for the given overview part
 * @param overviewPartId - ID of the overview part (Speaking section)
 * @returns Test data with passage, picture, and question parts
 */
async function generateTest(
  overviewPartId: number
): Promise<GeneratedTestResponse> {
  const res = await api.get<ApiResponse<GeneratedTestResponse>>(
    `${BASE_URL}/generate-test/${overviewPartId}`
  );

  if (res.data.code !== 1000) {
    throw new Error(res.data.message || "Lỗi khi lấy đề thi");
  }

  return res.data.result;
}

/**
 * Transcribe audio to text using Speech-to-Text API
 * @param audioBlob - Recorded audio blob
 * @returns Transcribed text
 */
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  // Note: axios auto-sets Content-Type for FormData
  const res = await api.post<STTResponse>(`${INTERVIEW_URL}/stt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.text || "";
}

/**
 * Grade speaking test with AI
 * @param payload - All transcripts and original content
 * @returns AI feedback for each part and overall
 */
async function gradeSpeakingTest(
  payload: GradingPayload
): Promise<GradingFeedback> {
  const res = await api.post<ApiResponse<GradingFeedback>>(
    `${INTERVIEW_URL}/grade-speaking-test`,
    payload
  );

  if (res.data.code !== 1000) {
    throw new Error(res.data.message || "Lỗi khi chấm điểm");
  }

  return res.data.result;
}

/**
 * Convert text to speech using Text-to-Speech API
 * @param text - Text to convert (Japanese)
 * @returns Audio blob
 */
async function textToSpeech(text: string): Promise<Blob> {
  const res = await api.post(
    `${INTERVIEW_URL}/tts/1`,
    { text },
    { responseType: "blob" }
  );

  return res.data;
}

export const speakingTestService = {
  generateTest,
  transcribeAudio,
  gradeSpeakingTest,
  textToSpeech,
};
