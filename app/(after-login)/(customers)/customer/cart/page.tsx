"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CartItem } from "@/components/cart-item"
import { CartSummary } from "@/components/cart-summary"

// Mock Cart Data
const INITIAL_CART_ITEMS = [
    {
        id: "1",
        productId: "9",
        title: "Professional DSLR Camera",
        brand: "Canon",
        image: "https://placehold.co/400x300/png?text=Camera",
        price: 200,
        unit: "day",
        quantity: 1,
        startDate: new Date("2026-01-31"),
        endDate: new Date("2026-02-03"),
    },
    {
        id: "2",
        productId: "5",
        title: "MacBook Pro 16\"",
        brand: "Apple",
        image: "https://placehold.co/400x300/png?text=Laptop",
        price: 150,
        unit: "day",
        quantity: 2,
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-02-04"),
    }
]

export default function CartPage() {
    const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS)

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(items => items.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQuantity }
            }
            return item
        }))
    }

    const removeItem = (id: string) => {
        setCartItems(items => items.filter(item => item.id !== id))
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/customer/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
                    <p className="text-muted-foreground text-sm">{cartItems.length} items in your cart</p>
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl">
                    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Looks like you haven't added anything to rent yet.</p>
                    <Link href="/customer/products">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Cart Items */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[380px] flex-shrink-0">
                        <CartSummary items={cartItems} />
                    </div>
                </div>
            )}
        </div>
    )
}
