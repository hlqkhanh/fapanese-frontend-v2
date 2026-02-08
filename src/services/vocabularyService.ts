import api from "@/lib/axios";
import type { Vocabulary } from "@/types/vocabulary";

const BASE_URL = "/vocabularies";

export const vocabularyService = {
  async getByLessonPartId(lessonPartId: number): Promise<Vocabulary[]> {
    const res = await api.get(`${BASE_URL}/by-lesson-part/${lessonPartId}`);
    return res.data;
  },
};
