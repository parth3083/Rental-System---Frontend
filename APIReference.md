# Rental System API Documentation

## Base URL
```
http://localhost:{PORT}/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Table of Contents
- [Authentication](#authentication-endpoints)
- [Users](#user-endpoints)
- [Products](#product-endpoints)
- [Categories](#category-endpoints)
- [Cart](#cart-endpoints)
- [Wishlist](#wishlist-endpoints)
- [Sales Orders](#sales-order-endpoints)
- [Chat](#chat-endpoints)

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user (Customer or Vendor).

**Request Body:**

*Customer Registration:*
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

*Vendor Registration:*
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "password123",
  "role": "VENDOR",
  "companyName": "ABC Corp",
  "productCategory": "Electronics",
  "gstNumber": "22AAAAA0000A1Z5"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clxyz123456789",
      "username": "John Doe",
      "email": "john.doe@example.com",
      "role": "CUSTOMER"
    },
    "token": "<JWT_TOKEN>"
  }
}
```

| Status | Description |
|--------|-------------|
| 201 | User registered successfully |
| 400 | Validation error or user already exists |
| 500 | Internal server error |

---

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clxyz123456789",
      "username": "John Doe",
      "email": "john.doe@example.com",
      "role": "CUSTOMER"
    },
    "token": "<JWT_TOKEN>"
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Login successful |
| 400 | Validation error |
| 401 | Invalid credentials |
| 500 | Internal server error |

---

### GET /api/auth/profile
Get current user profile.

**Authentication:** Required (Bearer Token)

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "clxyz123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "CUSTOMER"
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Profile retrieved successfully |
| 401 | Unauthorized |
| 404 | User not found |
| 500 | Internal server error |

---

### GET /api/auth/users
Get all users (Admin only).

**Authentication:** Required (Bearer Token)  
**Authorization:** Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...]
}
```

| Status | Description |
|--------|-------------|
| 200 | Users retrieved successfully |
| 401 | Unauthorized |
| 403 | Forbidden - Admin access required |
| 500 | Internal server error |

---

### POST /api/auth/forgot-password
Request password reset. Sends a 6-digit verification code to email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent to email"
}
```

| Status | Description |
|--------|-------------|
| 200 | Verification code sent successfully |
| 400 | Validation error |
| 500 | Internal server error |

---

