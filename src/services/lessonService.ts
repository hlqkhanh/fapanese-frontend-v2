import api from "@/lib/axios";
import type { LessonResponse, Lesson } from "@/types/lesson";
import type { ApiResponse } from "@/types/common";

const BASE_URL = "/lessons";

export const lessonService = {
  async getById(lessonId: number): Promise<LessonResponse> {
    const res = await api.get(`${BASE_URL}/${lessonId}`);
    return res.data;
  },

  // Use courseCode (string) according to API spec
  // Note: This endpoint returns Lesson[] directly, not wrapped in ApiResponse
  async getByCourseCode(courseCode: string): Promise<Lesson[]> {
    const res = await api.get(`${BASE_URL}/by-course/${courseCode}`);
    return res.data;
  },

  // Deprecated: kept for backward compatibility, use getByCourseCode instead
  async getByCourseId(courseId: number): Promise<ApiResponse<Lesson[]>> {
    const res = await api.get(`${BASE_URL}/course/${courseId}`);
    return res.data;
  },
};
