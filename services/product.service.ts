import axios from "axios";

const API_URL = "http://localhost:8000/api";

export interface RentalDuration {
  value: number;
  unit: "Hour" | "Day" | "Week" | "Month";
}

export interface ProductFilters {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  brands?: string[];
  colors?: string[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  duration?: RentalDuration;
}

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  color: string;
  priceLabel: string;
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
  isAvailable: boolean;
}

export interface ProductDetails extends ProductSummary {
  description: string;
  hourlyPrice: number | null;
  dailyPrice: number;
  weeklyPrice: number | null;
  monthlyPrice: number | null;
  taxPercentage: number;
  securityDeposit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters.pageNumber)
      params.append("pageNumber", filters.pageNumber.toString());
    if (filters.pageSize)
      params.append("pageSize", filters.pageSize.toString());
    if (filters.categoryId)
      params.append("categoryId", filters.categoryId.toString());
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());

    if (filters.brands && filters.brands.length > 0) {
      filters.brands.forEach((brand) => params.append("brands", brand));
    }

    if (filters.colors && filters.colors.length > 0) {
      filters.colors.forEach((color) => params.append("colors", color));
    }

    if (filters.duration) {
      params.append("duration", JSON.stringify(filters.duration));
    }

    try {
      const response = await axios.get<PaginatedResponse<ProductSummary>>(
        `${API_URL}/products?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch products",
        );
      }
      throw error;
    }
  },

  async getProductById(id: string) {
    try {
      const response = await axios.get<ApiResponse<ProductDetails>>(
        `${API_URL}/products/${id}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch product",
        );
      }
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await axios.get<ApiResponse<Category[]>>(
        `${API_URL}/categories`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch categories",
        );
      }
      throw error;
    }
  },

  async getBrands() {
    try {
      const response = await axios.get<ApiResponse<string[]>>(
        `${API_URL}/products/brands`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch brands",
        );
      }
      throw error;
    }
  },

  async getColors() {
    try {
      const response = await axios.get<ApiResponse<string[]>>(
        `${API_URL}/products/colors`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch colors",
        );
      }
      throw error;
    }
  },

  async getPriceRange() {
    try {
      const response = await axios.get<
        ApiResponse<{ min: number; max: number }>
      >(`${API_URL}/products/price-range`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch price range",
        );
      }
      throw error;
    }
  },
};
