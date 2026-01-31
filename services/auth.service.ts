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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface BaseRegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "VENDOR";
}

export interface CustomerRegisterPayload extends BaseRegisterPayload {
  role: "CUSTOMER";
}

export interface VendorRegisterPayload extends BaseRegisterPayload {
  role: "VENDOR";
  companyName: string;
  gstNumber: string;
}

export type RegisterPayload = CustomerRegisterPayload | VendorRegisterPayload;

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
};
