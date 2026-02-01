import axios from "axios";

const API_URL = "http://localhost:8000/api/sales-orders";

export interface OrderDetail {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  totalDepositAmount: number;
  start_date: string | null;
  end_date: string | null;
  product: {
    name: string;
    imageUrl: string;
  };
}

export interface BackendOrder {
  id: string;
  customerId: string;
  vendorId: string;
  status: string;
  paymentPlan: string;
  totalOrderValue: number;
  isService: boolean;
  createdAt: string;
  details: OrderDetail[];
  vendor: {
    name: string;
    email: string;
    companyName: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: BackendOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

export const orderService = {
  async getCustomerOrders(page = 1, limit = 10) {
    try {
      const response = await axios.get<OrdersResponse>(`${API_URL}/customer`, {
        params: { page, limit },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch orders",
        );
      }
      throw error;
    }
  },

  async getVendorOrders(page = 1, limit = 10) {
    try {
      const response = await axios.get<OrdersResponse>(`${API_URL}/vendor`, {
        params: { page, limit },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch orders",
        );
      }
      throw error;
    }
  },

  async getAdminOrders(page = 1, limit = 10) {
    try {
      const response = await axios.get<OrdersResponse>(`${API_URL}/admin`, {
        params: { page, limit },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch orders",
        );
      }
      throw error;
    }
  },

  async getOrderById(orderId: string) {
    try {
      const response = await axios.get(`${API_URL}/${orderId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch order details",
        );
      }
      throw error;
    }
  },
};
