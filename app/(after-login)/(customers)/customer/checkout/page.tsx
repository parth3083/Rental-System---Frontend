"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { clearCart } from "@/redux/slices/cartSlice"
import { createOrder } from "@/redux/slices/orderSlice"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const cartItems = useAppSelector((state) => state.cart.items) || []

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        zip: "",
        email: ""
    })

    // Calculate Total
    const total = cartItems.reduce((acc, item) => {
        const startDate = new Date(item.startDate)
        const endDate = new Date(item.endDate)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        return acc + (item.price * diffDays * item.quantity)
    }, 0)

    const handleRequestQuotation = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newOrder = {
            id: `ORD-${Date.now()}`,
            items: cartItems,
            status: 'quotation_pending' as const,
            total: total,
            date: new Date().toISOString(),
            deliveryAddress: { ...formData }
        }

        dispatch(createOrder(newOrder))
        dispatch(clearCart())

        router.push("/customer/orders")
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/customer/products">
                    <Button>Back to Shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-8">
            <Link href="/customer/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Address & Delivery */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup defaultValue="standard" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-accent/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                    <RadioGroupItem value="standard" id="r1" />
                                    <Label htmlFor="r1" className="flex-1 cursor-pointer">
                                        <div className="font-medium">Standard Delivery</div>
                                        <div className="text-xs text-muted-foreground">Delivered to your doorstep</div>
                                    </Label>
                                    <span className="font-bold text-sm">Free</span>
                                </div>
                                <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-accent/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                                    <RadioGroupItem value="pickup" id="r2" />
                                    <Label htmlFor="r2" className="flex-1 cursor-pointer">
                                        <div className="font-medium">Store Pickup</div>
                                        <div className="text-xs text-muted-foreground">Pick up from nearest hub</div>
                                    </Label>
                                    <span className="font-bold text-sm">Free</span>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact & Delivery Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleRequestQuotation} className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Email</Label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label>Address</Label>
                                    <Input
                                        required
                                        placeholder="123 Main St, Apartment 4B"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <Input
                                        required
                                        placeholder="Mumbai"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>ZIP / Postal Code</Label>
                                    <Input
                                        required
                                        placeholder="400001"
                                        value={formData.zip}
                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Order Summary */}
                <div>
                    <Card className="sticky top-4 bg-muted/20 border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {cartItems.map((item: any) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground truncate max-w-[150px]">{item.title} × {item.quantity}</span>
                                        <span className="font-medium">${item.price * item.quantity * (Math.ceil(Math.abs(new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1)}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Estimate</span>
                                <span>${total}</span>
                            </div>
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md text-xs mt-4">
                                Note: This is a quotation request. The final amount will be confirmed by the vendor.
                            </div>
                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full h-12 text-base mt-2"
                                disabled={loading}
                            >
                                {loading ? "Sending Request..." : "Request Quotation"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
