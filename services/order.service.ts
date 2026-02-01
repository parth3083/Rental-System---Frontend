import axios from "axios";

const API_URL = "http://localhost:8000/api/sales-orders";

export interface OrderDetail {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  totalDepositAmount?: number;
  start_date: string | null;
  end_date: string | null;
  product: {
    name: string;
    imageUrl: string;
  };
}

export interface BackendOrder {
  id: string;
  vendorId?: string; // Optional as prompt JSON didn't show it at root, but response mapped it
  status: string;
  payment_plan: string;
  total_order_value: number;
  is_service: boolean;
  created_at: string;
  payment_amount_pending: number;
  invoice_number: string | null;
  message: string | null;
  product_names: string[];
  details?: OrderDetail[];
  vendor: {
    id: string;
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

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await axios.patch(
        `${API_URL}/${orderId}/status`,
        { status },
        { headers: getAuthHeader() },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update order status",
        );
      }
      throw error;
    }
  },

  async acceptQuotation(orderId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/accept/${orderId}`,
        {},
        { headers: getAuthHeader() },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to accept quotation",
        );
      }
      throw error;
    }
  },
};
