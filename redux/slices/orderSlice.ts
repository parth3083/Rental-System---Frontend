import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CartItem } from "./cartSlice"

export type OrderStatus = 'quotation_pending' | 'payment_pending' | 'completed' | 'cancelled'

export interface Order {
    id: string
    items: CartItem[]
    status: OrderStatus
    total: number
    date: string
    deliveryAddress?: {
        name: string
        address: string
        city: string
        zip: string
    }
}

interface OrderState {
    orders: Order[]
}

const initialState: OrderState = {
    orders: [
        {
            id: "ORD-PRIOR-1",
            items: [], // Simplified for preview
            status: 'payment_pending', // Mock one ready for payment
            total: 1250,
            date: new Date().toISOString(),
            deliveryAddress: {
                name: "John Doe",
                address: "123 Main St",
                city: "Mumbai",
                zip: "400001"
            }
        }
    ]
}

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        createOrder: (state, action: PayloadAction<Order>) => {
            state.orders.unshift(action.payload)
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: string, status: OrderStatus }>) => {
            const order = state.orders.find(o => o.id === action.payload.id)
            if (order) {
                order.status = action.payload.status
            }
        }
    }
})

export const { createOrder, updateOrderStatus } = orderSlice.actions
export default orderSlice.reducer
