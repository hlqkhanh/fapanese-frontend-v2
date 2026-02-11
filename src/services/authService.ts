import api from "@/lib/axios";

export const authService = {
    signUp: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        role: string,
        expertise: string,
        bio: string,
        dateOfBirth: string,
        campus: string
    ) => {
        const res = await api.post(
            "/users/register",
            { email, password, firstName, lastName, role, expertise, bio, dateOfBirth, campus },
            { withCredentials: true })
        return res.data
    },


    login: async (email: string, password: string) => {
        const res = await api.post("auth/login", {email, password}, {withCredentials: true});
        return res.data
    },

    sendOTP: async (email: string) => {
        const res = await api.post("auth/send-otp", {email}, {withCredentials: true});
        return res.data
    },

    verifyOTP: async (email: string, otp: string) => {
        const res = await api.post("auth/verify-otp", {email, otp}, {withCredentials: true});
        return res.data
    },

    fetchMe: async () => {
        const res = await api.get("users/profile", {withCredentials: true});
        return res.data.result
    },

    refresh: async () => {
        const res = await api.post("auth/refresh", {withCredentials: true});
        return res.data.result?.accessToken
    },

    logout: async () => {
        const res = await api.post("auth/logout", {withCredentials: true});
        return res.data.message
    },

    loginGoogle: async (token: string) => {
        const res = await api.post(
            "/auth/login/google", 
            { token }, 
            { withCredentials: true }
        );
        return res.data;
    },
}