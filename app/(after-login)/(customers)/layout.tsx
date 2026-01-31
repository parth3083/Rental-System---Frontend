"use client"

import { CustomerNav } from "@/components/customer-nav"
import { WishlistProvider } from "@/contexts/wishlist-context"

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <WishlistProvider>
            <div className="flex flex-col">
                <div className="border-b bg-white dark:bg-black">
                    <div className="flex h-16 items-center px-4 md:px-8 container mx-auto">
                        <CustomerNav />
                    </div>
                </div>
                <main className="flex-1 container mx-auto py-6">
                    {children}
                </main>
            </div>
        </WishlistProvider>
    )
}
