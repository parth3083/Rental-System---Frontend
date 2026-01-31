"use client";

import { ProductCard } from "@/components/product-card";
import { useWishlist } from "@/contexts/wishlist-context";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Loading wishlist...
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-2xl font-semibold mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Start adding products you love to your wishlist
          </p>
          <Button asChild>
            <a href="/customer/products">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="relative group">
            {/* 
              We link to the product details page. 
              Note: item.product.id is the Product ID. 
            */}
            <a
              href={`/customer/products/${item.product.id}`}
              className="block h-full"
            >
              <ProductCard
                id={item.product.id}
                title={item.product.name}
                image={item.product.imageUrl || "/placeholder.png"}
                // Displaying daily price as default
                price={`₹${item.product.dailyPrice}`}
                unit="day"
                inStock={item.product.stock > 0}
                showWishlistButton={false}
              />
            </a>

            {/* 
              Overlay Remove Button 
              However, ProductCard already has a toggle heart button which handles remove if in wishlist.
              But the design in this file adds an extra Trash bin on top.
              Let's keep it but ensure it calls removeFromWishlist with productId.
            */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromWishlist(item.product.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove from wishlist</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
