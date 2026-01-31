"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { wishlistService, WishlistItem } from "@/services/wishlist.service";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = async () => {
    // Only fetch if token exists
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await wishlistService.getWishlist();
      if (response.success) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const addToWishlist = async (productId: string) => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem("token")) {
        toast.error("Please login to add items to wishlist");
        return;
      }

      const response = await wishlistService.addToWishlist(productId);
      if (response.success) {
        toast.success("Item added to wishlist");
        await fetchWishlist();
      }
    } catch (error) {
      console.error("Error adding to wishlist", error);
      const message =
        error instanceof Error ? error.message : "Failed to add to wishlist";
      toast.error(message);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        toast.success("Item removed from wishlist");
        setWishlistItems((prev) =>
          prev.filter((item) => item.productId !== productId),
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to remove from wishlist";
      toast.error(message);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
