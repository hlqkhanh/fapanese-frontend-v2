import api from "@/lib/axios";
import type { GrammarListResponse } from "@/types/grammar";

const BASE_URL = "/grammars";

export const grammarService = {
  async getByLessonPartId(lessonPartId: number): Promise<GrammarListResponse> {
    const res = await api.get(`${BASE_URL}/by-lesson-part/${lessonPartId}`);
    return res.data;
  },
};
