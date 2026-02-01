"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Clock, CheckCircle2, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { orderService, BackendOrder } from "@/services/order.service";
import { toast } from "sonner";

const STATUS_MAP: Record<string, any> = {
  quotation_pending: {
    label: "Quotation Pending",
    color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    icon: Clock,
  },
  payment_pending: {
    label: "Payment Pending",
    color: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    icon: CreditCard,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 hover:bg-green-100",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 hover:bg-red-100",
    icon: AlertCircle,
  },
};

const mapBackendStatus = (status: string) => {
  switch (status) {
    case "DRAFT":
    case "SENT":
      return "quotation_pending";
    case "APPROVED":
      return "payment_pending";
    case "CONFIRMED":
      return "completed";
    case "CANCELLED":
    case "REJECTED":
      return "cancelled";
    default:
      return "quotation_pending";
  }
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getCustomerOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAcceptQuotation = async (orderId: string) => {
    try {
      setIsLoading(true);
      await orderService.acceptQuotation(orderId);
      toast.success("Quotation accepted successfully");
      await fetchOrders();
    } catch (error) {
      console.error("Failed to accept quotation:", error);
      toast.error("Failed to accept quotation");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">You have no orders yet.</p>
            <Link href="/customer/products">
              <Button variant="link" className="mt-2">
                Browse products to start renting
              </Button>
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const mappedStatus = mapBackendStatus(order.status);
            const StatusConfig =
              STATUS_MAP[mappedStatus] || STATUS_MAP.quotation_pending;

            return (
              <Card
                key={order.id}
                className="overflow-hidden border-border/50 hover:border-primary/20 transition-colors"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/10">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.created_at).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${StatusConfig.color} border-none px-3 py-1 font-semibold`}
                    variant="secondary"
                  >
                    <StatusConfig.icon className="mr-1.5 h-3.5 w-3.5" />
                    {StatusConfig.label}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {order.details &&
                        order.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm items-center"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {detail.product.name}
                              </span>
                              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded w-fit mt-1">
                                Qty: {detail.quantity}
                              </span>
                            </div>
                            <span className="font-semibold text-foreground">
                              Rs {detail.subtotal}
                            </span>
                          </div>
                        ))}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground italic">
                        Sold by:{" "}
                        <span className="font-medium text-foreground">
                          {order.vendor.companyName || order.vendor.name}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                          Total Amount
                        </span>
                        <span className="text-xl font-bold text-primary">
                          Rs {order.total_order_value}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Pending: Rs {order.payment_amount_pending}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4">
                      <Link href={`/customer/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Quotation
                        </Button>
                      </Link>

                      {order.status === "SENT" && (
                        <Button
                          size="sm"
                          onClick={() => handleAcceptQuotation(order.id)}
                        >
                          Accept Quotation
                        </Button>
                      )}

                      {mappedStatus === "payment_pending" && (
                        <Link href={`/customer/orders/${order.id}/payment`}>
                          <Button size="sm">Pay Now</Button>
                        </Link>
                      )}
                    </div>

                    {mappedStatus === "quotation_pending" &&
                      order.status !== "SENT" && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 text-[11px] p-3 rounded-lg text-yellow-800 dark:text-yellow-200 mt-2 flex items-start gap-2 border border-yellow-100 dark:border-yellow-900/20">
                          <Clock className="h-4 w-4 shrink-0 transition-all animate-pulse" />
                          <p>
                            Waiting for vendor to accept the quotation. You will
                            be notified once approved and ready for payment.
                          </p>
                        </div>
                      )}

                    {order.status === "SENT" && (
                      <div className="bg-blue-50 dark:bg-blue-900/10 text-[11px] p-3 rounded-lg text-blue-800 dark:text-blue-200 mt-2 flex items-start gap-2 border border-blue-100 dark:border-blue-900/20">
                        <Clock className="h-4 w-4 shrink-0 transition-all animate-pulse" />
                        <p>
                          Vendor has sent the quotation. Please review and
                          accept to proceed.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
