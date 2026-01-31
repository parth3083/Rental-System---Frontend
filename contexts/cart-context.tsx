"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  cartService,
  CartItem,
  AddToCartPayload,
} from "@/services/cart.service";
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    // Only fetch if token exists
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      if (response.success) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (payload: AddToCartPayload) => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem("token")) {
        toast.error("Please login to add items to cart");
        return;
      }

      const response = await cartService.addToCart(payload);
      if (response.success) {
        toast.success("Item added to cart");
        await fetchCart(); // Refresh cart to get updated state
      }
    } catch (error) {
      console.error("Error adding to cart", error);
      const message =
        error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(message);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await cartService.removeFromCart(productId);
      if (response.success) {
        toast.success("Item removed from cart");
        setCartItems((prev) =>
          prev.filter((item) => item.productId !== productId),
        );
      }
    } catch (error) {
      console.error("Error removing from cart", error);
      const message =
        error instanceof Error ? error.message : "Failed to remove item";
      toast.error(message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        removeFromCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
