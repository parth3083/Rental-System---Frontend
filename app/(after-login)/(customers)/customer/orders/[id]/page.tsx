"use client";

import { Badge } from "@/components/ui/badge";
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
import { CalendarIcon, Loader2, Printer, Check, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  vendorName: string;
  vendorCompany: string;
  paymentAmountPending: number;
}

export default function CustomerOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      if (response && response.data) {
        const data = response.data;

        // Determine rental dates
        const firstDetail = data.details?.[0];
        const rStart = data.details?.[0]?.start_date
          ? new Date(data.details[0].start_date)
          : undefined;
        const rEnd = data.details?.[0]?.end_date
          ? new Date(data.details[0].end_date)
          : undefined;

        const mappedOrder: Order = {
          id: data.id,
          reference:
            data.invoices?.[0]?.invoiceNumber ||
            data.id.substring(0, 8).toUpperCase(),
          status: data.status,
          customerId: data.customer?.id,
          customer: data.customer?.name || "Me",
          invoiceAddress: data.customer?.address || "My Address",
          deliveryAddress:
            data.address || data.customer?.address || "My Address",
          rentalStart: rStart,
          rentalEnd: rEnd,
          orderDate: new Date(data.createdAt),
          orderLines: data.details.map((detail: any) => ({
            id: detail.id,
            product: detail.product?.name || "Unknown Product",
            quantity: detail.quantity,
            unit: "Units",
            unitPrice: Number(detail.unitPrice),
            taxes: 0,
            amount: Number(detail.subtotal),
          })),
          vendorName: data.vendor?.name,
          vendorCompany: data.vendor?.companyName,
          paymentAmountPending: Number(data.payment_amount_pending || 0),
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

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleAcceptQuotation = async () => {
    try {
      setLoading(true);
      await orderService.acceptQuotation(orderId);
      toast.success("Quotation accepted successfully");
      await fetchOrderDetails();
    } catch (error) {
      console.error("Failed to accept quotation:", error);
      toast.error("Failed to accept quotation");
      setLoading(false);
    }
  };

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
  const totalAmount = Number(untaxedAmount);

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-xl">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Order #{order.reference}
            <Badge variant={order.status === "SENT" ? "default" : "secondary"}>
              {order.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Vendor: {order.vendorCompany || order.vendorName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>

          {/* Customer Actions */}
          {order.status === "SENT" && (
            <Button
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
              onClick={handleAcceptQuotation}
            >
              <Check className="h-4 w-4" />
              Accept Quotation
            </Button>
          )}

          {order.status === "APPROVED" && (
            <Link href={`/customer/orders/${order.id}/payment`}>
              <Button size="sm" className="gap-2">
                Pay Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Customer Details</Label>
            <Input value={order.customer} readOnly />
          </div>
          <div>
            <Label className="mb-2 block">Invoice Address</Label>
            <Input defaultValue={order.invoiceAddress} readOnly />
          </div>
          <div>
            <Label className="mb-2 block">Delivery Address</Label>
            <Input defaultValue={order.deliveryAddress} readOnly />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Rental Period</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="justify-start text-left font-normal flex-1"
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? startDate.toDateString() : <span>Start date</span>}
              </Button>
              <span>→</span>
              <Button
                variant="outline"
                className="justify-start text-left font-normal flex-1"
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? endDate.toDateString() : <span>End date</span>}
              </Button>
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
        <h3 className="font-semibold mb-4">Order Lines</h3>
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
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Terms & Conditions apply.
          </p>
        </div>

        <div className="space-y-2 min-w-[300px]">
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
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Pending Payment:</span>
            <span>Rs {order.paymentAmountPending.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
