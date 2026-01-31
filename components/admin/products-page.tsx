"use client"

import { ProductKanbanView } from "@/components/admin/product-kanban-view"
import { ProductListView } from "@/components/admin/product-list-view"
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
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, Settings, Download, Upload } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock Data matching the structure
const MOCK_PRODUCTS = [
    { id: "1", name: "Gaming PC Set", price: 1200, vendor: "TechWorld", image: "/products/pc1.png", published: true, qty: 5, unit: "Set" },
    { id: "2", name: "Office Workstation", price: 800, vendor: "Office Supplies Co", image: "/products/pc2.png", published: true, qty: 10, unit: "Set" },
    { id: "3", name: "High-End Server", price: 2500, vendor: "TechWorld", image: "/products/pc3.png", published: false, qty: 2, unit: "Unit" }, // Unpublished
    { id: "4", name: "Standard Monitor", price: 150, vendor: "DisplayPros", image: "/products/monitor.png", published: true, qty: 20, unit: "Pcs" },
    { id: "5", name: "Mechanical Keyboard", price: 80, vendor: "TechWorld", image: "/products/keyboard.png", published: true, qty: 50, unit: "Pcs" },
    { id: "6", name: "Ergonomic Mouse", price: 50, vendor: "TechWorld", image: "/products/mouse.png", published: true, qty: 45, unit: "Pcs" },
]

export function ProductsPage() {
    const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban")

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* Sidebar (Keeping structure consistent with other admin pages) */}
            {/* <div className="w-48 flex-shrink-0 space-y-6 hidden lg:block">
                <div className="bg-card rounded-lg border p-1">
                    <Command className="bg-transparent">
                        <CommandList>
                            <CommandGroup heading="Products Menu">
                                <CommandItem className="cursor-pointer bg-accent text-accent-foreground">All Products</CommandItem>
                                <CommandItem className="cursor-pointer">Inventory</CommandItem>
                                <CommandItem className="cursor-pointer">Categories</CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            </div> */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 bg-muted/10 p-4 rounded-xl border">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold flex items-center gap-2 min-w-fit">
                            Products
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
                        <Link href="/admin/products/new">
                            <Button className="bg-purple-500 hover:bg-purple-600">New</Button>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-sm relative">
                        <Input placeholder="Searchbar..." className="bg-background" />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* View Switcher & Pager */}
                    <div className="flex items-center gap-6">
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

                        <div className="flex items-center bg-background rounded-md border p-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded hover:bg-muted/50">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded hover:bg-muted/50">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {viewMode === 'kanban' ? (
                        <ProductKanbanView products={MOCK_PRODUCTS} />
                    ) : (
                        <ProductListView products={MOCK_PRODUCTS} />
                    )}
                </div>
            </div>
        </div>
    )
}
