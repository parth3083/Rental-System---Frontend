"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/services/order.service";
import { CalendarIcon, Loader2, Printer, Send, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderLine {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxes: number;
  amount: number;
}

type OrderStatus =
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "REJECTED"
  | "CONFIRMED"
  | "CANCELLED";

interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  customerId?: string;
  customer: string;
  invoiceAddress: string;
  deliveryAddress: string;
  rentalStart?: Date;
  rentalEnd?: Date;
  orderDate: Date;
  orderLines: OrderLine[];
}

export function OrderDetailsPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(orderId);
        if (response && response.data) {
          const data = response.data;

          // Determine rental dates from first detail item if available (assuming same for order or taking range)
          // Backend details have start_date/end_date per item.
          // For simplicity, taking the first item's dates as the order's main rental period for display
          const firstDetail = data.details?.[0];
          const rStart = firstDetail?.start_date
            ? new Date(firstDetail.start_date)
            : undefined;
          const rEnd = firstDetail?.end_date
            ? new Date(firstDetail.end_date)
            : undefined;

          const mappedOrder: Order = {
            id: data.id,
            reference:
              data.invoices?.[0]?.invoiceNumber ||
              data.id.substring(0, 8).toUpperCase(),
            status: data.status,
            customerId: data.customer?.id,
            customer: data.customer?.name || "Unknown Customer",
            invoiceAddress: data.customer?.address || "No Address",
            deliveryAddress:
              data.address || data.customer?.address || "No Address",
            rentalStart: rStart,
            rentalEnd: rEnd,
            orderDate: new Date(data.createdAt),
            orderLines: data.details.map((detail: any) => ({
              id: detail.id,
              product: detail.product?.name || "Unknown Product",
              quantity: detail.quantity,
              unit: "Units", // Defaulting as backend doesn't seem to store unit type on detail
              unitPrice: Number(detail.unitPrice),
              taxes: 0, // Backend doesn't seem to provide tax per line explicitly in this view yet
              amount: Number(detail.subtotal),
            })),
          };

          setOrder(mappedOrder);
          setStartDate(rStart);
          setEndDate(rEnd);
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return <div className="container mx-auto py-6 px-4">Order not found</div>;
  }

  const untaxedAmount = order.orderLines.reduce(
    (sum, line) => sum + line.amount,
    0,
  );
  const totalAmount = Number(untaxedAmount); // + taxes if needed

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Quotation</h1>
          <p className="text-muted-foreground">
            Quotation for {order.customer}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>

          {/* Conditional Action Buttons */}
          {order.status === "DRAFT" && (
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4" />
              Send to Customer
            </Button>
          )}

          {order.status === "SENT" && (
            <Button
              size="sm"
              disabled
              className="gap-2 bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed"
            >
              Waiting for Approval
            </Button>
          )}

          {order.status === "APPROVED" && (
            <Button
              size="sm"
              disabled
              className="gap-2 bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed"
            >
              Waiting for Payment
            </Button>
          )}

          {order.status === "CONFIRMED" && (
            <Button
              size="sm"
              className="gap-2 bg-purple-600 hover:bg-purple-700"
            >
              Create Invoice
            </Button>
          )}

          {(order.status === "REJECTED" || order.status === "CANCELLED") && (
            <Button
              size="sm"
              disabled
              className="gap-2 bg-red-500 hover:bg-red-500 cursor-not-allowed"
            >
              Quotation Rejected
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Customer</Label>
            <div className="flex gap-2">
              <Input value={order.customer} readOnly />
              {order.customerId && (
                <Button variant="outline" size="icon" asChild>
                  <a href={`/admin/customer/${order.customerId}`}>
                    <User className="h-4 w-4" />
                    <span className="sr-only">View Customer</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Invoice Address</Label>
            <Input defaultValue={order.invoiceAddress} />
          </div>
          <div>
            <Label className="mb-2 block">Delivery Address</Label>
            <Input defaultValue={order.deliveryAddress} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Rental Period</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal flex-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      startDate.toDateString()
                    ) : (
                      <span>Start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
              <span>→</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal flex-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? endDate.toDateString() : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Order date</Label>
            <Input
              type="text"
              defaultValue={order.orderDate.toDateString()}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Order Lines */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Order Line</h3>
        <div className="border rounded-md">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 border-b font-medium text-sm">
            <div className="col-span-4">Product</div>
            <div className="col-span-1">Quantity</div>
            <div className="col-span-2">Unit</div>
            <div className="col-span-2">Unit Price</div>
            <div className="col-span-1">Taxes</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {/* Rows */}
          <div className="divide-y">
            {order.orderLines.map((line) => (
              <div
                key={line.id}
                className="grid grid-cols-12 gap-4 p-3 items-center"
              >
                <div className="col-span-4 font-medium">{line.product}</div>
                <div className="col-span-1">{line.quantity}</div>
                <div className="col-span-2">{line.unit}</div>
                <div className="col-span-2">
                  Rs {line.unitPrice.toLocaleString()}
                </div>
                <div className="col-span-1">—</div>
                <div className="col-span-2 text-right font-semibold">
                  Rs {line.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Add Buttons */}
          <div className="p-3 bg-muted/10 flex gap-4">
            <Button variant="link" className="text-primary -ml-2 h-8">
              Add a Product
            </Button>
            <Button variant="link" className="text-primary h-8">
              Add a note
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Terms & Conditions:{" "}
            <a href="#" className="text-primary underline">
              https://xxxxx.xxx.xxx/terms
            </a>
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Send Quotation to Customer
          </Button>
        </div>

        <div className="space-y-2 min-w-[300px]">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Coupon Code
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Discount
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Add Shipping
            </Button>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Untaxed Amount:</span>
            <span className="font-semibold">
              Rs {untaxedAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>Rs {totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
