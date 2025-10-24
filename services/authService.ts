// src/services/auth.service.ts
import axiosClient from "@/utils/axiosClient";

export interface LoginData {
  identifier: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  role: 'admin' | 'stock_manager' | 'cashier';
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    lastLogin: string;
    mustChangePassword: boolean;
  };
  token?: string;
  message?: string;
  requirePasswordChange?: boolean;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },

  async signup(data: SignupData) {
    const response = await axiosClient.post('/auth/signup', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData) {
    const response = await axiosClient.post('/auth/change-password', data);
    return response.data;
  },

  async getMe() {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },
};
