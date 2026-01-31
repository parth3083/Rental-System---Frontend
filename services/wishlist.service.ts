import axios from "axios";

const API_URL = "http://localhost:8000/api/wishlist";

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    inventoryType: string;
    dailyPrice: number;
    weeklyPrice?: number | null;
    monthlyPrice?: number | null;
    hourlyPrice?: number | null;
    stock: number;
    imageUrl?: string | null;
  };
}

export interface WishlistResponse {
  success: boolean;
  message?: string;
  data: WishlistItem[];
}

export interface AddToWishlistResponse {
  success: boolean;
  message?: string;
  data: WishlistItem;
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

export const wishlistService = {
  async getWishlist() {
    try {
      const response = await axios.get<WishlistResponse>(API_URL, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch wishlist items",
        );
      }
      throw error;
    }
  },

  async addToWishlist(productId: string) {
    try {
      const response = await axios.post<AddToWishlistResponse>(
        API_URL,
        { productId },
        {
          headers: getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to add to wishlist",
        );
      }
      throw error;
    }
  },

  async removeFromWishlist(productId: string) {
    try {
      const response = await axios.delete<{
        success: boolean;
        message: string;
      }>(`${API_URL}/${productId}`, {
        headers: getAuthHeader(),
        data: { productId },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to remove from wishlist",
        );
      }
      throw error;
    }
  },
};
