import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
    id: string
    productId: string
    title: string
    brand: string
    image: string
    price: number
    unit: string
    quantity: number
    startDate: string
    endDate: string
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: [
        {
            id: "1",
            productId: "9",
            title: "Professional DSLR Camera",
            brand: "Canon",
            image: "https://placehold.co/400x300/png?text=Camera",
            price: 200,
            unit: "day",
            quantity: 1,
            startDate: new Date("2026-01-31").toISOString(),
            endDate: new Date("2026-02-03").toISOString(),
        }
    ]
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.items.push(action.payload)
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        },
        updateQuantity: (state, action: PayloadAction<{ id: string, quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id)
            if (item) {
                item.quantity = Math.max(1, action.payload.quantity)
            }
        },
        clearCart: (state) => {
            state.items = []
        }
    }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
