import api from "@/lib/axios";
import type { LessonPartListResponse } from "@/types/lessonPart";

const BASE_URL = "/lesson-parts";

export const lessonPartService = {
  async getByLessonId(lessonId: number): Promise<LessonPartListResponse> {
    const res = await api.get(`${BASE_URL}/by-lesson/${lessonId}`);
    return res.data;
  },
};
