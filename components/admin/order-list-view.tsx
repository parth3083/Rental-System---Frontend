"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

interface OrderListViewProps {
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

import { useRouter } from "next/navigation";

export function OrderListView({ orders }: OrderListViewProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Order Reference</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Rental Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{order.reference}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell>${order.total}</TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 font-normal border",
                    STATUS_STYLES[order.displayStatus] ||
                      "bg-gray-100 text-gray-700",
                  )}
                >
                  {order.displayStatus}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
