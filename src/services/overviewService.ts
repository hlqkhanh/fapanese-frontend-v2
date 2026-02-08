import api from "@/lib/axios";
import type {
  Overview,
  OverviewPart,
  SpeakingGroup,
  Exam,
  UserAnswer,
  ExamSubmitResult,
  OverviewPartsResponse,
  SpeakingGroupsResponse,
  ExamsResponse,
  ExamSubmitResponse,
  AIExplanationResponse,
} from "@/types/overview";
import type { ApiResponse } from "@/types/common";

/**
 * Overview Service
 * API endpoints for overview (ôn luyện) feature
 */
export const overviewService = {
  /**
   * Get overview by course code
   * Backend returns List, we take first element
   */
  async getByCourseCode(courseCode: string): Promise<Overview | null> {
    try {
      const res = await api.get<ApiResponse<Overview[]>>(`/overviews/by-course/${courseCode}`);
      const overviews = res.data.result;
      // Return first overview if exists
      return overviews && overviews.length > 0 ? overviews[0] : null;
    } catch (error: any) {
      // Return null if overview doesn't exist for this course
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Get overview parts by overview ID
   */
  async getPartsByOverviewId(overviewId: number): Promise<OverviewPart[]> {
    const res = await api.get<OverviewPartsResponse>(`/overview-parts/by-overview/${overviewId}`);
    return res.data.result;
  },

  /**
   * Get speaking exams by part ID
   */
  async getSpeakingByPartId(partId: number): Promise<SpeakingGroup[]> {
    const res = await api.get<SpeakingGroupsResponse>(`/speaking-exams/by-overview-part/${partId}`);
    return res.data.result;
  },

  /**
   * Get middle exam by part ID
   */
  async getMiddleExamByPartId(partId: number): Promise<Exam[]> {
    const res = await api.get<ExamsResponse>(`/middle-exams/by-overview-part/${partId}`);
    return res.data.result;
  },

  /**
   * Get final exam by part ID
   */
  async getFinalExamByPartId(partId: number): Promise<Exam[]> {
    const res = await api.get<ExamsResponse>(`/final-exams/by-overview-part/${partId}`);
    return res.data.result;
  },

  /**
   * Submit exam answers and get results
   */
  async submitExam(answers: UserAnswer[]): Promise<ExamSubmitResult> {
    const res = await api.post<ExamSubmitResponse>("/exam/submit", answers);
    return res.data.result;
  },

  /**
   * Get AI explanation for a question
   */
  async getAIExplanation(payload: {
    question: string;
    options: string;
    correctAnswer: string;
  }): Promise<string> {
    const res = await api.post<AIExplanationResponse>(
      "/interview/explain-exam",
      payload
    );
    return res.data.result;
  },
};
