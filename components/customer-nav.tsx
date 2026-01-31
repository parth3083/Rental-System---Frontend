"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function CustomerNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()

    const routes = [
        {
            href: "/customer/browse",
            label: "Browse",
            active: pathname.includes("/customer/browse"),
        },
        {
            href: "/customer/orders",
            label: "My Orders",
            active: pathname.includes("/customer/orders"),
        },
    ]

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/customer/browse"
                className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
            >
                RentalSys
            </Link>
            {routes.map((route) => (
                <Link
                    key={route.href}
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
        </nav>
    )
}
