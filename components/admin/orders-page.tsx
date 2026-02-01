"use client";
import { OrderKanbanView } from "@/components/admin/order-kanban-view";
import { OrderListView } from "@/components/admin/order-list-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  List,
  Search,
  Settings,
  Download,
  Upload,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";

export interface Order {
  id: string;
  reference: string;
  date: string;
  customer: string;
  product: string;
  total: number;
  status: string;
  displayStatus: string;
}

export function OrdersPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userStr = localStorage.getItem("user");
        if (!userStr) return;

        const user = JSON.parse(userStr);
        let response;

        if (user.role === "ADMIN") {
          response = await orderService.getAdminOrders();
        } else if (user.role === "VENDOR") {
          response = await orderService.getVendorOrders();
        } else {
          return; // Customer doesn't access this page usually
        }

        if (response && response.data) {
          const mappedOrders = response.data.map((order: any) => ({
            id: order.id,
            reference:
              order.invoice_number || order.id.substring(0, 8).toUpperCase(),
            date: new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            customer: order.customer.name,
            product: order.product_names || "Multiple Items",
            total: Number(order.total_order_value),
            status: order.status,
            displayStatus: formatStatus(order.status),
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatStatus = (status: string) => {
    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase().replace("_", " ")
    );
  };

  // Calculate stats
  const totalOrders = orders.length;
  const confirmedOrders = orders.filter(
    (o) => o.status === "CONFIRMED" || o.status === "APPROVED",
  ).length;
  const pendingOrders = orders.filter(
    (o) => o.status === "DRAFT" || o.status === "SENT",
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.status === "CANCELLED" || o.status === "REJECTED",
  ).length;

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar (Visible in Kanban mode mostly, but kept for layout consistency) */}
      <div className="w-48 flex-shrink-0 space-y-6 hidden lg:block">
        <div className="bg-card rounded-lg border p-1">
          <Command className="bg-transparent">
            <CommandList>
              <CommandGroup heading="Orders Menu">
                <Link href="/admin/orders">
                  <CommandItem className="cursor-pointer bg-accent text-accent-foreground">
                    Orders
                  </CommandItem>
                </Link>
                <Link href="/admin/invoiced">
                  <CommandItem className="cursor-pointer">Invoices</CommandItem>
                </Link>
                <Link href="/admin/customer">
                  <CommandItem className="cursor-pointer">Customer</CommandItem>
                </Link>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <div className="bg-card rounded-lg border p-4 text-sm space-y-3">
          <h3 className="font-semibold text-muted-foreground mb-2 flex justify-between">
            Rental Status
            <Settings className="h-4 w-4" />
          </h3>
          <div className="flex justify-between items-center">
            <span>Total:</span>
            <span className="font-bold">{totalOrders}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Confirmed</span>
            <span className="bg-green-100 text-green-700 px-2 rounded-full text-xs">
              {confirmedOrders}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Pending</span>
            <span className="bg-blue-100 text-blue-700 px-2 rounded-full text-xs">
              {pendingOrders}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Cancelled</span>
            <span className="bg-red-100 text-red-700 px-2 rounded-full text-xs">
              {cancelledOrders}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 bg-muted/10 p-4 rounded-xl border">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold flex items-center gap-2">
              Rental Orders
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Upload className="mr-2 h-4 w-4" />
                    Export Records
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Import Records
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </h1>
            <Button className="bg-purple-500 hover:bg-purple-600">New</Button>
          </div>

          <div className="flex-1 max-w-sm mx-4 relative">
            <Input placeholder="Search..." className="bg-background" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Pickup
            </Button>
            <Button variant="outline" size="sm">
              Return
            </Button>

            <div className="flex items-center bg-background rounded-md border p-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded",
                  viewMode === "kanban"
                    ? "bg-muted shadow-sm"
                    : "hover:bg-muted/50",
                )}
                onClick={() => setViewMode("kanban")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded",
                  viewMode === "list"
                    ? "bg-muted shadow-sm"
                    : "hover:bg-muted/50",
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewMode === "kanban" ? (
            <OrderKanbanView orders={orders} />
          ) : (
            <OrderListView orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}
