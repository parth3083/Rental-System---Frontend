"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { CartItem as ApiCartItem } from "@/services/cart.service";

interface CartItemProps {
  item: ApiCartItem;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
}

export function CartItem({ item, onUpdateQuantity }: CartItemProps) {
  const startDate = item.startDate ? new Date(item.startDate) : new Date();
  const endDate = item.endDate ? new Date(item.endDate) : new Date();

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Use dailyPrice as default or fallback to 0 if product is missing (shouldn't happen)
  const price = item.product?.dailyPrice || 0;

  const calculateItemTotal = () => {
    return price * diffDays * item.quantity;
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-card/50">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
        {/* Image */}
        <div className="relative aspect-square w-full sm:w-32 h-32 rounded-lg bg-white border flex items-center justify-center flex-shrink-0">
          <Image
            src={
              item.product?.imageUrl ||
              "https://placehold.co/400x300/png?text=No+Image"
            }
            alt={item.product?.name || "Product"}
            fill
            className="object-contain p-2"
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{item.product?.name}</h3>
              {/* Brand is not in the cart item product relation yet, omitted or need to add to backend */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Start:{" "}
                  <span className="text-foreground font-medium">
                    {startDate.toLocaleDateString()}
                  </span>
                </span>
                <span>
                  End:{" "}
                  <span className="text-foreground font-medium">
                    {endDate.toLocaleDateString()}
                  </span>
                </span>
                <span>
                  Duration:{" "}
                  <span className="text-foreground font-medium">
                    {diffDays} days
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-4">
            {/* Quantity */}
            <div className="flex items-center border rounded-md bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  onUpdateQuantity(
                    item.productId,
                    Math.max(1, item.quantity - 1),
                  )
                }
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  onUpdateQuantity(item.productId, item.quantity + 1)
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Price Calculation */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">
                Rs {price}/day × {diffDays} days × {item.quantity}
              </div>
              <div className="text-xl font-bold text-primary">
                Rs {calculateItemTotal()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