### POST /api/auth/verify-reset-code
Verify password reset code.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Code verified successfully"
}
```

| Status | Description |
|--------|-------------|
| 200 | Code verification result |
| 400 | Validation error or invalid code |
| 500 | Internal server error |

---

### POST /api/auth/reset-password
Reset password after code verification.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "code": "123456",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

| Status | Description |
|--------|-------------|
| 200 | Password reset successfully |
| 400 | Validation error or invalid code |
| 500 | Internal server error |

---

## User Endpoints

### GET /api/users
Get all users (Admin/Vendor only).

**Authentication:** Required (Bearer Token)  
**Authorization:** Admin (all users) or Vendor (customers only)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| search | string | - | Search term for name or email |
| page | integer | 1 | Page number |
| limit | integer | 10 | Number of items per page |

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [...],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Users retrieved successfully |
| 401 | Unauthorized |
| 403 | Forbidden - Customers cannot access |
| 500 | Internal server error |

---

### GET /api/users/me
Get current user details.

**Authentication:** Required (Bearer Token)

**Response (200):**
```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "data": {
    "id": "clxyz123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "CUSTOMER",
    "address": "123 Main Street",
    "city": "Mumbai",
    "pincode": "400001",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | User details retrieved successfully |
| 401 | Unauthorized |
| 404 | User not found |
| 500 | Internal server error |

---

### PATCH /api/users/me
Update current user details.

**Authentication:** Required (Bearer Token)

**Request Body:**

*Customer Update:*
```json
{
  "name": "John Doe",
  "address": "123 Main Street",
  "city": "Mumbai",
  "pincode": "400001"
}
```

*Vendor Update:*
```json
{
  "name": "Jane Smith",
  "address": "456 Business Park",
  "city": "Delhi",
  "pincode": "110001",
  "companyName": "ABC Corp Pvt Ltd",
  "gstin": "22AAAAA0000A1Z5"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User details updated successfully",
  "data": {...}
}
```

| Status | Description |
|--------|-------------|
| 200 | User details updated successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden - Cannot update vendor fields as non-vendor |
| 404 | User not found |
| 500 | Internal server error |

---

### POST /api/users/change-password
Change password for authenticated user.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

| Status | Description |
|--------|-------------|
| 200 | Password changed successfully |
| 400 | Validation error or current password incorrect |
| 401 | Unauthorized |
| 404 | User not found |
| 500 | Internal server error |

---

## Product Endpoints

### GET /api/products
Get products with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| searchTerm | string | - | Search term for product name |
| pageNumber | integer | 1 | Page number |
| pageSize | integer | 10 | Number of items per page |
| brands | string[] | - | Filter by brand names |
| colors | string[] | - | Filter by colors |
| categoryId | integer | - | Filter by category ID |
| minPrice | number | - | Minimum price filter |
| maxPrice | number | - | Maximum price filter |
| duration | object | - | Duration filter `{value: number, unit: "Hour"|"Day"|"Week"|"Month"}` |

**Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "items": [
      {
        "id": "clxyz123456789",
        "name": "Camera DSLR",
        "brand": "Canon",
        "color": "Black",
        "imageUrl": "https://...",
        "description": "Professional camera",
        "dailyPrice": 500,
        "hourlyPrice": 100,
        "weeklyPrice": 3000,
        "monthlyPrice": 10000,
        "discountPercentage": 10,
        "securityDeposit": 5000,
        "taxPercentage": 18,
        "categoryId": 1,
        "isAvailable": true
      }
    ],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 10
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Products retrieved successfully |
| 400 | Validation error |
| 500 | Internal server error |

---

### GET /api/products/:id
Get product details by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Product details retrieved successfully",
  "data": {
    "id": "clxyz123456789",
    "name": "Camera DSLR",
    "brand": "Canon",
    "color": "Black",
    "imageUrl": "https://...",
    "description": "Professional camera for rent",
    "dailyPrice": 500,
    "hourlyPrice": 100,
    "weeklyPrice": 3000,
    "monthlyPrice": 10000,
    "discountPercentage": 10,
    "securityDeposit": 5000,
    "taxPercentage": 18,
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Electronics"
    },
    "vendor": {
      "id": "vendor123",
      "name": "ABC Rentals"
    },
    "isAvailable": true,
    "isPublished": true
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Product details retrieved successfully |
| 404 | Product not found |
| 500 | Internal server error |

---

### POST /api/products
Create a new product.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor or Admin

**Request Body:**
```json
{
  "name": "Camera DSLR",
  "brand": "Canon",
  "color": "Black",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Professional camera for rent",
  "dailyPrice": 500,
  "hourlyPrice": 100,
  "weeklyPrice": 3000,
  "monthlyPrice": 10000,
  "discountPercentage": 10,
  "securityDeposit": 5000,
  "taxPercentage": 18,
  "categoryId": 1,
  "isAvailable": true,
  "isPublished": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {...}
}
```

| Status | Description |
|--------|-------------|
| 201 | Product created successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### PUT /api/products/:id
Replace a product (Full Update).

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor (own products) or Admin

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID |

**Request Body:**
```json
{
  "name": "Camera DSLR Pro",
  "brand": "Canon",
  "color": "Black",
  "imageUrl": "https://example.com/image-new.jpg",
  "description": "Updated professional camera",
  "dailyPrice": 600,
  "hourlyPrice": 120,
  "weeklyPrice": 3500,
  "monthlyPrice": 12000,
  "discountPercentage": 15,
  "securityDeposit": 6000,
  "taxPercentage": 18,
  "categoryId": 1,
  "isAvailable": true,
  "isPublished": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {...}
}
```

| Status | Description |
|--------|-------------|
| 200 | Product updated successfully |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden - Not authorized to update this product |
| 404 | Product not found |
| 500 | Internal server error |

---

### DELETE /api/products/:id
Soft delete a product.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor (own products) or Admin

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

| Status | Description |
|--------|-------------|
| 200 | Product deleted successfully |
| 401 | Unauthorized |
| 403 | Forbidden - Not authorized to delete this product |
| 404 | Product not found |
| 500 | Internal server error |

---

## Category Endpoints

### GET /api/categories
Get all categories.

**Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Furniture",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

| Status | Description |
|--------|-------------|
| 200 | Categories retrieved successfully |
| 500 | Internal server error |

---

## Cart Endpoints

### GET /api/cart
Get cart items.

**Authentication:** Required (Bearer Token)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cart123",
      "userId": "user123",
      "productId": "product123",
      "quantity": 2,
      "startDate": "2024-02-01T00:00:00.000Z",
      "endDate": "2024-02-10T00:00:00.000Z",
      "isService": true,
      "product": {
        "id": "product123",
        "name": "Camera DSLR",
        "dailyPrice": 500,
        "imageUrl": "https://..."
      }
    }
  ]
}
```

| Status | Description |
|--------|-------------|
| 200 | List of cart items |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### POST /api/cart
Add or update item in cart.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "productId": "product123",
  "quantity": 2,
  "startDate": "2024-02-01",
  "endDate": "2024-02-10",
  "isService": true
}
```

