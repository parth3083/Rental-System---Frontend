"use client";

import { CustomerKanbanView } from "@/components/admin/customer-kanban-view";
import { CustomerListView } from "@/components/admin/customer-list-view";
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
  ChevronLeft,
  ChevronRight,
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
import { userService } from "@/services/user.service";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
}

export function CustomersPage() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers(1, 100);
        if (response && response.data && response.data.items) {
          const mappedCustomers = response.data.items.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.pincode || "N/A", // Using pincode as placeholder for phone if not available
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
            role: user.role,
          }));
          setCustomers(mappedCustomers);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0 space-y-6 hidden lg:block">
        <div className="bg-card rounded-lg border p-1">
          <Command className="bg-transparent">
            <CommandList>
              <CommandGroup heading="Orders Menu">
                <Link href="/admin/orders">
                  <CommandItem className="cursor-pointer">Orders</CommandItem>
                </Link>
                <Link href="/admin/invoiced">
                  <CommandItem className="cursor-pointer">Invoices</CommandItem>
                </Link>
                <Link href="/admin/customer">
                  <CommandItem className="cursor-pointer bg-accent text-accent-foreground">
                    Customer
                  </CommandItem>
                </Link>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 bg-muted/10 p-4 rounded-xl border">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold flex items-center gap-2 min-w-fit">
            Customers
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

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Input placeholder="Search..." className="bg-background" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* View Switcher & Pager */}
          <div className="flex items-center gap-6">
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

            <div className="flex items-center bg-background rounded-md border p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded hover:bg-muted/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded hover:bg-muted/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : viewMode === "kanban" ? (
            <CustomerKanbanView customers={customers} />
          ) : (
            <CustomerListView customers={customers} />
          )}
        </div>
      </div>
    </div>
  );
}
