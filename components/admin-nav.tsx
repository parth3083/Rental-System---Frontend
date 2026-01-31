"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ChevronDown, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()

    const otherRoutes = [
        {
            href: "/admin/products",
            label: "Products",
            active: pathname.includes("/admin/products"),
        },
        {
            href: "/admin/reports",
            label: "Reports",
            active: pathname.includes("/admin/reports"),
        },
        {
            href: "/admin/settings",
            label: "Settings",
            active: pathname.includes("/admin/settings"),
        },
    ]

    const isOrdersActive = pathname.startsWith("/admin/orders") || pathname.startsWith("/admin/invoiced") || pathname.startsWith("/admin/customer")

    return (
        <nav
            className={cn("flex items-center justify-between w-full space-x-4 lg:space-x-6 py-4 border-b mb-6", className)}
            {...props}
        >
            {/* Left: Logo & Links */}
            <div className="flex items-center gap-8">
                <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 font-bold text-xl tracking-tight"
                >
                    <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
                        <span className="text-primary">L</span>
                    </div>
                    Your Logo
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    {/* Orders Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className={cn(
                                "flex items-center text-sm font-medium transition-colors hover:text-primary focus:outline-none",
                                isOrdersActive ? "text-black dark:text-white" : "text-muted-foreground"
                            )}
                        >
                            Orders <ChevronDown className="ml-1 h-3 w-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <Link href="/admin/orders">
                                <DropdownMenuItem>Orders</DropdownMenuItem>
                            </Link>
                            <Link href="/admin/invoiced">
                                <DropdownMenuItem>Invoices</DropdownMenuItem>
                            </Link>
                            <Link href="/admin/customer">
                                <DropdownMenuItem>Customer</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Other Routes */}
                    {otherRoutes.map((route) => (
                        <Link
                            key={route.label}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                route.active
                                    ? "text-black dark:text-white"
                                    : "text-muted-foreground"
                            )}
                        >
                            {route.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right: Search & Profile */}
            <div className="flex items-center space-x-4">
                <div className="relative w-64 hidden md:block">
                    <Input
                        placeholder="Search..."
                        className="bg-muted/40"
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Name</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src="/avatars/02.png" alt="@admin" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Admin Name</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        admin@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}