> **Note:** If `isService` is `true` (default), `startDate` and `endDate` are required. If `isService` is `false`, dates are not required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cart123",
    "userId": "user123",
    "productId": "product123",
    "quantity": 2,
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-02-10T00:00:00.000Z",
    "isService": true
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Cart item added/updated |
| 400 | Invalid input or missing fields |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### DELETE /api/cart/:productId
Remove item from cart.

**Authentication:** Required (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| productId | string | ID of the product to remove |

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

| Status | Description |
|--------|-------------|
| 200 | Item removed from cart |
| 400 | Invalid product ID |
| 401 | Unauthorized |
| 500 | Internal server error |

---

## Wishlist Endpoints

### GET /api/wishlist
Get wishlist items.

**Authentication:** Required (Bearer Token)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "wishlist123",
      "userId": "user123",
      "productId": "product123",
      "product": {
        "id": "product123",
        "name": "Camera DSLR",
        "dailyPrice": 500,
        "imageUrl": "https://..."
      }
    }
  ]
}
```

| Status | Description |
|--------|-------------|
| 200 | List of wishlist items |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### POST /api/wishlist
Add item to wishlist.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "productId": "product123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "wishlist123",
    "userId": "user123",
    "productId": "product123"
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Item added to wishlist |
| 400 | Invalid input |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### DELETE /api/wishlist/:productId
Remove item from wishlist.

**Authentication:** Required (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| productId | string | ID of the product to remove |

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

| Status | Description |
|--------|-------------|
| 200 | Item removed from wishlist |
| 400 | Invalid product ID |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### DELETE /api/wishlist
Remove item from wishlist (via body).

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "productId": "product123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

| Status | Description |
|--------|-------------|
| 200 | Item removed from wishlist |
| 400 | Invalid product ID |
| 401 | Unauthorized |
| 500 | Internal server error |

---

## Sales Order Endpoints

### GET /api/sales-orders/vendor
Get sales orders for the authenticated vendor.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor only

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Number of items per page |

**Response (200):**
```json
{
  "success": true,
  "message": "Vendor sales orders retrieved successfully",
  "data": [
    {
      "id": "order123",
      "customerId": "customer123",
      "vendorId": "vendor123",
      "status": "DRAFT",
      "paymentPlan": "FULL_UPFRONT",
      "totalOrderValue": 5000,
      "address": "123 Main St",
      "city": "Mumbai",
      "pincode": "400001",
      "details": [...],
      "customer": {...}
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Vendor sales orders retrieved successfully |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### POST /api/sales-orders
Create a new sales order from cart.

**Authentication:** Required (Bearer Token)  
**Authorization:** Customer only

**Response (201):**
```json
{
  "success": true,
  "message": "Orders created successfully from cart",
  "data": [...]
}
```

| Status | Description |
|--------|-------------|
| 201 | Orders created successfully |
| 401 | Unauthorized |
| 500 | Internal server error |

---

### PATCH /api/sales-orders/:orderId/status
Update sales order status.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor only

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| orderId | string | Order ID |

**Request Body:**
```json
{
  "status": "SENT"
}
```

**Valid Status Values:** `DRAFT`, `SENT`, `APPROVED`, `REJECTED`, `CONFIRMED`, `CANCELLED`

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {...}
}
```

| Status | Description |
|--------|-------------|
| 200 | Order status updated successfully |
| 400 | Invalid status |
| 401 | Unauthorized |
| 403 | Unauthorized access to this order |
| 404 | Order not found |
| 500 | Internal server error |

---

### POST /api/sales-orders/invoice
Create invoice for a sales order.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor only

**Request Body:**
```json
{
  "orderId": "order123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "invoice123",
    "orderId": "order123",
    "invoiceNumber": "INV-2024-001",
    "deliveryStatus": "PROCESSING",
    "taxAmount": 900,
    "grandTotal": 5900,
    "isPaid": false
  }
}
```

| Status | Description |
|--------|-------------|
| 201 | Invoice created successfully |
| 400 | orderId is required |
| 401 | Unauthorized |
| 403 | Unauthorized access to this order |
| 404 | Order not found |
| 500 | Internal server error |

---

### PATCH /api/sales-orders/invoice/:invoiceId/status
Update invoice status.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor only

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| invoiceId | string | Invoice ID |

**Request Body:**
```json
{
  "status": "DISPATCHED"
}
```

**Valid Status Values:** `PROCESSING`, `DISPATCHED`, `DELIVERED`, `RETURNED`, `COMPLETED`

**Response (200):**
```json
{
  "success": true,
  "message": "Invoice status updated successfully",
  "data": {...}
}
```

| Status | Description |
|--------|-------------|
| 200 | Invoice status updated successfully |
| 400 | Valid status is required / Invalid status transition |
| 401 | Unauthorized |
| 403 | Unauthorized access to this invoice |
| 404 | Invoice not found |
| 500 | Internal server error |

---


---

### GET /api/sales-orders/:orderId
Get sales order details by ID.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor (own orders), Customer (own orders) or Admin

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| orderId | string | Order ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Order details retrieved successfully",
  "data": {
    "id": "order123",
    "customerId": "customer123",
    "vendorId": "vendor123",
    "status": "DRAFT",
    "paymentPlan": "FULL_UPFRONT",
    "totalOrderValue": 5000,
    "createdAt": "2024-02-01T00:00:00.000Z",
    "customer": {
      "id": "customer123",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "address": "123 Main St",
      "city": "Mumbai",
      "pincode": "400001"
    },
    "details": [
      {
        "id": "detail123",
        "productId": "product123",
        "quantity": 2,
        "unitPrice": 500,
        "subtotal": 1000,
        "product": {
          "name": "Camera DSLR",
          "imageUrl": "https://..."
        }
      }
    ],
    "invoices": [],
    "paymentLedgers": []
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Order details retrieved successfully |
| 401 | Unauthorized |
| 403 | Unauthorized access to this order |
| 404 | Order not found |
| 500 | Internal server error |

---

### GET /api/sales-orders/:orderId/return-summary
Calculate return summary including refund/payment and late fees.

**Authentication:** Required (Bearer Token)  
**Authorization:** Vendor only

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| orderId | string | Order ID |

**Response (200):**
```json
{
  "success": true,
  "message": "Return calculation details retrieved successfully",
  "data": {
    "orderId": "order123",
    "grandTotal": 5000,
    "totalPaid": 4000,
    "totalDeposit": 2000,
    "totalLateFee": 500,
    "finalPayment": 1500
  }
}
```

| Status | Description |
|--------|-------------|
| 200 | Return calculation details retrieved successfully |
| 401 | Unauthorized |
| 404 | Order not found |
| 500 | Internal server error |

---

## Chat Endpoints

### POST /api/chat
Send a message to the AI chatbot.

**Authentication:** Required (Bearer Token)

The AI assistant can:
- Browse and search products
- Manage shopping cart
- View wishlist items
- Check order status (role-dependent)
- Answer questions about the rental platform

**Request Body:**
```json
{
  "message": "What products are available for rent?"
}
```

**Example Messages:**
- `"What products are available for rent?"`
- `"Show me my shopping cart"`
- `"Add product abc123 to my cart"`

**Response (200):**
```json
{
  "success": true,
  "response": "Here are the available products for rent: ..."
}
```

| Status | Description |
|--------|-------------|
| 200 | AI response |
| 400 | Invalid input - message is required |
| 401 | Unauthorized - missing or invalid token |
| 500 | Internal server error or AI service unavailable |

---

### GET /api/chat/health
Check chat service health.

**Response (200):**
```json
{
  "success": true,
  "status": "healthy",
  "message": "Chat service is operational"
}
```

| Status | Description |
|--------|-------------|
| 200 | Service is healthy |
| 503 | Service is unavailable |

---

## Data Models

### User Roles
| Role | Description |
|------|-------------|
| ADMIN | Full system access |
| VENDOR | Can manage products and orders |
| CUSTOMER | Can browse, cart, wishlist, and order |

### Order Status
| Status | Description |
|--------|-------------|
| DRAFT | Order created but not submitted |
| SENT | Order sent to vendor |
| APPROVED | Order approved by vendor |
| REJECTED | Order rejected by vendor |
| CONFIRMED | Order confirmed |
| CANCELLED | Order cancelled |

### Delivery Status
| Status | Description |
|--------|-------------|
| PROCESSING | Order is being processed |
| DISPATCHED | Order has been dispatched |
| DELIVERED | Order has been delivered |
| RETURNED | Product has been returned |
| COMPLETED | Order completed |

### Payment Plan
| Plan | Description |
|------|-------------|
| FULL_UPFRONT | Full payment upfront |
| PARTIAL_MONTHLY | Partial monthly payments |

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Rate Limiting
The API may implement rate limiting. When rate limited, you'll receive a `429 Too Many Requests` response.

---

## Swagger Documentation
Interactive API documentation is available at:
```
http://localhost:{PORT}/api-docs
```
