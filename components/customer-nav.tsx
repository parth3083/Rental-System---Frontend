"use client"



import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Search, ShoppingCart, User } from "lucide-react"

export function CustomerNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()

    const routes = [
        {
            href: "/customer/products",
            label: "Products",
            active: pathname.includes("/customer/products"),
        },
        {
            href: "#",
            label: "Terms & Condition",
            active: false,
        },
        {
            href: "#",
            label: "About us",
            active: false,
        },
        {
            href: "#",
            label: "Contact Us",
            active: false,
        },
    ]

    return (
        <nav
            className={cn("flex items-center justify-between w-full space-x-4 lg:space-x-6 py-4", className)}
            {...props}
        >
            {/* Left: Logo & Links */}
            <div className="flex items-center gap-8">
                <Link
                    href="/customer/products"
                    className="flex items-center gap-2 font-bold text-xl tracking-tight"
                >
                    <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
                        <span className="text-primary">L</span>
                    </div>
                    Your Logo
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    {routes.map((route) => (
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

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-xl px-4 hidden md:block">
                <div className="relative">
                    <Input
                        placeholder="Search products..."
                        className="pr-10 bg-muted/40 border-slate-200 dark:border-slate-800"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full text-muted-foreground hover:text-primary">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Wishlist</span>
                </Button>

                <Link href="/customer/cart">
                    <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            3
                        </span>
                        <span className="sr-only">Cart</span>
                    </Button>
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/01.png" alt="@user" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">User Name</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    user@example.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                        </DropdownMenuItem>
                        <Link href="/customer/orders">
                            <DropdownMenuItem>
                                My Orders
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}
