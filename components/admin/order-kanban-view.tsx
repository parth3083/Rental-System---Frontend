"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Calendar, User, Package, CreditCard } from "lucide-react";

interface Order {
  id: string;
  reference: string;
  date: string;
  customer: string;
  product: string;
  total: number;
  status: string;
  displayStatus: string;
}

interface OrderKanbanViewProps {
  orders: Order[];
}

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700 border-gray-200",
  Sent: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Approved: "bg-blue-100 text-blue-700 border-blue-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Confirmed: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
  Processing: "bg-purple-100 text-purple-700 border-purple-200",
  Dispatched: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Returned: "bg-orange-100 text-orange-700 border-orange-200",
  Completed: "bg-slate-800 text-white border-slate-700",
};

export function OrderKanbanView({ orders }: OrderKanbanViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {orders.map((order) => (
        <Link
          href={`/admin/orders/${order.id}`}
          key={order.id}
          className="block group"
        >
          <Card
            className="h-full transition-all duration-200 hover:shadow-md border-l-4 overflow-hidden"
            style={{ borderLeftColor: getStatusColor(order.displayStatus) }}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {order.reference}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {order.date}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5",
                    STATUS_STYLES[order.displayStatus] ||
                      "bg-gray-100 text-gray-700",
                  )}
                >
                  {order.displayStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 py-2 space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium leading-none">
                  {order.customer}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Package className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground line-clamp-2 leading-tight">
                  {order.product}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 border-t bg-muted/5 flex justify-between items-center mt-auto">
              <div className="flex items-center text-xs text-muted-foreground">
                <span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full mr-2",
                    getDotColor(order.displayStatus),
                  )}
                ></span>
                {order.status}
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-foreground">
                  ${order.total.toLocaleString()}
                </p>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "Draft":
      return "#9ca3af";
    case "Sent":
      return "#eab308";
    case "Approved":
      return "#3b82f6";
    case "Confirmed":
      return "#22c55e";
    case "Processing":
      return "#a855f7";
    case "Dispatched":
      return "#6366f1";
    case "Delivered":
      return "#22c55e";
    case "Completed":
      return "#1e293b";
    case "Returned":
      return "#f97316";
    case "Cancelled":
      return "#ef4444";
    case "Rejected":
      return "#ef4444";
    default:
      return "#9ca3af";
  }
}

function getDotColor(status: string) {
  switch (status) {
    case "Draft":
      return "bg-gray-400";
    case "Sent":
      return "bg-yellow-500";
    case "Approved":
      return "bg-blue-500";
    case "Confirmed":
      return "bg-green-500";
    case "Processing":
      return "bg-purple-500";
    case "Dispatched":
      return "bg-indigo-500";
    case "Delivered":
      return "bg-green-500";
    case "Completed":
      return "bg-slate-700";
    case "Returned":
      return "bg-orange-500";
    case "Cancelled":
      return "bg-red-500";
    case "Rejected":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}
