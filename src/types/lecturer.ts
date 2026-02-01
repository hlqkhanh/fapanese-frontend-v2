import type { ApiResponse, PaginatedResult } from "./common";
import { UserStatus } from "./userStatus";

export interface Lecturer {
  id: string;
  email: string;
  role: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  avtUrl: string;
  campus: string;
  expertise: string;
  bio: string;
  status: UserStatus;
}

export interface LecturerPayload {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  bio: string;
  expertise: string;
  status?: UserStatus;
}

export interface LecturerSearchParams {
  page?: number;
  size?: number;
  keyword?: string;
  campus?: string;
  status?: number;
  expertise?: string;
  sortDir?: string;
  sortBy?: string;
}

export type LecturerListResponse = ApiResponse<PaginatedResult<Lecturer>>;
export type LecturerDetailResponse = ApiResponse<Lecturer>;