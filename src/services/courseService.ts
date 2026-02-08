import api from "@/lib/axios";
import type { CoursePayload, CourseListResponse, CourseDetailResponse, CourseDeleteResponse } from "@/types/course";

const BASE_URL = "/courses";

export const courseService = {
  async fetchAll(): Promise<CourseListResponse> {
    const res = await api.get(BASE_URL);
    return res.data;
  },

  async fetchById(id: number): Promise<CourseDetailResponse> {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  async create(data: CoursePayload): Promise<CourseDetailResponse> {
    const res = await api.post(BASE_URL, data);
    return res.data;
  },

  async update(id: number, data: CoursePayload): Promise<CourseDetailResponse> {
    const res = await api.put(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<CourseDeleteResponse> {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
  },

  // Alias for fetchById (for consistency with other services)
  async getById(id: number): Promise<CourseDetailResponse> {
    return this.fetchById(id);
  },

  // Get course by code (for overview navigation)
  async getByCode(code: string): Promise<CourseDetailResponse> {
    const res = await api.get(`${BASE_URL}/code/${code}`);
    return res.data;
  },
};