import api from "@/lib/axios";
import type { ApiResponse } from "@/types/common";
import type { LecturerPayload, LecturerListResponse, LecturerDetailResponse, LecturerSearchParams, Lecturer } from "@/types/lecturer";


const BASE_URL = "/lecturers";

export const lecturerService = {
  async fetchAll(params?: LecturerSearchParams): Promise<LecturerListResponse> {
    const res = await api.get(BASE_URL, { params });
    return res.data;
  },

  async fetchByEmail(email: string): Promise<LecturerDetailResponse> {
    const res = await api.get(`${BASE_URL}/${email}`);
    return res.data;
  },

  async create(data: LecturerPayload): Promise<LecturerDetailResponse> {
    const res = await api.post(BASE_URL, data);
    return res.data;
  },

  async update(email: string, data: LecturerPayload): Promise<LecturerDetailResponse> {
    const res = await api.put(`${BASE_URL}/${email}`, data);
    return res.data;
  },

  async delete(email: string): Promise<ApiResponse<object>> {
    const res = await api.delete(`${BASE_URL}/${email}`);
    return res.data;
  },

  async approve(id: string): Promise<LecturerDetailResponse> {
    const res = await api.put(`${BASE_URL}/approve-teacher/${id}`);
    return res.data;
  },

  async reject(id: string): Promise<LecturerDetailResponse> {
    const res = await api.put(`${BASE_URL}/reject-teacher/${id}`);
    return res.data;
  },

  async fetchPending(): Promise<ApiResponse<Lecturer[]>> {
    const res = await api.get(`${BASE_URL}/pending-teachers`);
    return res.data;
  }
};