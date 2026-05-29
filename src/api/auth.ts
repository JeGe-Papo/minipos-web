import { http } from "./http";

export type AuthResponse = {
    access_token: string;
    user: {
        id: number;
        email: string;
        fullName: string;
        social_url?: string; // 👈 Agregado aquí (opcional con ?)
    }
};

export type LoginDto = {
    email: string;
    password: string;
};

export type RegisterDto = {
    fullName: string;
    email: string;
    password: string;
    social_url?: string; // 👈 Agregado aquí también para que permita enviarlo
};

export const authApi = {
    login: (dto: LoginDto) => http<AuthResponse>("/auth/login",
        { method: "POST", body: JSON.stringify(dto) }),
    register: (dto: RegisterDto) => http<AuthResponse>("/auth/register",
        { method: "POST", body: JSON.stringify(dto) }),
};