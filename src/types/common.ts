export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PaginatedResult<T> {
    content: T[];          // Danh sách dữ liệu chính
    totalPages: number;    // Tổng số trang
    totalElements: number; // Tổng số bản ghi
    size: number;
    number: number;        // Trang hiện tại
}