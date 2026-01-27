import api from "@/lib/axios";
import type { 
  StudentPayload, 
  StudentListResponse, 
  StudentDetailResponse, 
  StudentDeleteResponse,
  StudentUploadResponse
} from "@/types/student";

const BASE_URL = "/students";

export const studentService = {
  async fetchAll(): Promise<StudentListResponse> {
    const res = await api.get(BASE_URL);
    return res.data;
  },

  async fetchByEmail(email: string): Promise<StudentDetailResponse> {
    const res = await api.get(`${BASE_URL}/${email}`);
    return res.data;
  },

  async create(data: StudentPayload): Promise<StudentDetailResponse> {
    const res = await api.post(BASE_URL, data);
    return res.data;
  },

  async update(email: string, data: StudentPayload): Promise<StudentDetailResponse> {
    // API document: PUT /api/students/{email}
    const res = await api.put(`${BASE_URL}/${email}`, data);
    return res.data;
  },

  async delete(email: string): Promise<StudentDeleteResponse> {
    const res = await api.delete(`${BASE_URL}/${email}`);
    return res.data;
  },

  async uploadExcel(file: File): Promise<StudentUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(`${BASE_URL}/upload-excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
};