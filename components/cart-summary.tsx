"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { CartItem as ApiCartItem } from "@/services/cart.service";

interface CartSummaryProps {
  items: ApiCartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");

  const calculateItemTotal = (item: ApiCartItem) => {
    const startDate = item.startDate ? new Date(item.startDate) : new Date();
    const endDate = item.endDate ? new Date(item.endDate) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const price = item.product?.dailyPrice || 0;
    return price * diffDays * item.quantity;
  };

  const subtotal = items.reduce(
    (acc, item) => acc + calculateItemTotal(item),
    0,
  );
  const tax = subtotal * 0.18; // 18% GST example
  const total = subtotal + tax;

  return (
    <Card className="border-none shadow-sm bg-card/50 sticky top-4">
      <CardContent className="p-6">
        <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

        {/* Mini List */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground truncate max-w-[200px]">
                {item.product?.name} × {item.quantity}
              </span>
              <span className="font-medium">Rs {calculateItemTotal(item)}</span>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Coupon */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="bg-background"
          />
          <Button
            variant="outline"
            className="text-primary hover:text-primary/90"
          >
            Apply
          </Button>
        </div>

        {/* Totals */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (18% GST)</span>
            <span className="font-medium">Rs {tax.toFixed(2)}</span>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">Rs {total.toFixed(2)}</span>
          </div>
        </div>

        <Link href="/customer/checkout">
          <Button className="w-full mt-6 h-12 text-base font-semibold group">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Taxes and security deposit will be calculated at checkout
        </p>
      </CardContent>
    </Card>
  );
}
