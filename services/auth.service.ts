import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "VENDOR" | "CUSTOMER";
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BaseRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
}

export interface CustomerRegisterPayload extends BaseRegisterPayload {
  role: "CUSTOMER";
}

export interface VendorRegisterPayload extends BaseRegisterPayload {
  role: "VENDOR";
  companyName: string;
  productCategory: string;
  gstNumber: string;
}

export interface AdminRegisterPayload extends BaseRegisterPayload {
  role: "ADMIN";
}

export type RegisterPayload =
  | CustomerRegisterPayload
  | VendorRegisterPayload
  | AdminRegisterPayload;

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  async register(data: RegisterPayload) {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/register`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw error;
    }
  },

  async login(data: LoginPayload) {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw error;
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await axios.post<MessageResponse>(
        `${API_URL}/forgot-password`,
        { email },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to send reset code",
        );
      }
      throw error;
    }
  },

  async verifyResetCode(email: string, code: string) {
    try {
      const response = await axios.post<MessageResponse>(
        `${API_URL}/verify-reset-code`,
        { email, code },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Invalid verification code",
        );
      }
      throw error;
    }
  },

  async resetPassword(data: ResetPasswordPayload) {
    try {
      const response = await axios.post<MessageResponse>(
        `${API_URL}/reset-password`,
        data,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to reset password",
        );
      }
      throw error;
    }
  },
};
