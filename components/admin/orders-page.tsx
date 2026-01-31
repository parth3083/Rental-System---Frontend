"use client"

import { OrderKanbanView } from "@/components/admin/order-kanban-view"
import { OrderListView } from "@/components/admin/order-list-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutGrid, List, Search, Settings, Download, Upload } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock data with new status enum
export const MOCK_ORDERS = [
    { id: "1", reference: "S00001", date: "Jan 22", customer: "Smith", product: "TV", total: 1450, status: "APPROVED" as const, displayStatus: "Sale order" },
    { id: "2", reference: "S00010", date: "Jan 22", customer: "Mark wood", product: "Printer", total: 50, status: "CONFIRMED" as const, displayStatus: "Confirmed" },
    { id: "3", reference: "S00008", date: "Jan 22", customer: "Alex", product: "Car", total: 775, status: "CONFIRMED" as const, displayStatus: "Invoiced" },
    { id: "4", reference: "S00012", date: "Jan 22", customer: "Smith", product: "TV", total: 1450, status: "CANCELLED" as const, displayStatus: "Cancelled" },
    { id: "5", reference: "S00005", date: "Jan 22", customer: "John", product: "Projector", total: 14.50, status: "DRAFT" as const, displayStatus: "Quotation" },
    { id: "6", reference: "S00011", date: "Jan 22", customer: "Mark wood", product: "Printer", total: 150, status: "SENT" as const, displayStatus: "Quotation Sent" },
    { id: "7", reference: "S00013", date: "Jan 22", customer: "Smith", product: "Games", total: 50, status: "REJECTED" as const, displayStatus: "Rejected" },
]

export function OrdersPage() {
    const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban")

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* Sidebar (Visible in Kanban mode mostly, but kept for layout consistency) */}
            <div className="w-48 flex-shrink-0 space-y-6 hidden lg:block">
                <div className="bg-card rounded-lg border p-1">
                    <Command className="bg-transparent">
                        <CommandList>
                            <CommandGroup heading="Orders Menu">
                                <Link href="/admin/orders">
                                    <CommandItem className="cursor-pointer bg-accent text-accent-foreground">Orders</CommandItem>
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
                        <span className="font-bold">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Sale order</span>
                        <span className="bg-orange-100 text-orange-700 px-2 rounded-full text-xs">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Quotation</span>
                        <span className="bg-purple-100 text-purple-700 px-2 rounded-full text-xs">1</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Invoiced</span>
                        <span className="bg-blue-100 text-blue-700 px-2 rounded-full text-xs">1</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Confirmed</span>
                        <span className="bg-green-100 text-green-700 px-2 rounded-full text-xs">1</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Cancelled</span>
                        <span className="bg-red-100 text-red-700 px-2 rounded-full text-xs">2</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 bg-muted/10 p-4 rounded-xl border">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            Rental Order
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
                        <Button variant="outline" size="sm">Pickup</Button>
                        <Button variant="outline" size="sm">Return</Button>

                        <div className="flex items-center bg-background rounded-md border p-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-8 w-8 rounded", viewMode === 'kanban' ? "bg-muted shadow-sm" : "hover:bg-muted/50")}
                                onClick={() => setViewMode('kanban')}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-8 w-8 rounded", viewMode === 'list' ? "bg-muted shadow-sm" : "hover:bg-muted/50")}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    {viewMode === 'kanban' ? (
                        <OrderKanbanView orders={MOCK_ORDERS} />
                    ) : (
                        <OrderListView orders={MOCK_ORDERS} />
                    )}
                </div>
            </div>
        </div>
    )
}
