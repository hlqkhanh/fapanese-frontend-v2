import type { UserStatus } from "./userStatus";

export interface LoginUser {
    id: string;
    email: string;

    status: UserStatus;

    firstName: string;
    lastName: string;
    avtUrl?: string | null; // Có thể null
    dateOfBirth: string | null;    // LocalDate trả về "YYYY-MM-DD"

    campus: string | null;
    expertise: string | null;
    bio?: string | null;

    role: string;
}