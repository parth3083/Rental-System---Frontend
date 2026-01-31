"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAppDispatch } from "@/redux/hook"
import { updateOrderStatus } from "@/redux/slices/orderSlice"
import { CheckCircle2, CreditCard, Lock } from "lucide-react"
import Link from "next/link"
import { use, useState } from "react"

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        dispatch(updateOrderStatus({ id: resolvedParams.id, status: 'completed' }))
        setSuccess(true)
        setLoading(false)
    }

    if (success) {
        return (
            <div className="container mx-auto py-20 px-4 flex flex-col items-center text-center max-w-lg">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
                <p className="text-muted-foreground mb-8">
                    Your payment of <span className="font-semibold text-foreground">$1250.00</span> has been processed successfully.
                    <br />
                    Order ID: <span className="font-mono text-xs">{resolvedParams.id}</span>
                </p>
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg w-full mb-8">
                    Your request has been processed.
                </div>
                <div className="flex gap-4 w-full">
                    <Link href="/customer/orders" className="flex-1">
                        <Button variant="outline" className="w-full">View My Orders</Button>
                    </Link>
                    <Link href="/customer/products" className="flex-1">
                        <Button className="w-full">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Secure Payment</h1>

            <form onSubmit={handlePayment} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup defaultValue="card" className="grid gap-4">
                            <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer bg-primary/5 border-primary">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="flex-1 cursor-pointer">
                                    <div className="font-medium">Credit / Debit Card</div>
                                    <div className="text-xs text-muted-foreground">Pay securely with your bank card</div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50">
                                <RadioGroupItem value="wallet" id="wallet" disabled />
                                <Label htmlFor="wallet" className="flex-1 cursor-pointer opacity-50">
                                    <div className="font-medium">Digital Wallet</div>
                                    <div className="text-xs text-muted-foreground">Coming Soon</div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Card Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Card Number</Label>
                            <div className="relative">
                                <Input placeholder="0000 0000 0000 0000" required />
                                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Expiry Date</Label>
                                <Input placeholder="MM / YY" required />
                            </div>
                            <div className="space-y-2">
                                <Label>CVC</Label>
                                <Input placeholder="123" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Cardholder Name</Label>
                            <Input placeholder="Name on card" required />
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                    {loading ? "Processing Payment..." : "Pay Now $1250.00"}
                </Button>

                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    Payments are secure and encrypted.
                </p>
            </form>
        </div>
    )
}
