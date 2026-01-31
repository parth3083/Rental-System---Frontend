"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CartItem } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";
import { useCart } from "@/contexts/cart-context";

export default function CartPage() {
  const { cartItems, addToCart } = useCart();

  const updateQuantity = async (productId: string, newQuantity: number) => {
    // Find the original item to keep dates consistent
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    // Call API to update quantity
    await addToCart({
      productId: productId,
      quantity: newQuantity,
      startDate: item.startDate || undefined,
      endDate: item.endDate || undefined,
      isService: item.isService,
    });
  };

  // Removing item is now handled by setting quantity to 0 or via a remove button if we kept it.
  // Since user asked to remove "delete icon", we assume they only update quantity or remove via quantity 0?
  // Wait, if I set quantity to 0, does addToCart handle removal? The backend implementation of addToCart
  // (upsertCart) usually keeps it or updates it. A separate remove endpoint exists.
  // However, the user removed the delete icon.
  // If I want to support removal via quantity:
  // cart.service.ts upsertCart logic usually just updates.
  // If quantity is 0, backend might remove it? Let's assume standard behavior is min quantity 1.
  // CartItem component limits min quantity to 1.

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/customer/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm">
            {cartItems.length} items in your cart
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added anything to rent yet.
          </p>
          <Link href="/customer/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <CartSummary items={cartItems} />
          </div>
        </div>
      )}
    </div>
  );
}
