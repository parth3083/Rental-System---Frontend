import axios from "axios";

const API_URL = "http://localhost:8000/api/users";

export interface User {
  id: string;
  name: string; // Combined name from server
  email: string;
  role: "ADMIN" | "VENDOR" | "CUSTOMER";
  companyName?: string | null;
  gstin?: string | null; // Server returns gstin, not gstNumber
  address?: string | null;
  city?: string | null;
  pincode?: string | null;
  // Legacy support if needed from other parts of app
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserPayload {
  name: string; // Server expects name
  companyName?: string;
  gstin?: string; // Added to match backend schema
  address?: string;
  city?: string;
  pincode?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

const getAuthHeader = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
};

export const userService = {
  async getUserDetails() {
    try {
      // The server returns nested data: { success: true, count: X, data: User }
      // But looking at user.controller.ts: getUserDetails returns { success: true, message: "...", data: UserDetailsResponse }
      const response = await axios.get<UserResponse>(`${API_URL}/me`, {
        headers: getAuthHeader(),
      });
      return response.data; // Returns { success, message, data: User }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch user details",
        );
      }
      throw error;
    }
  },

  async getUserById(userId: string) {
    try {
      const response = await axios.get<UserResponse>(`${API_URL}/${userId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch user details",
        );
      }
      throw error;
    }
  },

  async updateUserDetails(data: UpdateUserPayload) {
    try {
      const response = await axios.patch<UserResponse>(`${API_URL}/me`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update user details",
        );
      }
      throw error;
    }
  },

  async changePassword(data: ChangePasswordPayload) {
    try {
      const response = await axios.post(`${API_URL}/change-password`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to change password",
        );
      }
      throw error;
    }
  },

  async getAllUsers(page = 1, limit = 10, search?: string) {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;

      const response = await axios.get(`${API_URL}`, {
        params,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to fetch users");
      }
      throw error;
    }
  },
};
