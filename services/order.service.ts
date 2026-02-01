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

  async createInvoice(orderId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/invoice`,
        { orderId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to create invoice",
        );
      }
      throw error;
    }
  },

  async getInvoicePdf(invoiceId: string) {
    try {
      const response = await axios.get(`${API_URL}/invoice/${invoiceId}`, {
        headers: getAuthHeader(),
        // responseType: 'blob', // Removed as backend returns JSON
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Try to read the blob error message if possible
        throw new Error("Failed to download invoice PDF");
      }
      throw error;
    }
  },

  async getInvoices(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/invoice`, {
        params: { page, limit },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch invoices",
        );
      }
      throw error;
    }
  },

  async updateInvoiceStatus(invoiceId: string, status: string) {
    try {
      const response = await axios.patch(
        `${API_URL}/invoice/${invoiceId}/status`,
        { status: status },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      // Fallback for some APIs if patch isn't supported or different route
      // Often status updates might be direct put or patch on the resource
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to update invoice status",
        );
      }
      throw error;
    }
  },
};
