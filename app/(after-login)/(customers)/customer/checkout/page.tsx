"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearCart } from "@/redux/slices/cartSlice";
import { createOrder } from "@/redux/slices/orderSlice";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cartService } from "@/services/cart.service";
import { userService, User } from "@/services/user.service";
import { useCart } from "@/contexts/cart-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cartItems, refreshCart, isLoading: isCartLoading } = useCart();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showProfileWarning, setShowProfileWarning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserDetails();
        const userData = response.data;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          address: userData.address || "",
          city: userData.city || "",
          zip: userData.pincode || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };
    fetchUser();
    refreshCart();
  }, []);

  // Calculate Totals consistent with cart summary
  const subtotal = cartItems.reduce((acc, item) => {
    const startDate = item.startDate ? new Date(item.startDate) : new Date();
    const endDate = item.endDate ? new Date(item.endDate) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const price = item.product?.dailyPrice || 0;
    return acc + price * diffDays * item.quantity;
  }, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleRequestQuotation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate if user profile has necessary details
    if (!user?.address || !user?.city || !user?.pincode) {
      setShowProfileWarning(true);
      return;
    }

    setLoading(true);

    try {
      const response = await cartService.createSalesOrder();

      if (response.success && response.data) {
        // Map backend orders to Redux store format
        // The backend can return multiple orders (one per vendor)
        response.data.forEach((backendOrder: any) => {
          const newOrder = {
            id: backendOrder.id,
            // We might not have all item details in the immediate response response depending on backend
            // But we can approximate or use what we have.
            // Backend details structure: [{ productId, quantity, unitPrice, ... }]
            items: backendOrder.details
              ? backendOrder.details.map((detail: any) => ({
                  id: detail.id,
                  productId: detail.productId,
                  quantity: detail.quantity,
                  price: detail.unitPrice,
                  userId: backendOrder.customerId, // Approximate
                  isService: backendOrder.isService,
                  startDate: detail.start_date,
                  endDate: detail.end_date,
                }))
              : [],
            status:
              backendOrder.status === "DRAFT" || backendOrder.status === "SENT"
                ? "quotation_pending"
                : backendOrder.status === "APPROVED"
                  ? "payment_pending"
                  : backendOrder.status === "CONFIRMED" ||
                      backendOrder.status === "DELIVERED"
                    ? "completed"
                    : backendOrder.status === "CANCELLED" ||
                        backendOrder.status === "REJECTED"
                      ? "cancelled"
                      : "quotation_pending",
            total: backendOrder.totalOrderValue,
            date: backendOrder.createdAt || new Date().toISOString(),
            deliveryAddress: { ...formData }, // Keeping form data for UI display even if backend didn't use it
          };
          dispatch(createOrder(newOrder as any));
        });

        dispatch(clearCart());
        router.push("/customer/orders");
      }
    } catch (error: any) {
      console.error("Failed to create order:", error);
      // Ideally show error toast here
      alert(error.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (isCartLoading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/customer/products">
          <Button>Back to Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <Link
        href="/customer/cart"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Address & Delivery */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue="standard"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-accent/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <RadioGroupItem value="standard" id="r1" />
                  <Label htmlFor="r1" className="flex-1 cursor-pointer">
                    <div className="font-medium">Standard Delivery</div>
                    <div className="text-xs text-muted-foreground">
                      Delivered to your doorstep
                    </div>
                  </Label>
                  <span className="font-bold text-sm">Free</span>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-accent/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                  <RadioGroupItem value="pickup" id="r2" />
                  <Label htmlFor="r2" className="flex-1 cursor-pointer">
                    <div className="font-medium">Store Pickup</div>
                    <div className="text-xs text-muted-foreground">
                      Pick up from nearest hub
                    </div>
                  </Label>
                  <span className="font-bold text-sm">Free</span>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id="checkout-form"
                onSubmit={handleRequestQuotation}
                className="grid grid-cols-2 gap-4"
              >
                <div className="col-span-2 space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    required
                    readOnly
                    className="bg-muted"
                    placeholder="John Doe"
                    value={formData.name}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Email</Label>
                  <Input
                    required
                    readOnly
                    className="bg-muted"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input
                    required
                    readOnly
                    className="bg-muted"
                    placeholder="123 Main St, Apartment 4B"
                    value={formData.address}
                  />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    required
                    readOnly
                    className="bg-muted"
                    placeholder="Mumbai"
                    value={formData.city}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ZIP / Postal Code</Label>
                  <Input
                    required
                    readOnly
                    className="bg-muted"
                    placeholder="400001"
                    value={formData.zip}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div>
          <Card className="sticky top-4 bg-muted/20 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate max-w-[150px]">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      Rs{" "}
                      {(item.product?.dailyPrice || 0) *
                        item.quantity *
                        (Math.ceil(
                          Math.abs(
                            (item.endDate
                              ? new Date(item.endDate).getTime()
                              : 0) -
                              (item.startDate
                                ? new Date(item.startDate).getTime()
                                : 0),
                          ) /
                            (1000 * 60 * 60 * 24),
                        ) || 1)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span className="font-medium">Rs {tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">Rs {total.toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md text-xs mt-4">
                Note: This is a quotation request. The final amount will be
                confirmed by the vendor.
              </div>
              <Button
                type="submit"
                form="checkout-form"
                className="w-full h-12 text-base mt-2"
                disabled={loading}
              >
                {loading ? "Sending Request..." : "Request Quotation"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showProfileWarning} onOpenChange={setShowProfileWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Update Required</DialogTitle>
            <DialogDescription>
              Your profile is missing delivery details (Address, City, or
              Pincode). Please update your profile to request a quotation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProfileWarning(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => router.push("/customer/profile")}>
              Update Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
