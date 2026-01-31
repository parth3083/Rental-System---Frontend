"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// Assuming you might add a UserNav or specific icons later
import { LayoutDashboard, ShoppingCart, Package, FileText, Settings } from "lucide-react"

export function AdminNav({
    className,
    role = "admin", // 'admin' or 'vendor'
    ...props
}: React.HTMLAttributes<HTMLElement> & { role?: "admin" | "vendor" }) {
    const pathname = usePathname()

    const routes = [
        {
            href: `/${role}/dashboard`,
            label: "Dashboard",
            icon: LayoutDashboard,
            active: pathname.includes(`/${role}/dashboard`),
        },
        {
            href: `/${role}/orders`,
            label: "Orders",
            icon: ShoppingCart,
            active: pathname.includes(`/${role}/orders`),
        },
        {
            href: `/${role}/products`,
            label: "Products",
            icon: Package,
            active: pathname.includes(`/${role}/products`),
        },
        {
            href: `/${role}/reports`,
            label: "Reports",
            icon: FileText,
            active: pathname.includes(`/${role}/reports`),
        },
        {
            href: `/${role}/settings`,
            label: "Settings",
            icon: Settings,
            active: pathname.includes(`/${role}/settings`),
        },
    ]

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "flex items-center text-sm font-medium transition-colors hover:text-primary",
                        route.active
                            ? "text-black dark:text-white"
                            : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}
