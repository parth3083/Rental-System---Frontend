import axios from "axios";

const API_URL = "http://localhost:8000/api/cart";

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  startDate?: string;
  endDate?: string;
  isService?: boolean;
}

export interface CartItem {
  id: string; // Cart Item ID (usually different from Product ID in DB structure, but depends on backend)
  productId: string;
  userId: string;
  quantity: number;
  startDate: string | null;
  endDate: string | null;
  isService: boolean;
  product?: {
    name: string;
    imageUrl: string | null;
    dailyPrice: number;
    hourlyPrice: number | null;
    monthlyPrice: number | null;
    weeklyPrice: number | null;
  };
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: CartItem[];
}

export interface AddToCartResponse {
  success: boolean;
  message?: string;
  data: CartItem;
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

export const cartService = {
  async getCart() {
    try {
      const response = await axios.get<CartResponse>(API_URL, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch cart items",
        );
      }
      throw error;
    }
  },

  async addToCart(payload: AddToCartPayload) {
    try {
      const response = await axios.post<AddToCartResponse>(API_URL, payload, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to add to cart");
      }
      throw error;
    }
  },

  async removeFromCart(productId: string) {
    try {
      const response = await axios.delete<{
        success: boolean;
        message: string;
      }>(`${API_URL}/${productId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to remove from cart",
        );
      }
      throw error;
    }
  },

  async createSalesOrder() {
    try {
      const response = await axios.post<{
        success: boolean;
        message: string;
        data: any[]; // Using any[] for now as we map it in the component
      }>(
        "http://localhost:8000/api/sales-orders",
        {}, // Empty body matches backend requirement
        {
          headers: getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to create sales order",
        );
      }
      throw error;
    }
  },
};
