import api from "@/lib/axios";
import type { QuestionListResponse } from "@/types/question";

const BASE_URL = "/questions";

export const questionService = {
  async getByLessonPartId(lessonPartId: number): Promise<QuestionListResponse> {
    const res = await api.get(`${BASE_URL}/by-lesson-part/${lessonPartId}`);
    return res.data;
  },
};
