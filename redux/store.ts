import { configureStore} from "@reduxjs/toolkit"
import searchReducer from "@/redux/slices/searchSlice"
import cartReducer from "@/redux/slices/cartSlice"
import orderReducer from "@/redux/slices/orderSlice"

export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;