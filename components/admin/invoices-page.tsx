"use client"

import { InvoiceKanbanView } from "@/components/admin/invoice-kanban-view"
import { InvoiceListView } from "@/components/admin/invoice-list-view"
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

// Mock invoices data
export const MOCK_INVOICES = [
    { id: "1", reference: "INV/2026/0001", date: "Jan 22", customer: "Spectacular Goshawk", total: 400000, status: "DRAFT" as const, displayStatus: "Draft" },
    { id: "2", reference: "INV/2026/0002", date: "Jan 23", customer: "Vigorous Seahorse", total: 150000, status: "POSTED" as const, displayStatus: "Posted" },
    { id: "3", reference: "INV/2026/0003", date: "Jan 24", customer: "Gracious Chinchilla", total: 775000, status: "POSTED" as const, displayStatus: "Posted" },
    { id: "4", reference: "INV/2026/0004", date: "Jan 25", customer: "Glorious Walrus", total: 50000, status: "DRAFT" as const, displayStatus: "Draft" },
]

export function InvoicesPage() {
    const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban")

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
                                    <CommandItem className="cursor-pointer bg-accent text-accent-foreground">Invoices</CommandItem>
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
                        Invoice Stats
                        <Settings className="h-4 w-4" />
                    </h3>
                    <div className="flex justify-between items-center">
                        <span>Total:</span>
                        <span className="font-bold">{MOCK_INVOICES.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Draft</span>
                        <span className="bg-gray-100 text-gray-700 px-2 rounded-full text-xs">
                            {MOCK_INVOICES.filter(i => i.status === "DRAFT").length}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Posted</span>
                        <span className="bg-green-100 text-green-700 px-2 rounded-full text-xs">
                            {MOCK_INVOICES.filter(i => i.status === "POSTED").length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 bg-muted/10 p-4 rounded-xl border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            Invoices
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
                        <Input placeholder="Search invoices..." className="bg-background" />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-4">
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

                <div className="flex-1 overflow-auto">
                    {viewMode === 'kanban' ? (
                        <InvoiceKanbanView invoices={MOCK_INVOICES} />
                    ) : (
                        <InvoiceListView invoices={MOCK_INVOICES} />
                    )}
                </div>
            </div>
        </div>
    )
}
