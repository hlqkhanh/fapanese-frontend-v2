import api from "@/lib/axios";

export const fileService = {
  async uploadFile(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file); // Tên field khớp với Backend yêu cầu

    const res = await api.post(`/files/upload?folder=${folder}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Trả về link ảnh từ result (string)
    return res.data.result;
  },

  async deleteFileByUrl(fileUrl: string): Promise<string> {
    const res = await api.delete(`/files/delete-by-url`, {
      params: { fileUrl }
    });
    return res.data;
  }
};